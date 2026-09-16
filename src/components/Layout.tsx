import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { photographers, STUDIO_EMAIL, STUDIO_NAME } from "../data/studio";

export function Layout() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const [solid, setSolid] = useState(!isHome);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    if (!isHome) {
      setSolid(true);
      return;
    }
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  return (
    <>
      <header className={`site-header ${isHome ? "is-hero" : "is-inner"} ${solid ? "is-solid" : ""}`}>
        <Link to="/" className="wordmark" onClick={() => setOpen(false)}>
          <strong>True Family</strong>
          <span>Photography</span>
        </Link>
        <button className="menu-toggle" aria-label="Menu" onClick={() => setOpen((v) => !v)}>
          <span />
          <span />
          <span />
        </button>
        <nav className={`nav-links ${open ? "is-open" : ""}`}>
          <NavLink to="/photographers">Photographers</NavLink>
          <NavLink to="/galleries">Client galleries</NavLink>
          <NavLink to="/about">The family</NavLink>
          <Link to="/book" className="nav-cta">
            Book a session
          </Link>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="wrap footer-grid">
          <div>
            <p className="kicker">The studio</p>
            <h2>{STUDIO_NAME}</h2>
            <p style={{ marginTop: 12, maxWidth: "36ch", color: "var(--ink-soft)" }}>
              A family studio. Every image is marked name@truefamilyphotography — so you always know
              who made it, and that it lives under one business, one insurance, one archive.
            </p>
          </div>
          <div>
            <p className="kicker">The photographers</p>
            <div className="handle-list" style={{ marginTop: 14 }}>
              {photographers.map((p) => (
                <Link key={p.id} to={`/photographers/${p.id}`}>
                  {p.handle}
                  <small>{p.name}</small>
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="kicker">Visit</p>
            <div style={{ marginTop: 14, display: "grid", gap: 8 }}>
              <Link to="/book">Book a photographer</Link>
              <Link to="/galleries">Open a paid gallery</Link>
              <a href={`mailto:${STUDIO_EMAIL}`}>{STUDIO_EMAIL}</a>
              <Link to="/studio" style={{ opacity: 0.55 }}>
                Family desk
              </Link>
            </div>
          </div>
        </div>
        <div className="wrap legal">© {new Date().getFullYear()} True Family Photography · All sessions billed to the studio</div>
      </footer>
    </>
  );
}
