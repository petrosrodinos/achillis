/**
 * Probes optional UI textures once and flags them on <html> so CSS only references art that exists
 * (no 404 spam, no broken textures while generated art is still in progress).
 */
export function probeUiTextures(): void {
  const img = new Image();
  img.onload = () => {
    document.documentElement.dataset.parchment = '1';
  };
  img.src = '/assets/images/ui/parchment.webp';
}
