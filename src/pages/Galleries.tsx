import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { clientGalleries, findGalleryByCode, getPhotographer } from "../data/studio";
import { isUnlocked } from "../lib/storage";

export function Galleries() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const code = String(new FormData(e.currentTarget).get("code") || "");
    const gallery = findGalleryByCode(code);
    if (!gallery) {
      setError("That code doesn’t open anything. Check the card from your session.");
      return;
    }
    navigate(`/galleries/${gallery.id}?code=${encodeURIComponent(gallery.code)}`);
  }

  return (
    <section className="section" style={{ paddingTop: 140 }}>
      <div className="wrap">
        <div className="page-hero" style={{ paddingTop: 0 }}>
          <p className="kicker">Paid work</p>
          <h1>Client galleries</h1>
          <p>
            Enter the code from your session, or scan the QR on the card we sent. Galleries stay locked
            until then — that’s the point.
          </p>
        </div>

        <form className="code-form" onSubmit={onSubmit} style={{ maxWidth: 520, marginBottom: 48 }}>
          <input name="code" placeholder="TFP-————-————" aria-label="Access code" autoComplete="off" />
          <button className="btn" type="submit">
            Open
          </button>
        </form>
        {error && <p className="error" style={{ marginBottom: 24 }}>{error}</p>}

        <div className="gallery-list">
          {clientGalleries.map((g) => {
            const person = getPhotographer(g.photographerId);
            const open = isUnlocked(g.id);
            return (
              <Link key={g.id} to={`/galleries/${g.id}`} className={`gallery-row ${open ? "is-open" : ""}`}>
                <img src={g.cover} alt="" />
                <div>
                  <p className="kicker">{g.dateLabel}</p>
                  <h3 style={{ fontSize: "2rem" }}>{g.title}</h3>
                  <p style={{ color: "var(--muted)" }}>
                    {g.subtitle}
                    {person ? ` · ${person.handle}` : ""}
                  </p>
                </div>
                <span className="btn ghost">{open ? "Open" : "Locked"}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
