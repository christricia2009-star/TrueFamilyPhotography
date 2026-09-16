import { Link } from "react-router-dom";
import { photographers, SERVICE_AREA, STUDIO_NAME } from "../data/studio";

export function About() {
  return (
    <section className="section" style={{ paddingTop: 140 }}>
      <div className="wrap">
        <div className="page-hero" style={{ paddingTop: 0 }}>
          <p className="kicker">{STUDIO_NAME}</p>
          <h1>A family studio, on purpose.</h1>
          <p>
            {SERVICE_AREA} We work as one business — True Family Photography — so the insurance, the
            contracts, and the archive all live in the same place. The pictures are credited by the
            person who made them. Easy to correlate. Easy to remember.
          </p>
        </div>
        <div className="photographer-grid" style={{ marginTop: 12 }}>
          {photographers.map((p) => (
            <Link key={p.id} to={`/photographers/${p.id}`} className="photographer-card">
              <div className="frame">
                <img src={p.portrait} alt={p.portraitAlt} />
              </div>
              <div className="meta">
                <span className="handle">{p.handle}</span>
                <h3>{p.name}</h3>
                <p className="role">{p.tagline}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="intro-grid" style={{ marginTop: 72 }}>
          <h2>How the credit works</h2>
          <p>
            Look at the bottom of a frame. You’ll see a watermark like patricia@truefamilyphotography or
            skylar@truefamilyphotography — name plus the studio, one line, easy to correlate. Someday
            phoenix@truefamilyphotography will be on there too. Chris’s mark is on the gear, the galleries,
            and this site. He is fine with that.
          </p>
        </div>
      </div>
    </section>
  );
}
