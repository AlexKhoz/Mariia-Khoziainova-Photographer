"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { Project } from "@/lib/projects";

export default function ProjectCard({
  project,
  priority = false,
  isClone = false,
}: {
  project: Project;
  priority?: boolean;
  isClone?: boolean;
}) {
  const router = useRouter();

  return (
    <article
      className="project-card"
      data-cursor="hover"
      onClick={() => router.push(`/projects/${project.slug}`)}
      role="link"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          router.push(`/projects/${project.slug}`);
        }
      }}
      aria-label={`Open ${project.title}`}
    >
      <motion.div
        className="project-card__image"
        layoutId={isClone ? undefined : `project-${project.slug}`}
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.75, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <Image
          src={project.cover}
          alt={project.title}
          fill
          priority={priority}
          sizes="(max-width: 760px) 82vw, 32vw"
          style={{ objectFit: "cover" }}
        />
      </motion.div>
    </article>
  );
}
