"use client";

import { useLayoutEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import NextProjectSection from "@/components/NextProjectSection";
import type { PhotoItem, Project } from "@/lib/projects";

gsap.registerPlugin(ScrollTrigger);

export default function ProjectPage({
  project,
  nextProject,
}: {
  project: Project;
  nextProject: Project;
}) {
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-speed]").forEach((element) => {
        const speed = Number.parseFloat(element.dataset.speed || "1");

        gsap.to(element, {
          yPercent: (speed - 1) * 30,
          ease: "none",
          scrollTrigger: {
            trigger: element,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      gsap.utils.toArray<HTMLElement>(".photo-reveal").forEach((section) => {
        gsap.fromTo(
          section,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
            },
          },
        );
      });
    });

    return () => ctx.revert();
  }, [project.slug]);

  return (
    <main className="project-page">
      <section className="project-hero">
        <motion.div className="absolute inset-0" layoutId={`project-${project.slug}`}>
          <Image
            src={project.cover}
            alt={project.title}
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover" }}
          />
        </motion.div>
        <div className="project-card__shade" />
        <div className="project-hero__text">
          <div>
            <p className="project-kicker">{project.year} / Mariia Khoziainova</p>
            <h1 className="project-hero__title">{project.title}</h1>
          </div>
          <p className="project-description">{project.description}</p>
        </div>
      </section>

      <section className="essay-block photo-reveal">
        <div className="essay-block__inner">
          <h2>из тишины</h2>
          <p>
            A series of editorial fragments where the image keeps a cinematic distance:
            English structure, Russian softness, and a dark navy rhythm carried from
            the original draft.
          </p>
        </div>
      </section>

      {project.photos.map((photo, index) => (
        <PhotoSection key={`${project.slug}-${photo.src}-${index}`} photo={photo} index={index} />
      ))}

      <NextProjectSection nextProject={nextProject} />
    </main>
  );
}

function PhotoSection({ photo, index }: { photo: PhotoItem; index: number }) {
  if (photo.layout === "full") {
    return (
      <section className="photo-reveal w-full h-screen relative overflow-hidden">
        <div className="photo-frame h-full w-full" data-speed={photo.speed}>
          <Image
            fill
            priority={index === 0}
            src={photo.src}
            alt={photo.caption || "Mariia Khoziainova photography"}
            sizes="100vw"
            style={{ objectFit: "cover" }}
          />
        </div>
      </section>
    );
  }

  if (photo.layout === "double") {
    return (
      <section className="photo-reveal w-full py-16 flex gap-6 px-8 max-md:flex-col">
        <div className="flex-1 h-[80vh] relative" data-speed={photo.speed}>
          <Image
            fill
            src={photo.src}
            alt={photo.caption || "Mariia Khoziainova photography"}
            sizes="(max-width: 768px) 100vw, 50vw"
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="flex-1 h-[80vh] relative mt-16 max-md:mt-0" data-speed={photo.speed2 ?? 1.2}>
          <Image
            fill
            src={photo.src2 ?? photo.src}
            alt={photo.caption || "Mariia Khoziainova photography"}
            sizes="(max-width: 768px) 100vw, 50vw"
            style={{ objectFit: "cover" }}
          />
        </div>
      </section>
    );
  }

  const isRight = photo.layout === "right-60";

  return (
    <section
      className={`photo-reveal w-full py-24 flex ${isRight ? "justify-end pr-16 max-md:pr-6" : "justify-start pl-16 max-md:pl-6"}`}
    >
      <div className="w-3/5 max-md:w-[88vw]">
        <div className="photo-frame h-[70vh] w-full" data-speed={photo.speed}>
          <Image
            fill
            src={photo.src}
            alt={photo.caption || "Mariia Khoziainova photography"}
            sizes="(max-width: 768px) 88vw, 60vw"
            style={{ objectFit: "cover" }}
          />
        </div>
        {photo.caption ? <p className="photo-caption">{photo.caption}</p> : null}
      </div>
    </section>
  );
}
