/** Client-only: true when the visitor asked the OS to cut down on motion. */
export const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
