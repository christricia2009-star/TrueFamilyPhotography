import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link, Navigate, useParams, useSearchParams } from "react-router-dom";
import { Lightbox } from "../components/Lightbox";
import { Photo } from "../components/Photo";
import { QrCard } from "../components/QrCard";
import { findGalleryByCode, getGallery, getPhotographer } from "../data/studio";
import { isUnlocked, unlockGallery } from "../lib/storage";

export function Gallery() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const gallery = id ? getGallery(id) : undefined;
  const photographer = gallery ? getPhotographer(gallery.photographerId) : undefined;
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    if (!gallery) return;
    const fromQuery = params.get("code");
    if (fromQuery && fromQuery.trim().toUpperCase() === gallery.code) {
      unlockGallery(gallery.id);
      setUnlocked(true);
      return;
    }
    setUnlocked(isUnlocked(gallery.id));
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
    setUnlocked(true);
    setError("");
  }

  if (!unlocked) {
    return (
      <section className="section" style={{ paddingTop: 140 }}>
        <div className="wrap lock-screen">
          <p className="kicker">{photographer.handle}</p>
          <h1>{gallery.title}</h1>
          <p>
            {gallery.subtitle} · {gallery.dateLabel}. Enter the access code from your session, or scan the
            QR on the card we sent.
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
      <div className="wrap">
        <div className="page-hero gallery-head" style={{ paddingTop: 0 }}>
          <div>
            <p className="kicker">{photographer.handle} · unlocked</p>
            <h1>{gallery.title}</h1>
            <p>
              {gallery.subtitle} · {gallery.dateLabel}. Save the QR so family can open this album later.
            </p>
          </div>
          {shareUrl && <QrCard value={shareUrl} caption={gallery.code} />}
        </div>
        <div className="masonry">
          {gallery.photos.map((photo, i) => (
            <Photo
              key={photo.src}
              src={photo.src}
              alt={photo.alt}
              photographer={photographer}
              onClick={() => setOpen(i)}
            />
          ))}
        </div>
      </div>
      {open !== null && (
        <Lightbox
          photos={gallery.photos}
          index={open}
          photographer={photographer}
          onClose={() => setOpen(null)}
          onIndex={setOpen}
        />
      )}
    </section>
  );
}
