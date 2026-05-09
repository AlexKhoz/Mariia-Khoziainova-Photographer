"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { Project } from "@/lib/projects";

export default function ProjectCard({
  project,
  priority = false,
}: {
  project: Project;
  priority?: boolean;
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
        layoutId={`project-${project.slug}`}
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.75, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <Image
          src={project.cover}
          alt={project.title}
          fill
          priority={priority}
          sizes="100vw"
          style={{ objectFit: "cover" }}
        />
      </motion.div>
      <div className="project-card__shade" />
      <motion.div
        className="project-card__caption"
        initial={false}
        whileHover="hover"
      >
        <motion.h2
          className="project-card__title"
          initial={{ opacity: 0.82, y: 18 }}
          whileHover={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          {project.title}
        </motion.h2>
        <motion.p
          className="project-card__meta"
          initial={{ opacity: 0, y: 18 }}
          whileHover={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          {project.year}
          <br />
          {project.description}
        </motion.p>
      </motion.div>
    </article>
  );
}
