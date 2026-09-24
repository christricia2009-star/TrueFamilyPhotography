import { Link } from "react-router-dom";
import { Photo } from "../components/Photo";
import { clientGalleries, getPhotographer, previousShoots, SERVICE_AREA } from "../data/studio";
import { previewSrc, thumbSrc } from "../lib/images";

export function Home() {
  return (
    <>
      <section className="hero">
        <img
          src={previewSrc("/images/hero.jpg")}
          alt="A butterfly on a purple flower, photographed for True Family Photography"
          width={1320}
          height={1316}
          fetchPriority="high"
          decoding="async"
        />
        <div className="hero-copy">
          <p className="kicker hero-kicker">{SERVICE_AREA}</p>
          <h1>True Family Photography</h1>
          <p className="lede">
            Families, football, formals, first days. These are photographs from sessions we have already made.
          </p>
          <div className="hero-actions">
            <a href="#work" className="btn">
              See the work
            </a>
            <Link to="/book" className="btn ghost" style={{ color: "#fbf6ee", borderColor: "#fbf6ee" }}>
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
            {previousShoots.map((shoot) => (
              <div key={shoot.id} className="album">
                <h3>{shoot.title}</h3>
                <p style={{ color: "var(--muted)", marginTop: -8, marginBottom: 16 }}>{shoot.blurb}</p>
                <div className="album-grid">
                  {shoot.photos.map((photo) => (
                    <Photo
                      key={photo.src}
                      src={photo.src}
                      alt={photo.alt}
                      photographer={getPhotographer(photo.photographerId)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section tight">
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="kicker">Galleries</p>
              <h2>Sessions we have kept</h2>
            </div>
          </div>
          <div className="gallery-list">
            {clientGalleries.map((gallery) => (
              <Link key={gallery.id} to={`/galleries/${gallery.id}`} className="gallery-row">
                <img src={thumbSrc(gallery.cover)} alt="" />
                <div>
                  <p className="kicker">{gallery.dateLabel}</p>
                  <h3 style={{ fontSize: "2rem" }}>{gallery.title}</h3>
                  <p style={{ color: "var(--muted)" }}>{gallery.subtitle}</p>
                </div>
                <span className="btn ghost">View</span>
              </Link>
            ))}
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
