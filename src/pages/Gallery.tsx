import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link, Navigate, useParams, useSearchParams } from "react-router-dom";
import { Lightbox } from "../components/Lightbox";
import { Photo } from "../components/Photo";
import { QrCard } from "../components/QrCard";
import { Reveal } from "../components/Reveal";
import { Slideshow } from "../components/Slideshow";
import { WallPreview } from "../components/WallPreview";
import { findGalleryByCode, getGallery, getPhotographer } from "../data/studio";
import { downloadAlbum, downloadPhoto } from "../lib/download";
import { toLineArt } from "../lib/lineArt";
import { isFavorite, isUnlocked, listFavorites, toggleFavorite, unlockGallery } from "../lib/storage";

export function Gallery() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const gallery = id ? getGallery(id) : undefined;
  const photographer = gallery ? getPhotographer(gallery.photographerId) : undefined;
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState<number | null>(null);
  const [play, setPlay] = useState(false);
  const [playIndex, setPlayIndex] = useState(0);
  const [reveal, setReveal] = useState(false);
  const [wall, setWall] = useState(false);
  const [line, setLine] = useState<string | null>(null);
  const [busy, setBusy] = useState("");
  const [, setTick] = useState(0);

  useEffect(() => {
    if (!gallery) return;
    const fromQuery = params.get("code");
    const ok =
      (fromQuery && fromQuery.trim().toUpperCase() === gallery.code) || isUnlocked(gallery.id);
    if (!ok) {
      setUnlocked(false);
      return;
    }
    if (fromQuery && fromQuery.trim().toUpperCase() === gallery.code) unlockGallery(gallery.id);
    const seen = sessionStorage.getItem(`tfp-reveal-${gallery.id}`);
    if (!seen) setReveal(true);
    setUnlocked(true);
  }, [gallery, params]);

  const shareUrl = useMemo(() => {
    if (!gallery || typeof window === "undefined") return "";
    return `${window.location.origin}/galleries/${gallery.id}?code=${encodeURIComponent(gallery.code)}`;
  }, [gallery]);

  if (!gallery || !photographer) return <Navigate to="/galleries" replace />;

  function tryCode(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!gallery) return;
    const raw = String(new FormData(e.currentTarget).get("code") || "");
    const match = findGalleryByCode(raw);
    if (!match || match.id !== gallery.id) {
      setError("That code is not for this album.");
      return;
    }
    unlockGallery(gallery.id);
    sessionStorage.removeItem(`tfp-reveal-${gallery.id}`);
    setReveal(true);
    setUnlocked(true);
    setError("");
  }

  const hearts = listFavorites(gallery.id);

  async function zip() {
    if (!gallery) return;
    setBusy("zip");
    await downloadAlbum(gallery.photos, gallery.id);
    setBusy("");
  }

  async function phoenixPage(src: string) {
    setBusy("art");
    try {
      setLine(await toLineArt(src));
    } finally {
      setBusy("");
    }
  }

  const showPhotos = unlocked || gallery.publicPreview;

  if (!showPhotos) {
    return (
      <section className="section" style={{ paddingTop: 140 }}>
        <div className="wrap lock-screen">
          <p className="kicker">{photographer.handle}</p>
          <h1>{gallery.title}</h1>
          <p>
            {gallery.subtitle} · {gallery.dateLabel}. Enter the access code. The first look comes before
            the grid.
          </p>
          <div className="lock-preview">
            {gallery.photos.slice(0, 3).map((p) => (
              <Photo key={p.src} src={p.src} alt="" locked photographer={photographer} />
            ))}
          </div>
          <form className="code-form" onSubmit={tryCode}>
            <input name="code" placeholder="Access code" aria-label="Access code" autoComplete="off" />
            <button className="btn" type="submit">
              Unlock
            </button>
          </form>
          {error && <p className="error" style={{ marginTop: 12 }}>{error}</p>}
          <p style={{ marginTop: 24 }}>
            <Link to="/galleries">All galleries</Link>
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="section" style={{ paddingTop: 140 }}>
      {reveal && (
        <Reveal
          photos={gallery.photos}
          photographer={photographer}
          title={gallery.title}
          onDone={() => {
            sessionStorage.setItem(`tfp-reveal-${gallery.id}`, "1");
            setReveal(false);
          }}
        />
      )}
      <div className="wrap">
        <div className="page-hero gallery-head" style={{ paddingTop: 0 }}>
          <div>
            <p className="kicker">{unlocked ? `${photographer.handle} · unlocked` : photographer.handle}</p>
            <h1>{gallery.title}</h1>
            <p>
              {unlocked
                ? "Heart the frames for the wall. Download the files you paid for. Phoenix can turn a heart into a coloring page."
                : `${gallery.subtitle.replace(/\.$/, "")}. Tap a picture to see it larger.`}
            </p>
            {unlocked ? (
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 18 }}>
                <button
                  type="button"
                  className="btn"
                  onClick={() => {
                    setPlayIndex(open ?? 0);
                    setPlay(true);
                  }}
                >
                  Play the album
                </button>
                <button type="button" className="btn ghost" onClick={() => setReveal(true)}>
                  Play the reveal
                </button>
                <button type="button" className="btn ghost" onClick={() => setWall(true)} disabled={!hearts.length}>
                  On the wall · {hearts.length}
                </button>
                <button type="button" className="btn ghost" onClick={zip} disabled={busy === "zip"}>
                  {busy === "zip" ? "Packing…" : "Download album"}
                </button>
              </div>
            ) : (
              <form className="code-form" onSubmit={tryCode} style={{ marginTop: 18 }}>
                <input name="code" placeholder="Code for the clean files" aria-label="Access code" autoComplete="off" />
                <button className="btn" type="submit">
                  Unlock
                </button>
              </form>
            )}
            {error && <p className="error" style={{ marginTop: 12 }}>{error}</p>}
          </div>
          {unlocked && shareUrl && <QrCard value={shareUrl} caption={gallery.code} />}
        </div>
        <div className="masonry">
          {gallery.photos.map((photo, i) => (
            <div key={photo.src} className="heart-shot">
              <Photo
                src={photo.src}
                alt={photo.alt}
                photographer={photographer}
                original={unlocked}
                onClick={() => setOpen(i)}
              />
              <button
                type="button"
                className={`heart-btn ${isFavorite(gallery.id, photo.src) ? "is-on" : ""}`}
                aria-label="Favorite"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite({
                    galleryId: gallery.id,
                    src: photo.src,
                    alt: photo.alt,
                    photographerId: photographer.id,
                  });
                  setTick((n) => n + 1);
                }}
              >
                ♥
              </button>
              {unlocked && (
                <div className="shot-actions">
                  <button
                    type="button"
                    onClick={() => downloadPhoto(photo.src, `${gallery.id}-${i + 1}.jpg`)}
                  >
                    File
                  </button>
                  <button type="button" onClick={() => phoenixPage(photo.src)} disabled={busy === "art"}>
                    Phoenix page
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {open !== null && (
        <Lightbox
          photos={gallery.photos}
          index={open}
          photographer={photographer}
          original={unlocked}
          onClose={() => setOpen(null)}
          onIndex={setOpen}
        />
      )}
      {play && (
        <Slideshow
          photos={gallery.photos}
          index={playIndex}
          photographer={photographer}
          original={unlocked}
          onClose={() => setPlay(false)}
          onIndex={setPlayIndex}
        />
      )}
      {wall && <WallPreview hearts={hearts} onClose={() => setWall(false)} />}
      {line && (
        <div className="wall-modal" role="dialog">
          <button type="button" className="lightbox-close" onClick={() => setLine(null)}>
            ×
          </button>
          <div className="line-art-card">
            <p className="kicker">Little Lens gift</p>
            <h2>Color their picture.</h2>
            <img src={line} alt="Line art coloring page" />
            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              <a className="btn" href={line} download="phoenix-coloring.png">
                Save page
              </a>
              <Link to="/photographers/phoenix#coloring" className="btn ghost">
                More coloring
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
