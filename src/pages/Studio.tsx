import { FormEvent, useMemo, useState } from "react";
import { QrCard } from "../components/QrCard";
import { clientGalleries, getPhotographer, STUDIO_PIN } from "../data/studio";
import { isStudioAuthed, listBookings, setStudioAuth } from "../lib/storage";

export function Studio() {
  const [authed, setAuthed] = useState(isStudioAuthed());
  const [error, setError] = useState("");
  const bookings = authed ? listBookings() : [];
  const origin = typeof window === "undefined" ? "" : window.location.origin;

  const cards = useMemo(
    () =>
      clientGalleries.map((g) => ({
        ...g,
        url: `${origin}/galleries/${g.id}?code=${encodeURIComponent(g.code)}`,
        person: getPhotographer(g.photographerId),
      })),
    [origin],
  );

  function onPin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const pin = String(new FormData(e.currentTarget).get("pin") || "");
    if (pin.trim().toUpperCase() !== STUDIO_PIN) {
      setError("That’s not the family desk pin.");
      return;
    }
    setStudioAuth(true);
    setAuthed(true);
  }

  if (!authed) {
    return (
      <section className="section" style={{ paddingTop: 140 }}>
        <div className="wrap" style={{ maxWidth: 480 }}>
          <p className="kicker">Family desk</p>
          <h1>Studio</h1>
          <p style={{ margin: "12px 0 24px", color: "var(--ink-soft)" }}>
            Chris’s corner. Bookings and gallery codes. Not for the public internet.
          </p>
          <form className="form" onSubmit={onPin}>
            <label>
              Pin
              <input name="pin" type="password" autoComplete="off" />
            </label>
            <button className="btn" type="submit">
              Open
            </button>
            {error && <p className="error">{error}</p>}
          </form>
        </div>
      </section>
    );
  }

  return (
    <section className="section" style={{ paddingTop: 140 }}>
      <div className="wrap">
        <div className="page-hero" style={{ paddingTop: 0 }}>
          <p className="kicker">Family desk</p>
          <h1>Studio</h1>
          <p>Booking requests land here. Print a QR with the matching code for each paid album.</p>
        </div>

        <h2 style={{ marginBottom: 12 }}>Bookings</h2>
        {bookings.length === 0 ? (
          <p className="note">No requests yet. The book form writes them here.</p>
        ) : (
          <table className="studio-table">
            <thead>
              <tr>
                <th>When</th>
                <th>Who</th>
                <th>Photographer</th>
                <th>Session</th>
                <th>Date / where</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => {
                const p = getPhotographer(b.photographerId);
                return (
                  <tr key={b.id}>
                    <td>{new Date(b.createdAt).toLocaleString()}</td>
                    <td>
                      {b.name}
                      <br />
                      {b.email}
                      <br />
                      {b.phone}
                    </td>
                    <td>{p?.handle}</td>
                    <td>{b.sessionType}</td>
                    <td>
                      {b.date}
                      <br />
                      {b.location}
                      <br />
                      {b.message}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        <h2 style={{ margin: "48px 0 12px" }}>Gallery cards</h2>
        <div className="photographer-grid">
          {cards.map((g) => (
            <div key={g.id} style={{ background: "var(--paper)", padding: 16, border: "1px solid var(--rule)" }}>
              <p className="kicker">{g.person?.handle}</p>
              <h3>{g.title}</h3>
              <p className="success-code">{g.code}</p>
              <QrCard value={g.url} caption="Scan to open the paid album" />
            </div>
          ))}
        </div>
        <button
          className="btn ghost"
          style={{ marginTop: 32 }}
          onClick={() => {
            setStudioAuth(false);
            setAuthed(false);
          }}
        >
          Lock the desk
        </button>
      </div>
    </section>
  );
}
