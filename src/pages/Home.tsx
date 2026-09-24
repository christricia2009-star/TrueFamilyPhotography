import { Link } from "react-router-dom";
import { Photo } from "../components/Photo";
import { getPhotographer, previousShoots, SERVICE_AREA } from "../data/studio";
import { previewSrc } from "../lib/images";

export function Home() {
  return (
    <>
      <section className="hero">
        <h1 className="visually-hidden">True Family Photography</h1>
        <img
          src="/images/hero.jpg"
          alt="A tiger in warm light, photographed for True Family Photography"
          width={1388}
          height={1734}
          fetchPriority="high"
          decoding="async"
        />
      </section>
      <section className="hero-intro">
        <div className="wrap">
          <p className="kicker">{SERVICE_AREA}</p>
          <p className="lede">
            Families, football, formals, first days. These are photographs from sessions we have already made.
          </p>
          <div className="hero-actions">
            <a href="#work" className="btn">
              See the work
            </a>
            <Link to="/book" className="btn ghost">
              Book a session
            </Link>
          </div>
        </div>
      </section>

      <section className="section" id="work">
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="kicker">Previous shoots</p>
              <h2>From the archive</h2>
            </div>
            <Link to="/galleries" className="btn ghost">
              Client galleries
            </Link>
          </div>
          <p style={{ maxWidth: "46ch", color: "var(--ink-soft)", marginTop: -12 }}>
            A session is booked with the studio. The name on a frame is who held the camera that day.
          </p>
          <div className="albums" style={{ marginTop: 36 }}>
            {previousShoots.map((shoot) => {
              const cover = shoot.photos[0];
              return (
                <div key={shoot.id} className="album">
                  <h3>{shoot.title}</h3>
                  <p style={{ color: "var(--muted)", marginTop: -8, marginBottom: 16 }}>{shoot.blurb}</p>
                  <Link to={`/galleries/${shoot.id}`} className="album-cover" aria-label={`Open the ${shoot.title} gallery`}>
                    <Photo
                      src={cover.src}
                      alt={cover.alt}
                      photographer={getPhotographer(cover.photographerId)}
                    />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="split">
        <div className="copy">
          <p className="kicker" style={{ color: "var(--gold)" }}>
            Your photos
          </p>
          <h2>A code. A QR. Your gallery.</h2>
          <p>
            After a session, you get a private access code and a QR. Scan or type it. The album opens.
            The pictures above are from shoots we can show. Yours stay locked until the code.
          </p>
          <div style={{ marginTop: 28, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link to="/galleries" className="btn gold">
              Open a gallery
            </Link>
            <Link to="/book" className="btn ghost" style={{ color: "var(--paper)", borderColor: "var(--paper)" }}>
              Book a session
            </Link>
          </div>
        </div>
        <div className="visual">
          <img src={previewSrc("/images/patricia/p02.jpg")} alt="Formal portrait from a client session" />
        </div>
      </section>
    </>
  );
}
