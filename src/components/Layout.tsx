import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import {
  FACEBOOK_URL,
  INSTAGRAM_URL,
  LIABILITY_NOTE,
  photographers,
  STUDIO_EMAIL,
  STUDIO_NAME,
} from "../data/studio";
import { NotifyPrompt } from "./NotifyPrompt";
import { cartCount } from "../lib/storage";

export function Layout() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const [solid, setSolid] = useState(!isHome);
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);

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

  useEffect(() => {
    const sync = () => setCount(cartCount());
    sync();
    window.addEventListener("tfp-cart", sync);
    return () => window.removeEventListener("tfp-cart", sync);
  }, [pathname]);

  return (
    <>
      <NotifyPrompt />
      <header className={`site-header ${isHome ? "is-hero" : "is-inner"} ${solid ? "is-solid" : ""}`}>
        <Link to="/" className="wordmark" onClick={() => setOpen(false)}>
          <strong>True Family</strong>
          <span>Photography</span>
        </Link>
        <div className="header-actions">
          <nav className={`nav-links ${open ? "is-open" : ""}`}>
            <NavLink to="/photographers">Photographers</NavLink>
            <NavLink to="/galleries">Client galleries</NavLink>
            <NavLink to="/shop">Shop{count ? ` (${count})` : ""}</NavLink>
            <NavLink to="/about">The family</NavLink>
            <Link to="/book" className="nav-cta">
              Book a session
            </Link>
            <div className="nav-social">
              <SocialLinks />
            </div>
          </nav>
          <div className="header-social">
            <SocialLinks />
          </div>
          <button className="menu-toggle" aria-label="Menu" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="wrap footer-grid">
          <div>
            <p className="kicker">The studio</p>
            <h2>
              <Link to="/">{STUDIO_NAME}</Link>
            </h2>
            <p style={{ marginTop: 12, maxWidth: "36ch", color: "var(--ink-soft)" }}>
              A family studio. Every image is marked name@truefamilyphotography — so you always know
              who made it, and that it lives under one business, one insurance, one archive.
            </p>
            <p style={{ marginTop: 12, maxWidth: "36ch", color: "var(--ink-soft)" }}>{LIABILITY_NOTE}</p>
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
              <Link to="/shop">The shop</Link>
              <Link to="/galleries">Open a paid gallery</Link>
              <a href={`mailto:${STUDIO_EMAIL}`}>{STUDIO_EMAIL}</a>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
              <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer">
                Facebook
              </a>
            </div>
          </div>
        </div>
        <div className="wrap legal">
          <span>© {new Date().getFullYear()} True Family Photography · All sessions billed to the studio</span>
          <VisitorCount />
        </div>
      </footer>
    </>
  );
}

const VISITOR_KEY = "tfp-visitor";
const VISITOR_GET = "https://abacus.jasoncameron.dev/get/truefamilyphotography/visitors";
const VISITOR_HIT = "https://abacus.jasoncameron.dev/hit/truefamilyphotography/visitors";
let visitorRequestStarted = false;

function VisitorCount() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    if (visitorRequestStarted) return;
    visitorRequestStarted = true;
    let seen = false;
    try {
      seen = localStorage.getItem(VISITOR_KEY) === "1";
    } catch {
      seen = false;
    }
    fetch(seen ? VISITOR_GET : VISITOR_HIT)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { value?: number } | null) => {
        if (typeof data?.value !== "number") return;
        setCount(data.value);
        try {
          localStorage.setItem(VISITOR_KEY, "1");
        } catch {
          /* a cleared browser is counted again, which is the limit of this tally */
        }
      })
      .catch(() => {});
  }, []);

  if (count === null) return null;
  const label = count === 1 ? "visitor" : "visitors";
  return (
    <span className="visitor-count">
      Visitors · {count.toLocaleString()} {label}
    </span>
  );
}

function SocialLinks() {
  return (
    <div className="social-links">
      <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
        <InstagramIcon />
      </a>
      <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
        <FacebookIcon />
      </a>
    </div>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="3.8" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.3" cy="6.7" r="0.9" fill="currentColor" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M14.2 8.4V6.9c0-.7.4-1 1.1-1H17V3.4h-2.2C12.3 3.4 11 4.7 11 6.8v1.6H9v2.6h2V20.5h3.1v-9.5h2.3l.3-2.6h-2.5z"
      />
    </svg>
  );
}
