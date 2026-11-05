// Edit this file to personalize every section. Do not publish personal details you do not want public.
export const portfolio = {
  site: {
    title: "Benjo | E-Portfolio",
    description: "Benjo's Computer Programming 1 E-Portfolio at Jose Rizal University.",
    year: 2026,
  },
  person: {
    fullName: "Benjo Terrado",
    firstName: "Benjo",
    initials: "BBT",
    school: "Jose Rizal University",
    program: "BS Information Technology",
    yearLevel: "1st Year",
    tagline: "Learning by building, one program at a time.",
    rotatingTitles: ["Aspiring Health Informatics Professional", "Lifelong Learner"],
    statusPill: "Student at JRU",
    location: "Mandaluyong City, Philippines",
    email: "BENJO.TERRADO@MY.JRU.EDU",
    socials: [
      { label: "GitHub", url: "TODO: https://github.com/your-username" },
      { label: "LinkedIn", url: "TODO: https://linkedin.com/in/your-profile" },
    ],
    resumeFile: null as string | null,
    portrait: "/images/portrait.jpg",
  },
  about: {
    paragraphs: ["I am building my foundations in programming and digital problem-solving through coursework at Jose Rizal University. This space brings together my activities, work in progress, and reflections as I continue learning."],
    skills: [
      { group: "Languages", items: ["Java"] },
    ],
    goals: "To become more confident in writing code, understanding systems, and delivering well-documented projects.",
  },
  academics: {
    compiledWorks: { title: "Compiled PTs and Products", file: "/files/compiled-pts-and-products.pdf", description: "A collection of performance tasks, machine problems, activities, seatwork, and other course outputs." },
    documentation: { title: "Project Documentation", file: "/files/project-documentation.pdf", description: "Project background, requirements, design, and implementation notes. If applicable." },
    videoPresentation: { title: "Video Project Presentation", embedUrl: null as string | null, file: null as string | null, description: "A recorded walkthrough of the project. If applicable." },
    works: [] as { title: string; description: string; tech: string[]; link?: string }[],
  },
  experience: [] as { role: string; org: string; type: "Work" | "Internship" | "Immersion"; start: string; end: string; location?: string; bullets: string[] }[],
  seminars: [] as { title: string; organizer: string; date: string; description?: string; certificate?: string }[],
  organizations: [] as { name: string; role: string; start: string; end: string; scope: "In campus" | "Out of campus"; description: string }[],
  awards: [] as { title: string; issuer: string; date: string; description?: string; proof?: string }[],
  otherInfo: { heading: "Other Information", paragraphs: [] as string[] },
  reflections: [
    { term: "Prelim Term", topics: ["TODO: Topic 1"], body: ["TODO: Reflect on what you learned during the prelim term, challenges you faced, and how you applied the concepts."] },
    { term: "Midterm", topics: ["TODO: Topic 1"], body: ["TODO: Reflect on your midterm learning and experiences in Computer Programming 1."] },
    { term: "Final Term", topics: ["TODO: Topic 1"], body: ["TODO: Reflect on your final-term learning, growth, and next steps."] },
  ],
  contact: { heading: "Let's connect.", subheading: "Have a question or want to talk about a project? Send a message." },
} as const;
