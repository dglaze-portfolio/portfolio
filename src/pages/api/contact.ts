/**
 * Contact-form endpoint — the one server route on an otherwise
 * fully prerendered site (hence the Vercel adapter in astro.config).
 *
 * Flow: plain HTML form on /contact POSTs here → validate + honeypot
 * check → send the message to De's inbox via Resend's HTTP API
 * (no SDK dependency) → 303-redirect to a static thanks/error page,
 * so the whole thing works with zero client JS.
 *
 * Requires the RESEND_API_KEY environment variable (set in the Vercel
 * project settings, and in a local .env for `astro dev`).
 *
 * NOTE: until deannaglaze.com is verified as a domain in Resend, the
 * from address must stay `onboarding@resend.dev` and Resend will only
 * deliver to the account owner's own email — which is exactly what a
 * contact form needs. After verifying the domain, switch FROM to e.g.
 * `Deanna Glaze <contact@deannaglaze.com>`.
 */
import type { APIRoute } from 'astro';

export const prerender = false;

const RESEND_ENDPOINT = 'https://api.resend.com/emails';
// Must match the Resend account owner's address until deannaglaze.com is
// verified in Resend — test-mode sends are only delivered to that inbox.
const TO = 'deannaglaze@gmail.com';
const FROM = 'Portfolio contact form <onboarding@resend.dev>';

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/**
 * Our own cross-site-POST guard, replacing Astro's checkOrigin (disabled
 * in astro.config — behind Vercel's proxy it compares against a wrongly
 * reconstructed scheme and rejects legitimate submissions). We compare
 * HOSTS only, which survives the proxy: the page and the endpoint are
 * always served from the same host. Also allows the production domain
 * and *.vercel.app previews explicitly. Worst case for a false-allow is
 * a spam send to our own inbox — validation + honeypot still apply.
 */
const ALLOWED_HOSTS = new Set(['deannaglaze.com', 'www.deannaglaze.com']);

function originAllowed(request: Request): boolean {
  const origin = request.headers.get('origin');
  // No Origin header = not a cross-site browser form post.
  if (!origin || origin === 'null') return true;
  try {
    const host = new URL(origin).host;
    return (
      host === new URL(request.url).host ||
      ALLOWED_HOSTS.has(host) ||
      host.endsWith('.vercel.app')
    );
  } catch {
    return false;
  }
}

export const POST: APIRoute = async ({ request, redirect }) => {
  if (!originAllowed(request)) {
    console.error('contact: blocked cross-site post from', request.headers.get('origin'));
    return redirect('/contact/error', 303);
  }

  let data: FormData;
  try {
    data = await request.formData();
  } catch {
    return redirect('/contact/error', 303);
  }

  const name = String(data.get('name') ?? '').trim();
  const email = String(data.get('email') ?? '').trim();
  const message = String(data.get('message') ?? '').trim();
  const honeypot = String(data.get('company') ?? '');

  // Bots helpfully fill the visually-hidden "company" field.
  // Pretend success and send nothing.
  if (honeypot) return redirect('/contact/thanks', 303);

  if (
    !name ||
    !message ||
    !EMAIL_RE.test(email) ||
    name.length > 200 ||
    email.length > 200 ||
    message.length > 5000
  ) {
    return redirect('/contact/error', 303);
  }

  const apiKey = import.meta.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('contact: RESEND_API_KEY is not set');
    return redirect('/contact/error', 303);
  }

  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM,
        to: [TO],
        reply_to: [email],
        subject: `Portfolio contact — ${name}`,
        text: `From: ${name} <${email}>\n\n${message}`,
      }),
    });

    if (!res.ok) {
      console.error('contact: Resend responded', res.status, await res.text());
      return redirect('/contact/error', 303);
    }
  } catch (err) {
    console.error('contact: send failed', err);
    return redirect('/contact/error', 303);
  }

  return redirect('/contact/thanks', 303);
};
