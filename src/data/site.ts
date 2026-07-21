/**
 * Site-wide configuration.
 * Edit here once — header, footer, and meta tags all read from this.
 */

export const SITE = {
  name: 'Deanna Glaze',
  title: 'Deanna Glaze — Product Design Leader',
  description:
    'Product design leader specializing in UX research, design management, and AI strategy. I make complex things clear with words, systems, and AI strategy.',
  url: 'https://deannaglaze.com',
  author: 'Deanna Glaze',
} as const;

export const NAV = [
  { label: 'Home', href: '/' },
  { label: 'Work', href: '/work' },
  { label: 'About', href: '/about' },
  { label: 'Design Resources', href: '/designresources' },
] as const;

export const SOCIAL = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/deannaglaze',
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/monkeyshineme/',
  },
] as const;

/** Where "Let's chat" CTAs point — the on-site contact form
    (POSTs to /api/contact, delivered by Resend). */
export const CONTACT_URL = '/contact';
