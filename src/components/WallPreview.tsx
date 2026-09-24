import { useState } from "react";
import { Link } from "react-router-dom";
import { previewSrc } from "../lib/images";
import type { Favorite } from "../lib/storage";

type Props = {
  hearts: Favorite[];
  onClose: () => void;
};

export function WallPreview({ hearts, onClose }: Props) {
  const [i, setI] = useState(0);
  const shot = hearts[i];
  if (!shot) return null;

  return (
    <div className="wall-modal" role="dialog" aria-modal="true">
      <button type="button" className="lightbox-close" onClick={onClose} aria-label="Close">
        ×
      </button>
      <div className="wall-scene">
        <img className="wall-room" src={previewSrc("/images/wall.jpg")} alt="" />
        <div className="wall-frame">
          <img src={shot.src} alt={shot.alt} />
        </div>
      </div>
      <div className="wall-caption">
        <p className="kicker">On your wall</p>
        <h2>{shot.alt || "This frame"}</h2>
        <p>Heart it. See it hang. Then buy the print — Chris already has the list.</p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 16 }}>
          {hearts.length > 1 && (
            <button type="button" className="btn ghost" onClick={() => setI((n) => (n + 1) % hearts.length)}>
              Next heart
            </button>
          )}
          <Link to="/shop" className="btn">
            Order this print
          </Link>
        </div>
      </div>
    </div>
  );
}
