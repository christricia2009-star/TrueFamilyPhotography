import { Link } from "react-router-dom";
import { Photo } from "../components/Photo";
import { currentThing, photographers, SERVICE_AREA } from "../data/studio";

const featured = [
  { src: "/images/patricia/p07.jpg", alt: "Child in autumn leaves", id: "patricia" },
  { src: "/images/skylar/sport01.jpg", alt: "Football at sunset", id: "skylar" },
  { src: "/images/patricia/p03.jpg", alt: "Formal portraits under a rose arbor", id: "patricia" },
  { src: "/images/skylar/car02.jpg", alt: "Orange Porsche at a meet", id: "skylar" },
  { src: "/images/patricia/p08.jpg", alt: "Wedding portrait", id: "patricia" },
] as const;

export function Home() {
  const patricia = photographers.find((p) => p.id === "patricia");
  const skylar = photographers.find((p) => p.id === "skylar");

  return (
    <>
      <section className="hero">
        <img src="/images/hero.jpg" alt="A family walking through tall grass at golden hour" />
        <div className="hero-copy">
          <p className="kicker" style={{ color: "rgba(251,246,238,0.8)" }}>
            {SERVICE_AREA}
          </p>
          <h1>True Family Photography</h1>
          <p className="lede">
            Two photographers, an eight-year-old with a camera, and the guy who makes sure the batteries
            are charged. One family studio.
          </p>
          <div className="hero-handles">
            {photographers.map((p) => (
              <Link key={p.id} to={`/photographers/${p.id}`}>
                {p.handle}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="now-bar">
        <div className="wrap now-inner">
          <div>
            <p className="kicker">{currentThing.kicker}</p>
            <h2>{currentThing.title}</h2>
            <p>{currentThing.blurb}</p>
          </div>
          <Link to={currentThing.href} className="btn">
            Color with Phoenix
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="wrap intro-grid">
          <div>
            <p className="kicker">The studio</p>
            <h2 style={{ fontSize: "clamp(2.6rem, 5vw, 4.4rem)", marginTop: 10 }}>
              A family behind the lens. And one behind the laptop.
            </h2>
          </div>
          <p>
            Patricia photographs families, formals, and first days. Skylar photographs Friday nights and
            fast cars. Phoenix is eight and just beginning — who better to photograph kids than a kid?
            Chris does not take the pictures. He packs the bag, builds the galleries, and keeps True
            Family Photography a real business. Every frame is credited by name, under one studio.
          </p>
        </div>
      </section>

      <section className="section tight">
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="kicker">The family</p>
              <h2>Meet the team</h2>
            </div>
            <Link to="/photographers" className="btn ghost">
              All four
            </Link>
          </div>
          <div className="photographer-grid">
            {photographers.map((p) => (
              <Link key={p.id} to={`/photographers/${p.id}`} className="photographer-card">
                <div className="frame">
                  <img src={p.portrait} alt={p.portraitAlt} />
                </div>
                <div className="meta">
                  <span className="handle">{p.handle}</span>
                  <h3>{p.name}</h3>
                  <p className="role">{p.role}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="kicker">The work</p>
              <h2>As it actually looks</h2>
            </div>
          </div>
          <div className="work-grid">
            {featured.map((shot, i) => (
              <Photo
                key={shot.src + i}
                src={shot.src}
                alt={shot.alt}
                photographer={shot.id === "patricia" ? patricia : skylar}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="split">
        <div className="copy">
          <p className="kicker" style={{ color: "var(--gold)" }}>
            Client galleries
          </p>
          <h2>A code. A QR. Your photos.</h2>
          <p>
            After a session, you get a private access code and a QR. Scan or type it. The album opens.
            No public feed of someone else’s wedding next to yours — just the work you paid for,
            watermarked with the photographer who made it.
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
          <img src="/images/patricia/p02.jpg" alt="Formal portrait from a client session" />
        </div>
      </section>
    </>
  );
}
