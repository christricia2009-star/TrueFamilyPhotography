const BOOKINGS_KEY = "tfp-bookings";
const UNLOCKS_KEY = "tfp-unlocks";
const STUDIO_KEY = "tfp-studio-auth";
const CUSTOM_GALLERIES_KEY = "tfp-custom-galleries";
const FAVORITES_KEY = "tfp-favorites";
const DATES_KEY = "tfp-held-dates";
const POLAROIDS_KEY = "tfp-phoenix-polaroids";
const NOTES_KEY = "tfp-field-notes";
const GIFTS_KEY = "tfp-gifts";
const CART_KEY = "tfp-cart";
const ORDERS_KEY = "tfp-orders";

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
  giftCode?: string;
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

export type Favorite = {
  galleryId: string;
  src: string;
  alt: string;
  photographerId: string;
};

export type HeldDate = {
  photographerId: string;
  date: string;
  bookingId: string;
};

export type Polaroid = {
  id: string;
  caption: string;
  src?: string;
};

export type GiftCertificate = {
  code: string;
  amount: number;
  from: string;
  to: string;
  email: string;
  remaining: number;
  createdAt: string;
  redeemedAt?: string;
};

export type CartItem = {
  productId: string;
  name: string;
  variant: string;
  price: number;
  qty: number;
  image: string;
};

export type ShopOrder = {
  id: string;
  items: CartItem[];
  name: string;
  email: string;
  phone: string;
  address: string;
  note: string;
  total: number;
  giftCodes: string[];
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
  if (booking.date && (booking.photographerId === "patricia" || booking.photographerId === "skylar")) {
    holdDate({ photographerId: booking.photographerId, date: booking.date, bookingId: next.id });
  }
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

export function listFavorites(galleryId?: string): Favorite[] {
  const all = read<Favorite[]>(FAVORITES_KEY, []);
  return galleryId ? all.filter((f) => f.galleryId === galleryId) : all;
}

export function isFavorite(galleryId: string, src: string) {
  return listFavorites(galleryId).some((f) => f.src === src);
}

export function toggleFavorite(fav: Favorite) {
  const all = listFavorites();
  const exists = all.some((f) => f.galleryId === fav.galleryId && f.src === fav.src);
  write(
    FAVORITES_KEY,
    exists ? all.filter((f) => !(f.galleryId === fav.galleryId && f.src === fav.src)) : [...all, fav],
  );
}

export function listHeldDates(): HeldDate[] {
  return read<HeldDate[]>(DATES_KEY, []);
}

export function holdDate(entry: HeldDate) {
  const current = listHeldDates().filter(
    (d) => !(d.photographerId === entry.photographerId && d.date === entry.date),
  );
  write(DATES_KEY, [...current, entry]);
}

export function isDateHeld(photographerId: string, date: string, ignoreBookingId?: string) {
  if (photographerId !== "patricia" && photographerId !== "skylar") return false;
  return listHeldDates().some(
    (d) => d.photographerId === photographerId && d.date === date && d.bookingId !== ignoreBookingId,
  );
}

export const defaultPolaroids: Polaroid[] = [
  { id: "bug", caption: "look at the bug" },
  { id: "dog", caption: "the dog said yes" },
  { id: "kids", caption: "kids being kids" },
];

export function listPolaroids(): Polaroid[] {
  const saved = read<Polaroid[]>(POLAROIDS_KEY, []);
  return defaultPolaroids.map((slot) => saved.find((s) => s.id === slot.id) ?? slot);
}

export function savePolaroid(id: string, src: string, caption?: string) {
  const current = read<Polaroid[]>(POLAROIDS_KEY, []);
  const next = current.filter((p) => p.id !== id);
  const base = defaultPolaroids.find((p) => p.id === id);
  write(POLAROIDS_KEY, [...next, { id, src, caption: caption || base?.caption || "" }]);
}

export function clearPolaroid(id: string) {
  write(
    POLAROIDS_KEY,
    read<Polaroid[]>(POLAROIDS_KEY, []).filter((p) => p.id !== id),
  );
}

export function listCheckedNotes(): string[] {
  return read<string[]>(NOTES_KEY, []);
}

export function toggleNote(id: string) {
  const current = listCheckedNotes();
  write(
    NOTES_KEY,
    current.includes(id) ? current.filter((n) => n !== id) : [...current, id],
  );
}

export function listGifts(): GiftCertificate[] {
  return read<GiftCertificate[]>(GIFTS_KEY, []);
}

export function saveGift(gift: Omit<GiftCertificate, "code" | "createdAt" | "remaining"> & { amount: number }) {
  const n = Math.floor(1000 + Math.random() * 9000);
  const next: GiftCertificate = {
    ...gift,
    remaining: gift.amount,
    code: `TFP-GIFT-${n}`,
    createdAt: new Date().toISOString(),
  };
  write(GIFTS_KEY, [next, ...listGifts()]);
  return next;
}

export function findGift(code: string) {
  return listGifts().find((g) => g.code === code.trim().toUpperCase());
}

export function redeemGift(code: string) {
  const all = listGifts();
  const i = all.findIndex((g) => g.code === code.trim().toUpperCase());
  if (i < 0) return null;
  if (all[i].remaining <= 0) return all[i];
  all[i] = { ...all[i], remaining: 0, redeemedAt: new Date().toISOString() };
  write(GIFTS_KEY, all);
  return all[i];
}

export function getCart(): CartItem[] {
  return read<CartItem[]>(CART_KEY, []);
}

export function setCart(items: CartItem[]) {
  write(CART_KEY, items);
}

export function addToCart(item: Omit<CartItem, "qty">, qty = 1) {
  const cart = getCart();
  const i = cart.findIndex((c) => c.productId === item.productId && c.variant === item.variant);
  if (i >= 0) cart[i] = { ...cart[i], qty: cart[i].qty + qty };
  else cart.push({ ...item, qty });
  setCart(cart);
  window.dispatchEvent(new Event("tfp-cart"));
  return cart;
}

export function updateCartQty(productId: string, variant: string, qty: number) {
  const cart = getCart()
    .map((c) => (c.productId === productId && c.variant === variant ? { ...c, qty } : c))
    .filter((c) => c.qty > 0);
  setCart(cart);
  window.dispatchEvent(new Event("tfp-cart"));
  return cart;
}

export function clearCart() {
  setCart([]);
  window.dispatchEvent(new Event("tfp-cart"));
}

export function cartCount() {
  return getCart().reduce((n, i) => n + i.qty, 0);
}

export function cartTotal() {
  return getCart().reduce((n, i) => n + i.price * i.qty, 0);
}

export function listOrders(): ShopOrder[] {
  return read<ShopOrder[]>(ORDERS_KEY, []);
}

export function saveOrder(order: Omit<ShopOrder, "id" | "createdAt">): ShopOrder {
  const next: ShopOrder = {
    ...order,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  write(ORDERS_KEY, [next, ...listOrders()]);
  return next;
}
