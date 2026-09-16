import { useEffect } from "react";
import type { Photo as PhotoType, Photographer } from "../data/studio";
import { Photo } from "./Photo";

type Props = {
  photos: PhotoType[];
  index: number;
  photographer?: Photographer;
  onClose: () => void;
  onIndex: (n: number) => void;
};

export function Slideshow({ photos, index, photographer, onClose, onIndex }: Props) {
  const photo = photos[index];

  useEffect(() => {
    const tick = setInterval(() => onIndex((index + 1) % photos.length), 3200);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onIndex((index + 1) % photos.length);
      if (e.key === "ArrowLeft") onIndex((index - 1 + photos.length) % photos.length);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      clearInterval(tick);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [index, onClose, onIndex, photos.length]);

  if (!photo) return null;

  return (
    <div className="lightbox slideshow" onClick={onClose} role="dialog" aria-modal="true">
      <button className="lightbox-close" onClick={onClose} aria-label="Close">
        ×
      </button>
      <p className="slideshow-label">Playing the album</p>
      <div onClick={(e) => e.stopPropagation()} className="slideshow-frame">
        <Photo src={photo.src} alt={photo.alt} photographer={photographer} />
      </div>
    </div>
  );
}
