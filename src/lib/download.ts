import JSZip from "jszip";
import type { Photo } from "../data/studio";

async function blobFor(src: string) {
  const res = await fetch(src);
  return res.blob();
}

export async function downloadPhoto(src: string, name: string) {
  const blob = await blobFor(src);
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  URL.revokeObjectURL(a.href);
}

export async function downloadAlbum(photos: Photo[], folder: string) {
  const zip = new JSZip();
  const dir = zip.folder(folder) ?? zip;
  await Promise.all(
    photos.map(async (p, i) => {
      const blob = await blobFor(p.src);
      const ext = p.src.includes("png") ? "png" : "jpg";
      dir.file(`${String(i + 1).padStart(2, "0")}-${folder}.${ext}`, blob);
    }),
  );
  const out = await zip.generateAsync({ type: "blob" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(out);
  a.download = `${folder}.zip`;
  a.click();
  URL.revokeObjectURL(a.href);
}
