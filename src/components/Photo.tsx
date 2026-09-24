import type { Photographer } from "../data/studio";
import { watermarkFor } from "../data/studio";
import { previewSrc } from "../lib/images";

type Props = {
  src: string;
  alt: string;
  photographer?: Photographer;
  locked?: boolean;
  className?: string;
  onClick?: () => void;
  eager?: boolean;
  width?: number;
  height?: number;
  /** Unlocked client files. Public pages use the watermarked preview. */
  original?: boolean;
};

export function Photo({ src, alt, photographer, locked, className, onClick, eager, width, height, original }: Props) {
  const mark = photographer ? watermarkFor(photographer) : "";
  const at = mark.indexOf("@");
  const shown = original ? src : previewSrc(src);

  return (
    <figure className={`photo ${className ?? ""}`} onClick={onClick} role={onClick ? "button" : undefined}>
      <img
        src={shown}
        alt={alt}
        className={locked ? "is-locked" : undefined}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        width={width}
        height={height}
      />
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
