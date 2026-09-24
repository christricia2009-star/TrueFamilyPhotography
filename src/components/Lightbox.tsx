import { useEffect } from "react";
import type { Photo as PhotoType } from "../data/studio";
import type { Photographer } from "../data/studio";
import { Photo } from "./Photo";

type Props = {
  photos: PhotoType[];
  index: number;
  photographer?: Photographer;
  onClose: () => void;
  onIndex: (next: number) => void;
  original?: boolean;
};

export function Lightbox({ photos, index, photographer, onClose, onIndex, original }: Props) {
  const photo = photos[index];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onIndex((index + 1) % photos.length);
      if (e.key === "ArrowLeft") onIndex((index - 1 + photos.length) % photos.length);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [index, onClose, onIndex, photos.length]);

  if (!photo) return null;

  return (
    <div className="lightbox" onClick={onClose} role="dialog" aria-modal="true">
      <button className="lightbox-close" onClick={onClose} aria-label="Close">
        ×
      </button>
      <button
        className="lightbox-nav prev"
        onClick={(e) => {
          e.stopPropagation();
          onIndex((index - 1 + photos.length) % photos.length);
        }}
        aria-label="Previous"
      >
        ‹
      </button>
      <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: "100%" }}>
        <Photo src={photo.src} alt={photo.alt} photographer={photographer} original={original} />
      </div>
      <button
        className="lightbox-nav next"
        onClick={(e) => {
          e.stopPropagation();
          onIndex((index + 1) % photos.length);
        }}
        aria-label="Next"
      >
        ›
      </button>
    </div>
  );
}
