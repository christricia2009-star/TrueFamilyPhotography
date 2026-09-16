import { Link } from "react-router-dom";
import { photographers } from "../data/studio";

export function Photographers() {
  return (
    <section className="section" style={{ paddingTop: 140 }}>
      <div className="wrap">
        <div className="page-hero" style={{ paddingTop: 0 }}>
          <p className="kicker">The family</p>
          <h1>Four of us. One studio.</h1>
          <p>
            Patricia and Skylar make the pictures. Phoenix is learning to. Chris makes sure the cameras
            have batteries and the website has a front door. Book the photographer. Meet the whole team.
          </p>
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
                <span className="kind-pill">
                  {p.kind === "studio" ? "Studio" : p.kind === "junior" ? "Age 8" : "Photographer"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
