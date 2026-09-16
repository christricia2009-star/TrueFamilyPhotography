import { useEffect, useState } from "react";
import type { Photographer, Photo as PhotoType } from "../data/studio";
import { watermarkFor } from "../data/studio";

type Props = {
  photos: PhotoType[];
  photographer: Photographer;
  title: string;
  onDone: () => void;
};

export function Reveal({ photos, photographer, title, onDone }: Props) {
  const [step, setStep] = useState(0);
  const first = photos[0];

  useEffect(() => {
    const t1 = window.setTimeout(() => setStep(1), 700);
    const t2 = window.setTimeout(() => setStep(2), 2200);
    const t3 = window.setTimeout(() => setStep(3), 5200);
    const t4 = window.setTimeout(onDone, 6800);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter") onDone();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      window.removeEventListener("keydown", onKey);
    };
  }, [onDone]);

  return (
    <div className="reveal" role="dialog" aria-label="Album reveal">
      <button type="button" className="reveal-skip" onClick={onDone}>
        Skip
      </button>
      <p className={`reveal-credit ${step >= 1 ? "is-on" : ""}`}>{watermarkFor(photographer)}</p>
      {first && (
        <figure className={`reveal-frame ${step >= 2 ? "is-on" : ""}`}>
          <img src={first.src} alt={first.alt} />
        </figure>
      )}
      <h1 className={`reveal-title ${step >= 3 ? "is-on" : ""}`}>{title}</h1>
    </div>
  );
}
