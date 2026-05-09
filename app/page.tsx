import HeroTitle from "@/components/HeroTitle";
import HorizontalScroll from "@/components/HorizontalScroll";
import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/lib/projects";

export default function Home() {
  return (
    <main className="home-scroll-shell" aria-label="Mariia Khoziainova photography projects">
      <HeroTitle />
      <HorizontalScroll>
        {projects.map((project, index) => (
          <ProjectCard key={project.slug} project={project} priority={index < 2} />
        ))}
      </HorizontalScroll>
      <div className="site-title-lockup" aria-hidden="true">
        <h1>MARIIA&nbsp;KHOZIAINOVA</h1>
        <p>photographer</p>
      </div>
    </main>
  );
}
