const BOOKINGS_KEY = "tfp-bookings";
const UNLOCKS_KEY = "tfp-unlocks";
const STUDIO_KEY = "tfp-studio-auth";
const CUSTOM_GALLERIES_KEY = "tfp-custom-galleries";

export type Booking = {
  id: string;
  photographerId: string;
  sessionType: string;
  date: string;
  location: string;
  name: string;
  email: string;
  phone: string;
  partySize: string;
  message: string;
  createdAt: string;
};

export type CustomGallery = {
  id: string;
  title: string;
  photographerId: string;
  code: string;
  cover: string;
  photos: { src: string; alt: string; album: string }[];
  createdAt: string;
};

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function listBookings(): Booking[] {
  return read<Booking[]>(BOOKINGS_KEY, []);
}

export function saveBooking(booking: Omit<Booking, "id" | "createdAt">): Booking {
  const next: Booking = {
    ...booking,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  write(BOOKINGS_KEY, [next, ...listBookings()]);
  return next;
}

export function isUnlocked(galleryId: string): boolean {
  return read<string[]>(UNLOCKS_KEY, []).includes(galleryId);
}

export function unlockGallery(galleryId: string) {
  const current = read<string[]>(UNLOCKS_KEY, []);
  if (!current.includes(galleryId)) write(UNLOCKS_KEY, [...current, galleryId]);
}

export function lockGallery(galleryId: string) {
  write(
    UNLOCKS_KEY,
    read<string[]>(UNLOCKS_KEY, []).filter((id) => id !== galleryId),
  );
}

export function isStudioAuthed(): boolean {
  return read(STUDIO_KEY, false);
}

export function setStudioAuth(on: boolean) {
  write(STUDIO_KEY, on);
}

export function listCustomGalleries(): CustomGallery[] {
  return read<CustomGallery[]>(CUSTOM_GALLERIES_KEY, []);
}

export function saveCustomGallery(gallery: Omit<CustomGallery, "id" | "createdAt" | "code"> & { code?: string }) {
  const next: CustomGallery = {
    ...gallery,
    id: slugify(gallery.title) + "-" + Math.floor(Math.random() * 900 + 100),
    code: gallery.code ?? mintCode(gallery.title),
    createdAt: new Date().toISOString(),
  };
  write(CUSTOM_GALLERIES_KEY, [next, ...listCustomGalleries()]);
  return next;
}

export function mintCode(seed: string) {
  const tag = seed.replace(/[^A-Za-z]/g, "").slice(0, 6).toUpperCase() || "ALBUM";
  const n = Math.floor(1000 + Math.random() * 9000);
  return `TFP-${tag}-${n}`;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
