export type Photo = {
  src: string;
  alt: string;
  album: string;
};

function sessionFrames(folder: string, count: number, album: string, alt: string): Photo[] {
  return Array.from({ length: count }, (_, index) => ({
    src: `/images/${folder}/${String(index + 1).padStart(2, "0")}.jpg`,
    alt,
    album,
  }));
}

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
  /** Homepage covers open straight into the pictures. The code still unlocks clean files. */
  publicPreview?: boolean;
};

export const STUDIO_NAME = "True Family Photography";
export const STUDIO_HANDLE = "truefamilyphotography";

export function watermarkFor(person: { id: string }) {
  return `${person.id}@truefamilyphotography`;
}
export const STUDIO_PIN = "8288824";
export const STUDIO_EMAIL = "hello@truefamilyphotography.com";
export const INSTAGRAM_URL = "https://www.instagram.com/truefamilyphotography/";
export const FACEBOOK_URL = "https://www.facebook.com/truefamilyphotography";
export const FOOTBALL_EVENTS_URL = "https://football.truefamilyphotography.com";
export const SERVICE_AREA = "Northern California — and wherever the story lives.";
export const LIABILITY_NOTE =
  "True Family Photography carries a $2 million liability policy. We can send a certificate of insurance to your venue, school, or event.";

export const photographers: Photographer[] = [
  {
    id: "patricia",
    name: "Patricia",
    handle: "@Patricia",
    credit: "patricia@truefamilyphotography",
    kind: "photographer",
    role: "Photographer",
    tagline: "The quiet in-between.",
    bio: "Patricia photographs the year a family is actually living. Maternity in the grass, a kid in the leaves, a couple under an arbor, a newborn by the fireplace. Her frames are warm, close, and unhurried. Every image is credited patricia@truefamilyphotography, under the family studio for the work, the insurance, and the archive.",
    portrait: "/images/patricia/p07.jpg",
    portraitAlt: "Child portrait in autumn leaves, photographed by Patricia",
    specialties: ["Families", "Maternity", "Newborns", "Formals", "Weddings"],
    sessionTypes: ["family", "year", "maternity", "newborn", "wedding", "portrait"],
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
      ...sessionFrames("weddings", 42, "Wedding day", "Wedding photograph"),
      ...sessionFrames("maternity", 17, "Maternity & newborn", "Maternity and newborn photograph"),
    ],
  },
  {
    id: "skylar",
    name: "Skylar",
    handle: "@Skylar",
    credit: "skylar@truefamilyphotography",
    kind: "photographer",
    role: "Photographer",
    tagline: "Friday nights and fast cars.",
    bio: "Skylar photographs motion. Football at dusk. A Porsche on the lot. A McLaren in a garage. Color, and the second before the snap. Credited skylar@truefamilyphotography, same studio, same insurance, a younger eye.",
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
  { id: "year", label: "Year of the family", blurb: "Spring, first day, birthday. The studio keeps the year." },
  { id: "wedding", label: "Weddings & formals", blurb: "Vows, gowns, the arbor." },
  { id: "maternity", label: "Maternity", blurb: "The quiet before." },
  { id: "newborn", label: "Newborn", blurb: "First days, small hands." },
  { id: "portrait", label: "Portraits", blurb: "One person, seen well." },
  { id: "sports", label: "Sports", blurb: "Friday nights under the lights." },
  { id: "automotive", label: "Automotive", blurb: "Meets, garages, the good cars." },
  { id: "event", label: "Events", blurb: "Gatherings that should be kept." },
  { id: "adventure", label: "Little Lens adventure", blurb: "A short session for kids. A parent photographer comes along." },
];

export type Shoot = {
  id: string;
  title: string;
  blurb: string;
  photos: { src: string; alt: string; photographerId: string }[];
};

const shootPlan: { id: string; album: string; title: string; blurb: string }[] = [
  { id: "families", album: "Families", title: "Families", blurb: "The year as it was actually lived." },
  { id: "formals", album: "Formals", title: "Formals", blurb: "Gowns, steps, the arbor." },
  { id: "wedding-day", album: "Wedding day", title: "Wedding", blurb: "The day, kept." },
  { id: "maternity-newborn", album: "Maternity & newborn", title: "Maternity & newborn", blurb: "Before, and the first days." },
  { id: "cars", album: "NorCal spots", title: "Cars", blurb: "Meets and garages." },
];

export const previousShoots: Shoot[] = shootPlan
  .map((shoot) => ({
    id: shoot.id,
    title: shoot.title,
    blurb: shoot.blurb,
    photos: photographers.flatMap((person) =>
      person.photos
        .filter((photo) => photo.album === shoot.album)
        .map((photo) => ({ src: photo.src, alt: photo.alt, photographerId: person.id })),
    ),
  }))
  .filter((shoot) => shoot.photos.length > 0);

const patricia = photographers[0];
const skylar = photographers[1];

