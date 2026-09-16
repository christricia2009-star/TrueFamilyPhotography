import type { Photo } from "../data/studio";

const KEY = "tfp-library";

export type LibraryPhoto = Photo & { photographerId: string; id: string };

function read(): LibraryPhoto[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]") as LibraryPhoto[];
  } catch {
    return [];
  }
}

function write(rows: LibraryPhoto[]) {
  localStorage.setItem(KEY, JSON.stringify(rows));
}

export function listLibrary(photographerId?: string) {
  const all = read();
  return photographerId ? all.filter((p) => p.photographerId === photographerId) : all;
}

export function removeLibraryPhoto(id: string) {
  write(read().filter((p) => p.id !== id));
}

export async function addLibraryPhoto(photographerId: string, file: File, album = "From the desk") {
  const src = await compressImage(file);
  const row: LibraryPhoto = {
    id: crypto.randomUUID(),
    photographerId,
    src,
    alt: file.name.replace(/\.[^.]+$/, ""),
    album,
  };
  write([row, ...read()]);
  return row;
}

export function compressImage(file: File, max = 1800): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("canvas"));
        return;
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.88));
    };
    img.onerror = () => reject(new Error("image"));
    img.src = url;
  });
}
