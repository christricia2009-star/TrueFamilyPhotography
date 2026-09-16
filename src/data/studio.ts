export type Photo = {
  src: string;
  alt: string;
  album: string;
};

export type MemberKind = "photographer" | "studio" | "junior";

export type Photographer = {
  id: string;
  name: string;
  handle: string;
  credit: string;
  kind: MemberKind;
  role: string;
  tagline: string;
  bio: string;
  portrait: string;
  portraitAlt: string;
  specialties: string[];
  sessionTypes: string[];
  bookable: boolean;
  bookingNote?: string;
  photos: Photo[];
  jokes?: string[];
  duties?: string[];
};

export type ClientGallery = {
  id: string;
  title: string;
  subtitle: string;
  photographerId: string;
  code: string;
  dateLabel: string;
  cover: string;
  photos: Photo[];
};

export const STUDIO_NAME = "True Family Photography";
export const STUDIO_HANDLE = "truefamilyphotography";

export function watermarkFor(person: { id: string }) {
  return `${person.id}@truefamilyphotography`;
}
export const STUDIO_PIN = "TFP-FAMILY";
export const STUDIO_EMAIL = "hello@truefamilyphotography.com";
export const SERVICE_AREA = "Northern California — and wherever the story lives.";

export const photographers: Photographer[] = [
  {
    id: "patricia",
    name: "Patricia",
    handle: "@Patricia",
    credit: "patricia@truefamilyphotography",
    kind: "photographer",
    role: "Families, formals & first days",
    tagline: "The quiet in-between.",
    bio: "Patricia is the lens most families meet first. Maternity in the grass, a kid in the leaves, a couple under an arbor, a newborn by the fireplace — the year you are actually living. Her frames are warm, close, and unhurried. Every image is credited patricia@truefamilyphotography, under the family studio for the work, the insurance, and the archive.",
    portrait: "/images/patricia/p07.jpg",
    portraitAlt: "Child portrait in autumn leaves, photographed by Patricia",
    specialties: ["Families", "Maternity", "Newborns", "Formals", "Weddings"],
    sessionTypes: ["family", "maternity", "newborn", "wedding", "portrait"],
    bookable: true,
    photos: [
      { src: "/images/patricia/p07.jpg", alt: "A child sitting in autumn leaves", album: "Families" },
      { src: "/images/patricia/p06.jpg", alt: "Mother and daughter on a trail", album: "Families" },
      { src: "/images/patricia/p03.jpg", alt: "Three friends in black gowns under a rose arbor", album: "Formals" },
      { src: "/images/patricia/p02.jpg", alt: "Formal portrait in a black gown on marble steps", album: "Formals" },
      { src: "/images/patricia/p08.jpg", alt: "Wedding couple with lei and bouquet", album: "Vows" },
      { src: "/images/patricia/p10.jpg", alt: "Newborn session by the fireplace at Christmas", album: "First days" },
      { src: "/images/patricia/p11.jpg", alt: "Baby with a football on a white rug", album: "First days" },
      { src: "/images/patricia/p01.jpg", alt: "Butterfly on bark", album: "Quiet things" },
      { src: "/images/patricia/p09.jpg", alt: "Bay Bridge at night", album: "Quiet things" },
    ],
  },
  {
    id: "skylar",
    name: "Skylar",
    handle: "@Skylar",
    credit: "skylar@truefamilyphotography",
    kind: "photographer",
    role: "Sports & automotive",
    tagline: "Friday nights and fast cars.",
    bio: "Skylar photographs the other kind of family — the one in pads under the lights, the one that shows up for a car meet on a Saturday. Football at dusk. A Porsche on the lot. A McLaren in a garage. Motion, color, the second before the snap. Credited skylar@truefamilyphotography, same studio, same insurance, a younger eye.",
    portrait: "/images/skylar/sport02.jpg",
    portraitAlt: "Friday night football, photographed by Skylar",
    specialties: ["Sports", "Football", "Automotive", "Events"],
    sessionTypes: ["sports", "automotive", "event"],
    bookable: true,
    photos: [
      { src: "/images/skylar/sport01.jpg", alt: "Football players on the field at sunset", album: "Under the lights" },
      { src: "/images/skylar/sport02.jpg", alt: "Mavericks player #1 walking the hash marks", album: "Under the lights" },
      { src: "/images/skylar/sport03.jpg", alt: "Linemen set at the snap", album: "Under the lights" },
      { src: "/images/skylar/sport04.jpg", alt: "Player #23 in motion at night", album: "Under the lights" },
      { src: "/images/skylar/sport05.jpg", alt: "Player #24 crouched on the sideline", album: "Under the lights" },
      { src: "/images/skylar/sport08.jpg", alt: "Quarterback facing the goalposts at dusk", album: "Under the lights" },
      { src: "/images/skylar/sport07.jpg", alt: "Player set on the line with a coach behind", album: "Under the lights" },
      { src: "/images/skylar/sport09.jpg", alt: "Two players and a referee before the play", album: "Under the lights" },
      { src: "/images/skylar/car01.jpg", alt: "Purple McLaren in a parking garage", album: "NorCal spots" },
      { src: "/images/skylar/car02.jpg", alt: "Orange Porsche at a car meet", album: "NorCal spots" },
      { src: "/images/skylar/car04.jpg", alt: "Red Koenigsegg in a garage stall", album: "NorCal spots" },
    ],
  },
  {
    id: "chris",
    name: "Chris",
    handle: "@Chris",
    credit: "chris@truefamilyphotography",
    kind: "studio",
    role: "Studio, gear & the website",
    tagline: "I don't take the picture. I make sure there's a picture to take.",
    bio: "Chris is on the team. He is not hiding behind a camera asking you to take one more step to the left — that's Patricia and Skylar. He is the batteries (the unsung hero of every session), the extra cards, the equipment check, the website you are on right now, and the business that lets a family studio have real insurance. Someone has to make the pretty stuff possible. He signed up for that part on purpose.",
    portrait: "/images/portrait-chris.jpg",
    portraitAlt: "Studio gear — Chris's side of the family business",
    specialties: ["Equipment", "Galleries", "The website", "The boring-important"],
    sessionTypes: [],
    bookable: false,
    duties: [
      "Counts batteries like they are gold, because they are",
      "Packs the bag so Patricia does not have to think about the bag",
      "Builds the client galleries your code and QR actually open",
      "Keeps True Family Photography a real business, with real insurance",
      "Reminds Skylar what time kickoff is. Reminds Patricia what time sunset is. They are often the same time.",
      "This website. You're welcome. (He will never say that out loud.)",
    ],
    photos: [],
  },
  {
    id: "phoenix",
    name: "Phoenix",
    handle: "@Phoenix",
    credit: "phoenix@truefamilyphotography",
    kind: "junior",
    role: "Photographer in training · age 8",
    tagline: "Who better to photograph kids than a kid?",
    bio: "Phoenix is eight and just getting started. She does not have a portfolio yet — she has recess, a camera, and a theory the rest of the studio finds hard to argue with: an eight-year-old can take a photo just as good as a grown-up. Sometimes better. Grown-ups keep saying “smile.” Phoenix says “look at the bug.”",
    portrait: "/images/portrait-phoenix.jpg",
    portraitAlt: "Phoenix’s camera waiting in the wildflowers",
    specialties: ["Bugs", "Dogs", "Kids being kids", "Things grown-ups walk past"],
    sessionTypes: ["adventure"],
    bookable: true,
    bookingNote:
      "Little Lens adventures are 30–45 minutes (backyard, park, pets) with a parent photographer along. Phoenix is eight. Bookings go through the family studio.",
    jokes: [
      "Portfolio status: currently in third grade.",
      "Let's be honest. An eight-year-old can take a picture just as good as a grown-up. The horizon might be a little tippy. The joy will not.",
      "Who better to photograph kids than a kid? She speaks fluent snack, playground, and “one more time.”",
      "Chris handles the batteries. Phoenix handles the wonder. Patricia handles the rest of us.",
      "Official title: Photographer in training. Unofficial title: Chief Noticer of Small Things.",
      "Check back after more recesses. This wall is still growing.",
    ],
    photos: [],
  },
];

