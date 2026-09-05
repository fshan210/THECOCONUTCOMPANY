import type { ContentJournalPost } from "@/lib/content/types";

export const J = "/assets/redesign/journal/cinematic/";
export const categories = [
  "All",
  "Sourcing",
  "Sustainability",
  "Recipes",
  "Behind .CO",
  "CoCarbon",
  "People",
  "Culture",
] as const;
export type Story = {
  id: string;
  title: string;
  category: string;
  kind: string;
  excerpt: string;
  image: string;
  position?: string;
  date: string;
  minutes: number;
  location: string;
  body: string;
  reference?: boolean;
  displayDate?: string;
};
const story = (
  id: string,
  title: string,
  category: string,
  kind: string,
  excerpt: string,
  image: string,
  date: string,
  minutes: number,
  location: string,
  body: string,
  position = "center",
): Story => ({
  id,
  title,
  category,
  kind,
  excerpt,
  image: J + image + ".webp",
  date,
  minutes,
  location,
  body,
  position,
  reference: true,
});
// Reference-board editorial fixtures. They are explicitly labelled in the reader;
// names, dates and field observations must not be treated as verified reporting.
export const referenceStories: Story[] = [
  story(
    "husk",
    "What actually happens to a coconut husk?",
    "Sourcing",
    "Long read",
    "From farm to fibre, a closer look at the journey most people never see—and why every step matters.",
    "husk",
    "2025-05-12",
    10,
    "Pollachi, Tamil Nadu",
    "The husk is the fibrous coat around a coconut shell. Separating it opens several possible uses: coir fibres for ropes and mats, and smaller particles for growing media.\n\nThe right route depends on how material is collected, dried and processed. A useful circular system starts with those practical details. This editorial preview explores that journey; it does not report verified .CO production outcomes.",
    "70% center",
  ),
  story(
    "lakshmi",
    "Meet Lakshmi: twenty years among coconuts.",
    "People",
    "People story",
    "A quiet force in our production unit, and a mentor to many.",
    "people",
    "2025-05-10",
    7,
    "Pollachi, Tamil Nadu",
    "This portrait story is a reference-board concept awaiting a confirmed interview. It makes space for the knowledge of the people who sort, prepare and process coconuts.\n\nThe finished story will be built around their own words: what they notice, what they teach, and what a good working day looks like.",
    "85% center",
  ),
  story(
    "breakfast",
    "Kerala Coconut Breakfast Bowl",
    "Recipes",
    "Recipe story",
    "Warm, nourishing, and ready in 15 minutes.",
    "bowl",
    "2025-05-11",
    15,
    "Kerala",
    "A bowl is a good place to begin experimenting with coconut. Start with your usual porridge, add coconut milk gently, and finish with banana, toasted coconut and nuts.\n\nTaste before sweetening. Adjust the liquid gradually to keep the texture you like. Explore the recipe collection for ingredient quantities and complete methods.",
  ),
  story(
    "traceability",
    "Why traceability matters in Pollachi.",
    "Sustainability",
    "Data story",
    "The impact of knowing where every coconut comes from.",
    "grove",
    "2025-05-09",
    6,
    "Pollachi, Tamil Nadu",
    "Traceability connects a product to records about its origin and handling. A place name is only the beginning: batch records, dates and a clear chain of custody make the story useful.\n\nOur sustainability reference experience shows a proposed way to read those records. Its demonstration figures are not independently verified results.",
  ),
  story(
    "rain",
    "First rains, new growth.",
    "Sourcing",
    "Field note",
    "Observations from a coconut climate-smart plot.",
    "farm",
    "2025-05-09",
    4,
    "Palakkad, Kerala",
    "A field notebook gives small observations somewhere to live. Rainfall, surface moisture and the condition of a young plant become more useful when they are recorded consistently.\n\nThis is an illustrative field-note format. Actual observations, dates and attribution will be added when the field team has reviewed them.",
    "70% center",
  ),
  story(
    "soil",
    "Restoring soil. Measuring impact.",
    "CoCarbon",
    "CoCarbon update",
    "The questions behind the numbers, and what they mean on the ground.",
    "grove",
    "2025-05-08",
    5,
    "Across India",
    "A soil intervention needs more than a promising photograph. Baseline measurements, the amount applied, repeated observations and a comparison help show what changed.\n\nThe CoCarbon concept explores how coconut by-products could be used and measured. Outcomes depend on the process and the soil; this preview makes no measured impact claim.",
  ),
  story(
    "tender",
    "Tender vs mature coconut.",
    "Recipes",
    "Recipe story",
    "Which one to use, when—and how it changes the way your dish tastes.",
    "world-3",
    "2025-05-08",
    8,
    "Kitchen Lab",
    "Tender and mature coconuts offer different textures. A tender coconut has softer flesh; mature flesh has a firmer bite and can be grated or pressed into milk.\n\nChoose around the texture your dish needs. A delicate drink, a grated topping and a rich curry each ask something different of the coconut.",
  ),
  story(
    "kitchen",
    "A day in our kitchen lab.",
    "Behind .CO",
    "Behind .CO",
    "Where ideas become recipes, and recipes become rituals.",
    "kitchen",
    "2025-05-07",
    6,
    "Coimbatore, Tamil Nadu",
    "A kitchen notebook records the small changes that make a recipe repeatable: how much liquid, how long it rested, and what happened when the heat changed.\n\nThis editorial concept follows that process from a first idea to a recipe someone can cook at home. The full visit and team interview are still to come.",
  ),
];
export const featured: Story = story(
  "people-behind-every-coconut",
  "The people behind every coconut we source.",
  "People",
  "People & culture",
  "Meet the farmers, artisans and families who make our work possible—and why fair partnerships, long-term commitment, and shared growth guide everything we do.",
  "people",
  "2025-05-12",
  7,
  "From the field",
  "Every product passes through many hands. Farming, sorting and preparation each carry knowledge that is easy to miss on a label.\n\nThis reference story sets the direction for a series of interviews with the people around the coconut. Named participants, quotations and working conditions will be confirmed before this becomes published reporting.",
  "82% center",
);
export function mergeStories(entries: ContentJournalPost[]): Story[] {
  const live = entries
    .filter((e) => e.publicationStatus === "published")
    .map((e) => ({
      id: e.slug,
      title: e.title,
      category:
        (
          {
            Origins: "Sourcing",
            Brand: "Behind .CO",
            Wellness: "Culture",
            Community: "People",
          } as Record<string, string>
        )[e.category] || e.category,
      kind: e.category,
      excerpt: e.excerpt,
      image: e.image,
      date: e.publishedDate || "",
      displayDate: e.date,
      minutes: parseInt(e.readTime) || 4,
      location: e.author,
      body: e.body || e.excerpt,
    }));
  return [
    ...referenceStories,
    ...live.filter((e) => !referenceStories.some((s) => s.id === e.id)),
  ];
}
export function filterStories(
  stories: Story[],
  category: string,
  query: string,
  sort: string,
) {
  return stories
    .filter(
      (s) =>
        (category === "All" || s.category === category) &&
        `${s.title} ${s.excerpt} ${s.category} ${s.location}`
          .toLowerCase()
          .includes(query.trim().toLowerCase()),
    )
    .sort((a, b) =>
      sort === "A–Z"
        ? a.title.localeCompare(b.title)
        : sort === "Oldest"
          ? (Date.parse(a.date) || 0) - (Date.parse(b.date) || 0)
          : (Date.parse(b.date) || 0) - (Date.parse(a.date) || 0),
    );
}
export const today = [
  { title: "Pollachi Harvest Notes", label: "Field report", id: "rain" },
  {
    title: "Kitchen Coconut Milk Experiments",
    label: "Kitchen lab",
    id: "kitchen",
  },
  {
    title: "CoCarbon Biochar Field Trial",
    label: "Regenerative soil",
    id: "soil",
  },
  {
    title: "Community Morning Rituals",
    label: "People & culture",
    id: "breakfast",
  },
];
export const fieldNotes = [
  {
    time: "07:42",
    place: "Pollachi, Tamil Nadu",
    note: "The morning harvest is in. Beautiful tender coconuts—high water content today.",
    name: "S. Murugan",
    role: "Field Lead",
    image: "farm",
  },
  {
    time: "14:10",
    place: "Coimbatore, Tamil Nadu",
    note: "Testing a new husk-chip mix for moisture retention. Early observations recorded.",
    name: "Anjali N.",
    role: "Product Researcher",
    image: "people",
  },
  {
    time: "16:30",
    place: "Palakkad, Kerala",
    note: "First rains over the western ghats. Watching how the soil responds across our plots.",
    name: "Rahul P.",
    role: "Sustainability Lead",
    image: "grove",
  },
  {
    time: "11:05",
    place: "Kasaragod, Kerala",
    note: "Community training on composting today. Notes to share after the session.",
    name: "Rathima R.",
    role: "Community Coordinator",
    image: "people",
  },
  {
    time: "18:20",
    place: "Ariyalur, Tamil Nadu",
    note: "Biochar trial observations recorded. The next step is to compare results.",
    name: "Vignesh K.",
    role: "CoCarbon Partner",
    image: "husk",
  },
];
export const topics = [
  "Farming",
  "Processing",
  "Sourcing",
  "Sustainability",
  "Coconut Science",
];
export const faqs = [
  {
    title: "How do you decide when to harvest coconuts?",
    summary: "Look at the age, the intended use, and the fruit itself.",
    body: "A coconut for drinking and one for grating are not picked at the same stage. Growers combine maturity and condition with the intended use. The tree does not run on our calendar, so checking the fruit still matters.",
    by: "Farming notes",
  },
  {
    title: "What happens to coconut shells after the water is harvested?",
    summary:
      "The shell can become a material, instead of the end of the story.",
    body: "Shells can be used for craft, fuel or controlled conversion into carbon materials. Collection, processing and quality checks decide which route is practical. Our sustainability page separates proposed pathways from verified evidence.",
    by: "CoCarbon notes",
  },
  {
    title: "Can I replace fresh coconut with .CO products in my recipes?",
    summary: "Start with the format your recipe actually calls for.",
    body: "Milk, oil and flour do different jobs. Match the format first, then follow the recipe and pack instructions. Add liquid gradually: your saucepan is a much better guide than a hopeful one-for-one swap.",
    by: ".CO Kitchen notes",
  },
];
export const explainers = [
  {
    title: "Tender vs Mature Coconut",
    summary: "Taste, texture, cooking—what changes and why.",
    body: referenceStories[6].body,
  },
  {
    title: "How Coconut Milk Is Made",
    summary: "From kernel to milk—the simple idea behind the process.",
    body: "Coconut milk is made by extracting liquid from grated mature coconut flesh, commonly with water. The amount of water and method affect the final richness. Check the product label for its ingredients and storage instructions.",
  },
  {
    title: "What Happens to the Husk",
    summary: "From fibre to growing media. Another use for the husk.",
    body: referenceStories[0].body,
  },
  {
    title: "Virgin vs Refined Coconut Oil",
    summary: "Processing, flavour, and choosing for your kitchen.",
    body: "Different processing methods change the aroma and character of coconut oil. Look at the label for the extraction method and recommended use. Match the flavour and cooking guidance to the dish you want to make.",
  },
  {
    title: "Why Coconut Flour Behaves Differently",
    summary: "A little flour can change a whole batter.",
    body: "Coconut flour absorbs moisture differently from wheat flour. Use a recipe designed for it, allow the batter to rest, and adjust only in small steps. A direct one-for-one replacement can leave the result dry or crumbly.",
  },
  {
    title: "What Biochar Actually Does",
    summary: "A material, a process, and questions worth measuring.",
    body: referenceStories[5].body,
  },
];
export const community = [
  {
    name: "Ananya",
    tag: "Ritual",
    title: "A little space for a slower morning.",
    place: "Coorg, India",
    image: "oil",
  },
  {
    name: "Jonah",
    tag: "Hydration",
    title: "Coconut water after long runs.",
    place: "Bali, Indonesia",
    image: "water",
  },
  {
    name: "Meera",
    tag: "Kitchen",
    title: "Sunday stews and coconut milk.",
    place: "Kerala, India",
    image: "kitchen",
  },
  {
    name: "Liam",
    tag: "Wellness",
    title: "Post-surf. Simple and grounding.",
    place: "Byron Bay, Australia",
    image: "community",
  },
  {
    name: "Sara",
    tag: "Ritual",
    title: "Cooking, sharing, and slow moments.",
    place: "Mumbai, India",
    image: "milk",
  },
];
export const people = [
  {
    name: "Raghavan Pillai",
    role: "Farmer · reference profile",
    place: "Alappuzha, Kerala",
    quote: "I grow with the seasons, not shortcuts.",
    image: "farmer",
    position: "43% center",
  },
  {
    name: "Meena Devi",
    role: "Processing · reference profile",
    place: "Pollachi, Tamil Nadu",
    quote: "Clean process. Stronger future.",
    image: "people",
    position: "85% center",
  },
  {
    name: "Fazil Shersha",
    role: "Co-founder",
    place: "India",
    quote: "Always chasing the ‘why’ behind what we do.",
    image: "fazil",
    position: "center 30%",
  },
  {
    name: "Afsala Muthali",
    role: "Co-founder",
    place: "India",
    quote:
      "I make sure the dream turns into something real, thoughtful and usable.",
    image: "afsala",
    position: "center 30%",
  },
];
export const quotes = [
  {
    quote:
      ".CO isn’t just a brand. It’s a reminder that we can choose better every day.",
    name: "Priya Nair",
    place: "Coimbatore",
  },
  {
    quote:
      "The best stories make you look again at something you thought you knew.",
    name: "Meera",
    place: "Kerala",
  },
  {
    quote: "A small ritual. A familiar ingredient. A reason to slow down.",
    name: "Ananya",
    place: "Coorg",
  },
];
export const series = [
  {
    title: "Field Notes",
    subtitle: "Stories from farms & forests",
    category: "Sourcing",
  },
  {
    title: "Inside .CO",
    subtitle: "People, places & processes",
    category: "Behind .CO",
  },
  {
    title: "Coconut 101",
    subtitle: "Learn, understand, choose better",
    category: "Recipes",
  },
  {
    title: "CoCarbon Notes",
    subtitle: "Questions, records & forward steps",
    category: "CoCarbon",
  },
];
export const searchTags = [
  "Kerala",
  "Virgin Coconut Oil",
  "Sustainability",
  "Recipes",
  "CoCarbon",
  "Coconut milk",
  "Pollachi",
  "Community",
];
export const periods = ["Morning", "Afternoon", "Evening"] as const;
export type Period = (typeof periods)[number];
export type Ritual = {
  id: string;
  title: string;
  minutes: number;
  image: string;
  period: Period;
};
export const rituals: Ritual[] = [
  {
    id: "lemon",
    title: "Warm lemon + coconut water",
    minutes: 5,
    image: "water",
    period: "Morning",
  },
  {
    id: "porridge",
    title: "Coconut & cardamom porridge",
    minutes: 15,
    image: "bowl",
    period: "Morning",
  },
  {
    id: "hydrate",
    title: "Hydrate with coconut water",
    minutes: 5,
    image: "drink",
    period: "Afternoon",
  },
  {
    id: "soup",
    title: "Thai coconut vegetable soup",
    minutes: 20,
    image: "stew",
    period: "Afternoon",
  },
  {
    id: "massage",
    title: "Coconut oil self massage",
    minutes: 15,
    image: "oil",
    period: "Evening",
  },
  {
    id: "golden",
    title: "Golden milk with coconut milk",
    minutes: 10,
    image: "milk",
    period: "Evening",
  },
  {
    id: "pancake",
    title: "Slow coconut pancakes",
    minutes: 20,
    image: "pancakes",
    period: "Morning",
  },
  {
    id: "notebook",
    title: "A page in your field notebook",
    minutes: 5,
    image: "hero",
    period: "Evening",
  },
];
