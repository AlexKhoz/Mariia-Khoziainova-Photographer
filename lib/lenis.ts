import Lenis from "@studio-freight/lenis";

let lenis: Lenis | null = null;

export function createLenis() {
  if (!lenis) {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      smoothWheel: true,
    });
  }

  return lenis;
}

export function getLenis() {
  return lenis;
}

export function destroyLenis() {
  lenis?.destroy();
  lenis = null;
}
