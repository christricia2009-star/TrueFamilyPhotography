import { useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { Lightbox } from "../components/Lightbox";
import { Photo } from "../components/Photo";
import { getPhotographer, sessionsFor, type Photo as PhotoType } from "../data/studio";

export function Photographer() {
  const { id } = useParams();
  const person = id ? getPhotographer(id) : undefined;
  const [open, setOpen] = useState<number | null>(null);
  const albums = useMemo(() => {
    if (!person) return [];
    const map = new Map<string, PhotoType[]>();
    for (const photo of person.photos) {
      const list = map.get(photo.album) ?? [];
      list.push(photo);
      map.set(photo.album, list);
    }
    return [...map.entries()];
  }, [person]);

  if (!person) return <Navigate to="/photographers" replace />;

  if (person.kind === "junior") return <PhoenixPage />;
  if (person.kind === "studio") return <ChrisPage />;

  return (
    <section className="section" style={{ paddingTop: 140 }}>
      <div className="wrap">
        <div className="profile">
          <div className="portrait">
            <Photo src={person.portrait} alt={person.portraitAlt} photographer={person} />
          </div>
          <div>
            <p className="kicker">{person.role}</p>
            <p className="handle" style={{ fontFamily: "var(--script)", fontSize: "2.4rem", color: "var(--gold-deep)" }}>
              {person.handle}
            </p>
            <h1>{person.name}</h1>
            <p className="photo-studio" style={{ color: "var(--muted)", margin: "8px 0 18px" }}>
              {person.credit}
            </p>
            <p style={{ fontFamily: "var(--serif)", fontSize: "1.45rem", lineHeight: 1.4, maxWidth: "38ch" }}>
              {person.tagline}
            </p>
            <p style={{ marginTop: 18, color: "var(--ink-soft)", maxWidth: "46ch" }}>{person.bio}</p>
            <div className="session-row" style={{ marginTop: 22 }}>
              {sessionsFor(person).map((s) => (
                <span key={s.id} className="session-chip">
                  {s.label}
                </span>
              ))}
            </div>
            {person.bookable && (
              <Link to={`/book/${person.id}`} className="btn" style={{ marginTop: 28 }}>
                Book {person.name}
              </Link>
            )}
          </div>
        </div>

        <div className="albums">
          {albums.map(([album, photos]) => (
            <div key={album} className="album">
              <h3>{album}</h3>
              <div className="album-grid">
                {photos.map((photo) => {
                  const index = person.photos.findIndex((p) => p.src === photo.src);
                  return (
                    <Photo
                      key={photo.src}
                      src={photo.src}
                      alt={photo.alt}
                      photographer={person}
                      onClick={() => setOpen(index)}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      {open !== null && (
        <Lightbox
          photos={person.photos}
          index={open}
          photographer={person}
          onClose={() => setOpen(null)}
          onIndex={setOpen}
        />
      )}
    </section>
  );
}

function ChrisPage() {
  const chris = getPhotographer("chris")!;
  return (
    <section className="section" style={{ paddingTop: 140 }}>
      <div className="wrap">
        <div className="profile">
          <div className="portrait">
            <Photo src={chris.portrait} alt={chris.portraitAlt} photographer={chris} />
          </div>
          <div>
            <p className="kicker">Not a photographer. Still on the team.</p>
            <p className="handle" style={{ fontFamily: "var(--script)", fontSize: "2.4rem", color: "var(--gold-deep)" }}>
              {chris.handle}
            </p>
            <h1>{chris.name}</h1>
            <p className="photo-studio" style={{ color: "var(--muted)", margin: "8px 0 18px" }}>
              {chris.credit}
            </p>
            <p className="chris-aside">{chris.tagline}</p>
            <p style={{ marginTop: 18, color: "var(--ink-soft)", maxWidth: "46ch" }}>{chris.bio}</p>
            <ul className="duty-list">
              {chris.duties?.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div style={{ marginTop: 28, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link to="/book" className="btn">
                Book a photographer
              </Link>
              <Link to="/galleries" className="btn ghost">
                The galleries he built
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PhoenixPage() {
  const phoenix = getPhotographer("phoenix")!;
  return (
    <div className="phoenix-page">
      <section className="page-hero">
        <div className="wrap">
          <p className="kicker">Age 8 · just getting started</p>
          <p style={{ fontFamily: "Great Vibes, cursive", fontSize: "2.2rem", color: "#1aa6c4" }}>
            {phoenix.handle}
          </p>
          <h1>Hi. I’m Phoenix.</h1>
          <p style={{ fontFamily: "Fredoka, sans-serif", fontSize: "1.25rem", maxWidth: "42ch", color: "#2b1d3a" }}>
            {phoenix.tagline} Let’s be honest: an eight-year-old can take a photo just as good as a
            grown-up. The horizon might be a little tippy. The joy will not.
          </p>
        </div>
      </section>
      <section className="section tight">
        <div className="wrap phoenix-intro">
          <Photo src={phoenix.portrait} alt={phoenix.portraitAlt} photographer={phoenix} />
          <div>
            <h2>No portfolio yet. Plenty of opinions.</h2>
            <p style={{ marginTop: 12, fontFamily: "Fredoka, sans-serif", fontSize: "1.1rem" }}>{phoenix.bio}</p>
            <Link to="/book/phoenix" className="btn" style={{ marginTop: 24, background: "#e23e6b" }}>
              Book a Little Lens adventure
            </Link>
          </div>
        </div>
      </section>
      <section className="section tight">
        <div className="wrap">
          <h2 style={{ marginBottom: 18 }}>Things Phoenix would like you to know</h2>
          <div className="joke-grid">
            {phoenix.jokes?.map((joke) => (
              <article key={joke} className="joke-card">
                {joke}
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="wrap">
          <h2>The wall of photos (coming soon)</h2>
          <p style={{ fontFamily: "Fredoka, sans-serif", marginTop: 8 }}>
            This is where the pictures will go. After more recesses. After snack.
          </p>
          <div className="empty-wall">
            {["look at the bug", "the dog said yes", "kids being kids"].map((caption) => (
              <figure key={caption} className="polaroid">
                <div className="slot">photo goes here someday</div>
                <figcaption>{caption}</figcaption>
              </figure>
            ))}
          </div>
          <p className="note" style={{ marginTop: 28 }}>
            {phoenix.bookingNote}
          </p>
        </div>
      </section>
    </div>
  );
}