export const clientGalleries: ClientGallery[] = [
  {
    id: "families",
    title: "Families",
    subtitle: "The year as it was actually lived.",
    photographerId: "patricia",
    code: "TFP-FAMILY-2026",
    dateLabel: "Families",
    cover: "/images/patricia/p07.jpg",
    photos: patricia.photos.filter((p) => p.album === "Families"),
    publicPreview: true,
  },
  {
    id: "formals",
    title: "Formals",
    subtitle: "Gowns, steps, the arbor.",
    photographerId: "patricia",
    code: "TFP-FORMAL-2026",
    dateLabel: "Formals",
    cover: "/images/patricia/p03.jpg",
    photos: patricia.photos.filter((p) => p.album === "Formals"),
    publicPreview: true,
  },
  {
    id: "wedding-day",
    title: "Wedding",
    subtitle: "The day, kept",
    photographerId: "patricia",
    code: "TFP-WEDDING-2026",
    dateLabel: "Wedding day",
    cover: "/images/weddings/01.jpg",
    photos: patricia.photos.filter((p) => p.album === "Wedding day"),
    publicPreview: true,
  },
  {
    id: "maternity-newborn",
    title: "Maternity & newborn",
    subtitle: "Before, and the first days",
    photographerId: "patricia",
    code: "TFP-NEWBORN-2026",
    dateLabel: "Maternity & newborn",
    cover: "/images/maternity/01.jpg",
    photos: patricia.photos.filter((p) => p.album === "Maternity & newborn"),
    publicPreview: true,
  },
  {
    id: "cars",
    title: "Cars",
    subtitle: "Meets and garages.",
    photographerId: "skylar",
    code: "TFP-CARS-2026",
    dateLabel: "Cars",
    cover: "/images/skylar/car01.jpg",
    photos: skylar.photos.filter((p) => p.album === "NorCal spots"),
    publicPreview: true,
  },
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

export const currentThing = {
  kicker: "Right now",
  title: "Phoenix has a coloring studio up.",
  blurb: "Bugs, boots, a tippy horizon. Color in the browser, print for the fridge, watermark included.",
  href: "/photographers/phoenix#coloring",
};

export const nextKickoff = {
  title: "Friday night lights",
  team: "Mavericks",
  when: "2026-09-18T19:00:00-07:00",
  blurb: "The studio will be on the sideline. Hold the night before the lights come on.",
};

export const seasonGames = [
  { id: "g1", when: "2026-09-18T19:00:00-07:00", opponent: "Ridge", home: true },
  { id: "g2", when: "2026-09-25T19:00:00-07:00", opponent: "Valley", home: true },
  { id: "g3", when: "2026-10-02T19:00:00-07:00", opponent: "North", home: false },
  { id: "g4", when: "2026-10-09T19:00:00-07:00", opponent: "West", home: true },
  { id: "g5", when: "2026-10-16T19:00:00-07:00", opponent: "Central", home: false },
  { id: "g6", when: "2026-10-23T19:00:00-07:00", opponent: "East", home: true },
];

export const fieldNoteItems = [
  { id: "bug", label: "A bug that stayed still" },
  { id: "dog", label: "A dog nose, very close" },
  { id: "yellow", label: "Something yellow" },
  { id: "puddle", label: "A puddle worth stopping for" },
  { id: "sky", label: "A sky that is not straight (that’s fine)" },
  { id: "snack", label: "Evidence of snack" },
];

export const comicPanels = [
  {
    title: "The grown-up way",
    line: "Smile! Look at the camera. One more. Chin up. Don’t blink.",
    stamp: "Patricia, trying her best",
  },
  {
    title: "The Phoenix way",
    line: "Look at the bug. The bug is not looking at the camera. Perfect.",
    stamp: "Age 8",
  },
  {
    title: "Parent along",
    line: "A grown-up photographer always comes. Phoenix notices. Chris packed the batteries.",
    stamp: "Studio rule",
  },
  {
    title: "Then snack",
    line: "Little Lens adventures are short on purpose. Recess energy. Parent in the shot if needed.",
    stamp: "30–45 minutes",
  },
];

export type ShopProduct = {
  id: string;
  name: string;
  blurb: string;
  image: string;
  photographerId?: string;
  gift?: boolean;
  variants: { id: string; label: string; price: number }[];
};

export const shopProducts: ShopProduct[] = [
  {
    id: "gift",
    name: "Gift certificate",
    blurb: "A code they redeem when they book. Same studio, any session.",
    image: "/images/portrait-phoenix.jpg",
    gift: true,
    variants: [
      { id: "150", label: "$150", price: 150 },
      { id: "300", label: "$300", price: 300 },
      { id: "500", label: "$500", price: 500 },
    ],
  },
  {
    id: "print",
    name: "Fine art print",
    blurb: "From your paid gallery. Tell us the frame in the note at checkout.",
    image: "/images/patricia/p07.jpg",
    photographerId: "patricia",
    variants: [
      { id: "8x10", label: "8×10", price: 45 },
      { id: "11x14", label: "11×14", price: 75 },
      { id: "16x20", label: "16×20", price: 140 },
    ],
  },
  {
    id: "canvas",
    name: "Canvas",
    blurb: "A wall piece. We print from the album you unlocked.",
    image: "/images/patricia/p03.jpg",
    photographerId: "patricia",
    variants: [
      { id: "16x20c", label: "16×20 canvas", price: 220 },
      { id: "20x30c", label: "20×30 canvas", price: 320 },
    ],
  },
  {
    id: "album",
    name: "Heirloom album",
    blurb: "Flush-mount, designed from your favorites. Chris will ask which hearts you tapped.",
    image: "/images/patricia/p08.jpg",
    variants: [{ id: "album", label: "Starting collection", price: 450 }],
  },
  {
    id: "digital",
    name: "Extra digitals",
    blurb: "Additional high-res files from a session already on the books.",
    image: "/images/skylar/sport01.jpg",
    photographerId: "skylar",
    variants: [{ id: "set", label: "Add-on set", price: 50 }],
  },
  {
    id: "coloring-set",
    name: "Little Lens coloring set",
    blurb: "Printed pages from Phoenix’s coloring studio. Fridge-ready. Her watermark on every sheet.",
    image: "/images/portrait-phoenix.jpg",
    photographerId: "phoenix",
    variants: [{ id: "pack", label: "5-page pack", price: 18 }],
  },
];

export function formatMoney(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}
