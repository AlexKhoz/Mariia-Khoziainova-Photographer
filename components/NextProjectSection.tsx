"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { Project } from "@/lib/projects";

export default function NextProjectSection({ nextProject }: { nextProject: Project }) {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);

  return (
    <section
      className="next-project"
      data-cursor="hover"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => router.push(`/projects/${nextProject.slug}`)}
      role="link"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          router.push(`/projects/${nextProject.slug}`);
        }
      }}
      aria-label={`Open next project ${nextProject.title}`}
    >
      <motion.div
        animate={{ scale: hovered ? 1 : 1.08 }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="h-full w-full"
        layoutId={`project-${nextProject.slug}`}
      >
        <Image
          fill
          src={nextProject.cover}
          alt={nextProject.title}
          sizes="100vw"
          style={{ objectFit: "cover" }}
        />
      </motion.div>
      <div className="next-project__overlay">
        <motion.div
          animate={{ opacity: hovered ? 1 : 0.72, y: hovered ? 0 : 10 }}
          transition={{ duration: 0.4 }}
        >
          <span className="next-project__label">NEXT PROJECT</span>
          <span className="next-project__title">{nextProject.title}</span>
        </motion.div>
      </div>
    </section>
  );
}
