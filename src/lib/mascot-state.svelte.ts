import { browser } from "$app/environment";
import { topAnimation, topAnimations, type TopAnimation } from "./site-config";

/** localStorage key holding the visitor's pick. Mirrored in app.html. */
const STORAGE_KEY = "mascot";

function isTopAnimation(value: string | undefined): value is TopAnimation {
  return (topAnimations as readonly string[]).includes(value ?? "");
}

/**
 * Which critter rides the printer's top edge. `site-config.ts` sets the
 * default; the deck menu lets a visitor override it and the pick is
 * remembered. The inline script in app.html copies the stored value onto
 * <html data-mascot> before paint, and `ready` keeps the deck empty until
 * hydration has read it — so nobody sees the default mascot flash past on
 * the way to their own.
 */
export const mascot = $state<{ current: TopAnimation; ready: boolean }>({
  current: topAnimation,
  ready: false,
});

export function hydrateMascot(): void {
  if (!browser) return;
  const stored = document.documentElement.dataset.mascot;
  mascot.current = isTopAnimation(stored) ? stored : topAnimation;
  mascot.ready = true;
}

export function setMascot(value: TopAnimation): void {
  mascot.current = value;
  if (!browser) return;
  document.documentElement.dataset.mascot = value;
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {}
}
