"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor || !window.matchMedia("(pointer: fine)").matches) {
      return;
    }

    const xTo = gsap.quickTo(cursor, "x", { duration: 0.55, ease: "power3" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.55, ease: "power3" });

    const move = (event: MouseEvent) => {
      gsap.to(cursor, { opacity: 1, duration: 0.25 });
      xTo(event.clientX);
      yTo(event.clientY);
    };

    const over = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      setHovered(Boolean(target?.closest("[data-cursor='hover'], a, button")));
    };

    const leave = () => {
      gsap.to(cursor, { opacity: 0, duration: 0.25 });
    };

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseover", over);
    document.addEventListener("mouseout", over);
    document.addEventListener("mouseleave", leave);

    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", over);
      document.removeEventListener("mouseout", over);
      document.removeEventListener("mouseleave", leave);
    };
  }, []);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) {
      return;
    }

    gsap.to(cursor, {
      width: hovered ? 54 : 10,
      height: hovered ? 54 : 10,
      backgroundColor: hovered ? "transparent" : "#0C1945",
      duration: 0.35,
      ease: "power3.out",
    });
  }, [hovered]);

  return <div ref={cursorRef} className="custom-cursor" aria-hidden="true" />;
}
