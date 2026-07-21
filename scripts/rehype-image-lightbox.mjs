/**
 * rehype-image-lightbox
 * ---------------------
 * Wraps every image in markdown content with a zero-JS lightbox using
 * the HTML popover API:
 *
 *   <img …>            becomes
 *
 *   <button class="lightbox-trigger" popovertarget="img-lightbox-N">
 *     <img …>
 *   </button>
 *   <span id="img-lightbox-N" popover class="lightbox">
 *     <img …>  (same optimized asset)
 *     <button class="lightbox__close" …>×</button>
 *   </span>
 *
 * The popover container is a <span> (phrasing content) so the markup
 * stays valid inside the <p> that markdown wraps images in. Styling
 * lives in src/styles/global.css (.lightbox-trigger / .lightbox).
 * Zero client JavaScript — open/close is native popover behavior.
 */
export default function rehypeImageLightbox() {
  return (tree) => {
    let counter = 0;

    const walk = (node) => {
      if (!node.children) return;

      node.children = node.children.flatMap((child) => {
        walk(child);

        if (child.type === 'element' && child.tagName === 'img') {
          counter += 1;
          const id = `img-lightbox-${counter}`;

          const fullImg = structuredClone(child);

          const trigger = {
            type: 'element',
            tagName: 'button',
            properties: {
              className: ['lightbox-trigger'],
              popoverTarget: id,
              ariaLabel: 'View larger image',
            },
            children: [child],
          };

          const popover = {
            type: 'element',
            tagName: 'span',
            properties: {
              id,
              popover: 'auto',
              className: ['lightbox'],
            },
            children: [
              fullImg,
              {
                type: 'element',
                tagName: 'button',
                properties: {
                  className: ['lightbox__close'],
                  popoverTarget: id,
                  popoverTargetAction: 'hide',
                  ariaLabel: 'Close',
                },
                children: [{ type: 'text', value: '×' }],
              },
            ],
          };

          return [trigger, popover];
        }

        return [child];
      });
    };

    walk(tree);
  };
}