export const sessionCatalog: { id: string; label: string; blurb: string }[] = [
  { id: "family", label: "Family & lifestyle", blurb: "The year you are actually living." },
  { id: "wedding", label: "Weddings & formals", blurb: "Vows, gowns, the arbor." },
  { id: "maternity", label: "Maternity", blurb: "The quiet before." },
  { id: "newborn", label: "Newborn", blurb: "First days, small hands." },
  { id: "portrait", label: "Portraits", blurb: "One person, seen well." },
  { id: "sports", label: "Sports", blurb: "Friday nights under the lights." },
  { id: "automotive", label: "Automotive", blurb: "Meets, garages, the good cars." },
  { id: "event", label: "Events", blurb: "Gatherings that should be kept." },
  { id: "adventure", label: "Little Lens adventure", blurb: "Phoenix’s backyard wonders. Parent along." },
];

const patricia = photographers[0];
const skylar = photographers[1];

export const clientGalleries: ClientGallery[] = [
  {
    id: "wildflower-year",
    title: "The Hale Family",
    subtitle: "Maternity & family",
    photographerId: "patricia",
    code: "TFP-HALE-2026",
    dateLabel: "Spring 2026",
    cover: "/images/patricia/p06.jpg",
    photos: patricia.photos.filter((p) => p.album === "Families" || p.album === "First days"),
  },
  {
    id: "formals-night",
    title: "Aria · Formals",
    subtitle: "The gown",
    photographerId: "patricia",
    code: "TFP-ARIA-2026",
    dateLabel: "May 2026",
    cover: "/images/patricia/p02.jpg",
    photos: patricia.photos.filter((p) => p.album === "Formals" || p.album === "Vows"),
  },
  {
    id: "mavericks-friday",
    title: "Friday Night",
    subtitle: "Under the lights",
    photographerId: "skylar",
    code: "TFP-FRIDAY-3310",
    dateLabel: "Fall 2026",
    cover: "/images/skylar/sport02.jpg",
    photos: skylar.photos.filter((p) => p.album === "Under the lights"),
  },
];

export function getPhotographer(id: string) {
  return photographers.find((p) => p.id === id);
}

export function getGallery(id: string) {
  return clientGalleries.find((g) => g.id === id);
}

export function findGalleryByCode(raw: string) {
  const code = raw.trim().toUpperCase();
  return clientGalleries.find((g) => g.code === code);
}

export function sessionsFor(photographer: Photographer) {
  return sessionCatalog.filter((s) => photographer.sessionTypes.includes(s.id));
}

export const bookablePhotographers = photographers.filter((p) => p.bookable);
