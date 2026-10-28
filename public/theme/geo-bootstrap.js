/*!
 * Optional Geo integration helpers for Bootstrap 6.0.0-alpha.1 (MIT).
 * Normalises keyboard focus across browser engines without replacing plugins.
 */
export function installGeoEnhancements(root = document) {
  const focusOverlay = event => {
    const overlay = event.target;
    if (!(overlay instanceof HTMLElement) || !overlay.hasAttribute('open') || overlay.contains(document.activeElement)) return;
    const first = overlay.querySelector('[autofocus], input:not(:disabled):not([type="hidden"]), select:not(:disabled), textarea:not(:disabled), button:not(:disabled), a[href], [tabindex="0"]');
    (first || overlay).focus({ preventScroll: true });
  };
  const focusMenuSelection = event => {
    const item = event.target.closest?.('.menu-item');
    const menu = item?.closest('.menu.show');
    if (menu && !item.matches(':disabled, .disabled')) item.focus({ preventScroll: true });
  };
  root.addEventListener('shown.bs.dialog', focusOverlay);
  root.addEventListener('shown.bs.drawer', focusOverlay);
  root.addEventListener('click', focusMenuSelection, true);
  return () => {
    root.removeEventListener('shown.bs.dialog', focusOverlay);
    root.removeEventListener('shown.bs.drawer', focusOverlay);
    root.removeEventListener('click', focusMenuSelection, true);
  };
}
