import HeroTitle from "@/components/HeroTitle";
import HorizontalScroll from "@/components/HorizontalScroll";
import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/lib/projects";

export default function Home() {
  return (
    <main className="home-scroll-shell" aria-label="Mariia Khoziainova photography projects">
      <HeroTitle />
      <HorizontalScroll>
        {[0, 1].map((loopIndex) => (
          <div className="horizontal-loop-set" key={loopIndex}>
            {projects.map((project, index) => (
              <ProjectCard
                key={`${loopIndex}-${project.slug}`}
                project={project}
                priority={loopIndex === 0 && index < 3}
                isClone={loopIndex > 0}
              />
            ))}
          </div>
        ))}
      </HorizontalScroll>
      <div className="site-title-lockup" aria-hidden="true">
        <h1>MARIIA&nbsp;KHOZIAINOVA</h1>
        <p>photographer</p>
      </div>
    </main>
  );
}
