"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

export default function HorizontalScroll({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;

    if (!container || !track) {
      return;
    }

    const ctx = gsap.context(() => {
      const firstSet = track.querySelector<HTMLElement>(".horizontal-loop-set");

      if (!firstSet) {
        return;
      }

      const distance = () => firstSet.scrollWidth;
      const loop = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        duration: 34,
        repeat: -1,
        repeatRefresh: true,
      });

      const onWheel = (event: WheelEvent) => {
        event.preventDefault();
        const delta = Math.abs(event.deltaY) > Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
        const direction = delta >= 0 ? 1 : -1;
        const speed = gsap.utils.clamp(1.4, 5.5, Math.abs(delta) / 90);

        gsap.to(loop, {
          timeScale: direction * speed,
          duration: 0.35,
          ease: "power3.out",
          overwrite: true,
        });

        gsap.to(loop, {
          timeScale: direction,
          duration: 1.2,
          delay: 0.18,
          ease: "power2.out",
        });
      };

      container.addEventListener("wheel", onWheel, { passive: false });

      return () => {
        container.removeEventListener("wheel", onWheel);
        loop.kill();
      };
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="horizontal-scroll" aria-label="Horizontal projects gallery">
      <div ref={trackRef} className="horizontal-track">
        {children}
      </div>
    </section>
  );
}
