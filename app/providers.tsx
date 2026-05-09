"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CustomCursor from "@/components/CustomCursor";
import PageTransition from "@/components/PageTransition";
import { createLenis, destroyLenis } from "@/lib/lenis";

gsap.registerPlugin(ScrollTrigger, Flip);

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = createLenis();

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        if (arguments.length && typeof value === "number") {
          lenis.scrollTo(value, { immediate: true });
        }

        return lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
    });

    ScrollTrigger.defaults({ scroller: document.body });
    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(tick);
      ScrollTrigger.killAll();
      destroyLenis();
    };
  }, []);

  return (
    <>
      <CustomCursor />
      <PageTransition>{children}</PageTransition>
    </>
  );
}
