import type { Photographer } from "../data/studio";
import { watermarkFor } from "../data/studio";

type Props = {
  src: string;
  alt: string;
  photographer?: Photographer;
  locked?: boolean;
  className?: string;
  onClick?: () => void;
};

export function Photo({ src, alt, photographer, locked, className, onClick }: Props) {
  const mark = photographer ? watermarkFor(photographer) : "";
  const at = mark.indexOf("@");

  return (
    <figure className={`photo ${className ?? ""}`} onClick={onClick} role={onClick ? "button" : undefined}>
      <img src={src} alt={alt} className={locked ? "is-locked" : undefined} />
      {photographer && (
        <figcaption className="photo-credit">
          <span className="photo-mark">
            <em>{mark.slice(0, at)}</em>
            <span>{mark.slice(at)}</span>
          </span>
        </figcaption>
      )}
    </figure>
  );
}
