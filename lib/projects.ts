export interface PhotoItem {
  src: string;
  src2?: string;
  layout: "full" | "left-60" | "right-60" | "double";
  speed: number;
  speed2?: number;
  caption?: string;
}

export interface Project {
  slug: string;
  title: string;
  year: string;
  description: string;
  cover: string;
  photos: PhotoItem[];
}

const allPhotos = [
  "/photos/image-1.jpg",
  "/photos/image-2.jpg",
  "/photos/image-3.jpg",
  "/photos/image-4.jpg",
  "/photos/image-5.jpg",
  "/photos/image-6.jpg",
];

export const projects: Project[] = [
  {
    slug: "portraits",
    title: "Portraits",
    year: "2024",
    description: "Editorial portraits built around quiet gestures, dark navy tonality, and a soft handwritten aftertaste.",
    cover: allPhotos[0],
    photos: [
      { src: allPhotos[0], layout: "full", speed: 0.82, caption: "Portrait study / natural light" },
      { src: allPhotos[1], layout: "right-60", speed: 1.12, caption: "Soft contrast, held gaze" },
      { src: allPhotos[2], src2: allPhotos[3], layout: "double", speed: 0.9, speed2: 1.18, caption: "Paired frames from the same sitting" },
      { src: allPhotos[4], layout: "left-60", speed: 1.06, caption: "Quiet editorial fragment" },
    ],
  },
  {
    slug: "editorial",
    title: "Editorial",
    year: "2025",
    description: "A mixed Russian and English visual essay about intimacy, posture, and the pause before movement.",
    cover: allPhotos[1],
    photos: [
      { src: allPhotos[1], layout: "full", speed: 0.78, caption: "Editorial cover frame" },
      { src: allPhotos[5], layout: "left-60", speed: 1.2, caption: "Texture, fabric, negative space" },
      { src: allPhotos[0], src2: allPhotos[4], layout: "double", speed: 0.88, speed2: 1.24, caption: "Два кадра, один ритм" },
      { src: allPhotos[2], layout: "right-60", speed: 1.04, caption: "After-image" },
    ],
  },
  {
    slug: "light-studies",
    title: "Light Studies",
    year: "2024",
    description: "A slow series about the way light falls across skin, rooms, and the emotional surface of a portrait.",
    cover: allPhotos[5],
    photos: [
      { src: allPhotos[5], layout: "full", speed: 0.84, caption: "Light study no. 01" },
      { src: allPhotos[3], layout: "right-60", speed: 1.16, caption: "Room tone" },
      { src: allPhotos[2], src2: allPhotos[1], layout: "double", speed: 0.92, speed2: 1.22, caption: "Свет и тишина" },
      { src: allPhotos[0], layout: "left-60", speed: 1.08, caption: "Last frame" },
    ],
  },
  {
    slug: "quiet-rooms",
    title: "Quiet Rooms",
    year: "2023",
    description: "Private interiors, restrained color, and portraits that feel almost overheard.",
    cover: allPhotos[2],
    photos: [
      { src: allPhotos[2], layout: "full", speed: 0.8, caption: "Interior portrait" },
      { src: allPhotos[4], layout: "left-60", speed: 1.12, caption: "Window pause" },
      { src: allPhotos[3], src2: allPhotos[5], layout: "double", speed: 0.9, speed2: 1.18, caption: "Quiet rooms / quiet bodies" },
      { src: allPhotos[1], layout: "right-60", speed: 1.06, caption: "Final stillness" },
    ],
  },
  {
    slug: "skin-and-shadow",
    title: "Skin & Shadow",
    year: "2025",
    description: "Dark, tactile, minimal portraits where the image feels closer to a memory than a document.",
    cover: allPhotos[4],
    photos: [
      { src: allPhotos[4], layout: "full", speed: 0.76, caption: "Skin & shadow" },
      { src: allPhotos[0], layout: "right-60", speed: 1.18, caption: "Dark navy mood" },
      { src: allPhotos[5], src2: allPhotos[2], layout: "double", speed: 0.86, speed2: 1.26, caption: "Two close distances" },
      { src: allPhotos[3], layout: "left-60", speed: 1.04, caption: "After dusk" },
    ],
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function getNextProject(slug: string) {
  const index = projects.findIndex((project) => project.slug === slug);
  return projects[(index + 1) % projects.length];
}
