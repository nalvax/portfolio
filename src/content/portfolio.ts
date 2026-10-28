// Edit this file to personalize every section. Do not publish personal details you do not want public.
export const portfolio = {
  site: {
    title: "TODO: Full Name | JRU E-Portfolio",
    description: "TODO: A Computer Programming 1 student e-portfolio at Jose Rizal University.",
    year: 2026,
  },
  person: {
    fullName: "TODO: Full Name",
    firstName: "TODO",
    initials: "TODO",
    school: "Jose Rizal University",
    program: "TODO: Program (e.g. BS Information Technology)",
    yearLevel: "TODO: Year level",
    tagline: "Learning by building, one program at a time.",
    rotatingTitles: ["TODO: Aspiring Software Developer", "TODO: Lifelong Learner"],
    statusPill: "Student at JRU",
    location: "TODO: City, Country",
    email: "TODO@example.com",
    socials: [
      { label: "GitHub", url: "TODO: https://github.com/your-username" },
      { label: "LinkedIn", url: "TODO: https://linkedin.com/in/your-profile" },
    ],
    resumeFile: null as string | null,
    portrait: "/images/portrait.jpg",
  },
  about: {
    paragraphs: ["TODO: Write a short introduction about yourself, your interests, and what brought you to programming."],
    skills: [
      { group: "Languages", items: ["TODO: Java", "TODO: HTML/CSS"] },
      { group: "Tools", items: ["TODO: VS Code", "TODO: Git"] },
    ],
    goals: "TODO: Describe your learning and career goals.",
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
