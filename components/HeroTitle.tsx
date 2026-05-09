"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";

const TITLE = "MARIIA KHOZIAINOVA";

export default function HeroTitle() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const scriptRef = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(true);

  useLayoutEffect(() => {
    const hasPlayed = window.localStorage.getItem("mariia-intro-played") === "true";

    if (hasPlayed) {
      setVisible(false);
      return;
    }

    const ctx = gsap.context(() => {
      const chars = titleRef.current?.querySelectorAll(".hero-char") ?? [];

      gsap.set(scriptRef.current, { y: 20, opacity: 0 });
      gsap.set(chars, { y: 120, opacity: 0, rotateX: -90 });

      const timeline = gsap.timeline({
        defaults: { ease: "power4.out" },
        onComplete: () => {
          window.localStorage.setItem("mariia-intro-played", "true");
          setVisible(false);
        },
      });

      timeline
        .to(chars, {
          y: 0,
          opacity: 1,
          rotateX: 0,
          stagger: 0.04,
          duration: 1.2,
          delay: 0.3,
        })
        .to(
          scriptRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power2.out",
          },
          1.2,
        )
        .to(overlayRef.current, {
          yPercent: -100,
          duration: 1.05,
          ease: "expo.inOut",
        });
    }, overlayRef);

    return () => ctx.revert();
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div ref={overlayRef} className="hero-intro">
      <div className="hero-intro__inner">
        <h1 ref={titleRef} className="hero-intro__title" aria-label={TITLE}>
          {[...TITLE].map((char, index) => (
            <span className="hero-char" key={`${char}-${index}`} aria-hidden="true">
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </h1>
        <span ref={scriptRef} className="hero-intro__script">
          photographer
        </span>
      </div>
    </div>
  );
}
