export const SECTIONS = [
  {
    slug: "biology",
    title: "Biology",
    navLabel: "Biology",
    description:
      "Molecular and cell biology that shows up in computational work, from the central dogma to single-cell sequencing.",
  },
  {
    slug: "chemistry",
    title: "Chemistry",
    navLabel: "Chemistry",
    description:
      "Bonding, energy, and thermodynamics — the chemical ideas that sit under molecular modeling.",
  },
  {
    slug: "industry-biochem",
    title: "Industry biochem",
    navLabel: "Industry",
    description:
      "How biology and chemistry are applied in drug discovery, formulation, and biotech, and where computation fits in those pipelines.",
  },
  {
    slug: "computer-architecture",
    title: "Computer architecture",
    navLabel: "Architecture",
    description:
      "CPUs, GPUs, memory systems, and the engineering constraints of the chips that run modern computing.",
  },
  {
    slug: "quant-trading",
    title: "Quant trading",
    navLabel: "Quant",
    description:
      "Market microstructure and quantitative trading ideas, including how a limit order book actually works.",
  },
  {
    slug: "ai-ml",
    title: "AI & ML",
    navLabel: "AI & ML",
    description:
      "Machine learning methods and the security and privacy questions that come with deploying them.",
  },
] as const;

export type SectionSlug = (typeof SECTIONS)[number]["slug"];

export const SECTION_SLUGS = SECTIONS.map((section) => section.slug) as unknown as [
  SectionSlug,
  ...SectionSlug[],
];

export function getSection(slug: string) {
  return SECTIONS.find((section) => section.slug === slug);
}

export function sectionPath(slug: string): string {
  return `${import.meta.env.BASE_URL}${slug}/`;
}

export function sectionFeedPath(slug: string): string {
  return `${import.meta.env.BASE_URL}${slug}/rss.xml`;
}
