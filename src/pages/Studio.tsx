import { FormEvent, useEffect, useMemo, useState } from "react";
import { QrCard } from "../components/QrCard";
import { clientGalleries, getPhotographer, photographers, STUDIO_PIN, watermarkFor } from "../data/studio";
import { addLibraryPhoto, listLibrary, removeLibraryPhoto } from "../lib/library";
import {
  clearPolaroid,
  defaultPolaroids,
  isStudioAuthed,
  listBookings,
  listFavorites,
  listGifts,
  listHeldDates,
  listNotifySignups,
  listOrders,
  type NotifySignup,
  listPolaroids,
  savePolaroid,
  setStudioAuth,
} from "../lib/storage";

export function Studio() {
  const [authed, setAuthed] = useState(isStudioAuthed());
  const [error, setError] = useState("");
  const [printId, setPrintId] = useState<string | null>(null);
  const [, setTick] = useState(0);
  const bookings = authed ? listBookings() : [];
  const localAlerts = authed ? listNotifySignups() : [];
  const [remoteAlerts, setRemoteAlerts] = useState<NotifySignup[]>([]);
  const [addChannel, setAddChannel] = useState<"text" | "email">("text");
  const [addContact, setAddContact] = useState("");
  const [addNote, setAddNote] = useState("");
  function loadAlerts() {
    fetch("/api/notify", { headers: { "x-studio-pin": STUDIO_PIN } })
      .then((res) => (res.ok ? res.json() : []))
      .then((rows: NotifySignup[]) => {
        if (Array.isArray(rows)) setRemoteAlerts(rows);
      })
      .catch(() => {});
  }
  useEffect(() => {
    if (!authed) return;
    loadAlerts();
  }, [authed]);
  async function addAlert(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setAddNote("");
    const res = await fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-studio-pin": STUDIO_PIN },
      body: JSON.stringify({ channel: addChannel, contact: addContact, page: "desk" }),
    });
    const data = (await res.json().catch(() => ({}))) as { ok?: boolean; reason?: string };
    if (data.reason === "duplicate") {
      setAddNote(addChannel === "text" ? "That number is already on the list." : "That email is already on the list.");
      return;
    }
    if (!res.ok || !data.ok) {
      setAddNote("Couldn't add that.");
      return;
    }
    setAddContact("");
    setAddNote("Added.");
    loadAlerts();
  }
  const alerts = [...remoteAlerts, ...localAlerts.filter((row) => !remoteAlerts.some((remote) => remote.contact === row.contact && remote.createdAt === row.createdAt))];
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
    if (pin.trim() !== STUDIO_PIN) {
      setError("That’s not the family desk pin.");
      return;
    }
    setStudioAuth(true);
    setAuthed(true);
  }

  function onPolaroid(id: string, file: File | undefined) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      savePolaroid(id, String(reader.result));
      setTick((n) => n + 1);
    };
    reader.readAsDataURL(file);
  }

  if (!authed) {
    return (
      <section className="section" style={{ paddingTop: 140 }}>
        <div className="wrap" style={{ maxWidth: 480 }}>
          <p className="kicker">Family desk</p>
          <h1>Studio</h1>
          <p style={{ margin: "12px 0 24px", color: "var(--ink-soft)" }}>
            Chris’s corner. Bookings, hearts, orders, gift codes, Phoenix’s wall. Not for the public internet.
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

  const favorites = listFavorites();
  const orders = listOrders();
  const gifts = listGifts();
  const holds = listHeldDates();
  const polaroids = listPolaroids();
  const printing = cards.find((c) => c.id === printId);

  return (
    <section className="section" style={{ paddingTop: 140 }}>
      <div className="wrap">
        <div className="page-hero" style={{ paddingTop: 0 }}>
          <p className="kicker">Family desk</p>
          <h1>Studio</h1>
          <p>Bookings, photo alerts, held dates, hearts, shop orders, gift codes, and Phoenix’s polaroids.</p>
        </div>

        <h2 style={{ marginBottom: 12 }}>Bookings</h2>
        {bookings.length === 0 ? (
          <p className="note">No requests yet. The book form emails the studio and writes them here.</p>
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
                      {b.giftCode ? (
                        <>
                          <br />
                          gift {b.giftCode}
                        </>
                      ) : null}
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

        <h2 style={{ margin: "48px 0 12px" }}>Photo alerts</h2>
        <form onSubmit={addAlert} style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
          <select value={addChannel} onChange={(e) => setAddChannel(e.target.value as "text" | "email")}>
            <option value="text">Text</option>
            <option value="email">Email</option>
          </select>
          <input
            value={addContact}
            onChange={(e) => setAddContact(e.target.value)}
            placeholder={addChannel === "text" ? "Mobile number" : "Email"}
            aria-label="Contact"
            required
          />
          <button className="btn" type="submit">
            Add
          </button>
          {addNote && <span className="note">{addNote}</span>}
        </form>
        {alerts.length === 0 ? (
          <p className="note">No one has asked for a photo alert yet. Send the text or email from Brevo when the photos are ready.</p>
        ) : (
          <table className="studio-table">
            <thead>
              <tr>
                <th>When</th>
                <th>How</th>
                <th>Contact</th>
                <th>Page</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((alert) => (
                <tr key={alert.id}>
                  <td>{new Date(alert.createdAt).toLocaleString()}</td>
                  <td>{alert.channel}</td>
                  <td>{alert.contact}</td>
                  <td>{alert.page}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <h2 style={{ margin: "48px 0 12px" }}>Held dates</h2>
        {holds.length === 0 ? (
          <p className="note">Patricia and Skylar dates hold when a request is sent.</p>
        ) : (
          <ul className="duty-list">
            {holds.map((h) => (
              <li key={h.bookingId}>
                {getPhotographer(h.photographerId)?.name} · {h.date}
              </li>
            ))}
          </ul>
        )}

        <h2 style={{ margin: "48px 0 12px" }}>Hearts from unlocked albums</h2>
        {favorites.length === 0 ? (
          <p className="note">No hearts yet. Clients tap ♥ in their gallery; you print those.</p>
        ) : (
          <div className="album-grid">
            {favorites.map((f) => (
              <figure key={f.galleryId + f.src} className="photo">
                <img src={f.src} alt={f.alt} />
                <figcaption className="photo-credit">
                  <span className="photo-mark">
                    <em>{f.photographerId}</em>
                    <span>@truefamilyphotography</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        )}

        <h2 style={{ margin: "48px 0 12px" }}>Shop orders</h2>
        {orders.length === 0 ? (
          <p className="note">No shop orders yet.</p>
        ) : (
          <table className="studio-table">
            <thead>
              <tr>
                <th>When</th>
                <th>Who</th>
                <th>Items</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>{new Date(o.createdAt).toLocaleString()}</td>
                  <td>
                    {o.name}
                    <br />
                    {o.email}
                    <br />
                    {o.address}
                  </td>
                  <td>
                    {o.items.map((i) => `${i.qty}× ${i.name} (${i.variant})`).join(", ")}
                    {o.giftCodes.length ? ` · codes ${o.giftCodes.join(", ")}` : ""}
                    {o.note ? ` · ${o.note}` : ""}
                  </td>
                  <td>${o.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <h2 style={{ margin: "48px 0 12px" }}>Gift codes</h2>
        {gifts.length === 0 ? (
          <p className="note">Gift certificates minted at checkout land here.</p>
        ) : (
          <table className="studio-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>From / to</th>
                <th>Left</th>
              </tr>
            </thead>
            <tbody>
              {gifts.map((g) => (
                <tr key={g.code}>
                  <td>{g.code}</td>
                  <td>
                    {g.from} → {g.to}
                    <br />
                    {g.email}
                  </td>
                  <td>{g.remaining > 0 ? `$${g.remaining} open` : "redeemed"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <h2 style={{ margin: "48px 0 12px" }}>Portfolio drop</h2>
        <p className="note">Add Patricia or Skylar work without touching code. It shows on their page.</p>
        <label>
          Photographer
          <select
            id="lib-person"
            defaultValue="patricia"
            onChange={() => setTick((n) => n + 1)}
          >
            {photographers
              .filter((p) => p.kind === "photographer")
              .map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
          </select>
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={async (e) => {
            const who = (document.getElementById("lib-person") as HTMLSelectElement)?.value || "patricia";
            const files = [...(e.target.files ?? [])];
            for (const file of files) await addLibraryPhoto(who, file);
            setTick((n) => n + 1);
            e.currentTarget.value = "";
          }}
        />
        <div className="album-grid" style={{ marginTop: 16 }}>
          {listLibrary().map((p) => (
            <figure key={p.id} className="photo">
              <img src={p.src} alt={p.alt} />
              <figcaption className="photo-credit">
                <button type="button" className="btn ghost" onClick={() => { removeLibraryPhoto(p.id); setTick((n) => n + 1); }}>
                  Remove
                </button>
              </figcaption>
            </figure>
          ))}
        </div>

        <h2 style={{ margin: "48px 0 12px" }}>Phoenix’s wall</h2>
        <p className="note">Drop a photo into a polaroid. It shows on her page. Captions stay hers.</p>
        <div className="empty-wall" style={{ marginTop: 16 }}>
          {polaroids.map((slot) => {
            const cap = defaultPolaroids.find((d) => d.id === slot.id)?.caption ?? slot.caption;
            return (
              <figure key={slot.id} className="polaroid">
                {slot.src ? <img src={slot.src} alt={cap} /> : <div className="slot">empty</div>}
                <figcaption>{cap}</figcaption>
                <input type="file" accept="image/*" onChange={(e) => onPolaroid(slot.id, e.target.files?.[0])} />
                {slot.src && (
                  <button type="button" className="btn ghost" onClick={() => { clearPolaroid(slot.id); setTick((n) => n + 1); }}>
                    Clear
                  </button>
                )}
              </figure>
            );
          })}
        </div>

        <h2 style={{ margin: "48px 0 12px" }}>Gallery cards</h2>
        <div className="photographer-grid">
          {cards.map((g) => (
            <div key={g.id} style={{ background: "var(--paper)", padding: 16, border: "1px solid var(--rule)" }}>
              <p className="kicker">{g.person?.handle}</p>
              <h3>{g.title}</h3>
              <p className="success-code">{g.code}</p>
              <QrCard value={g.url} caption="Scan to open the paid album" />
              <button type="button" className="btn ghost" style={{ marginTop: 12 }} onClick={() => setPrintId(g.id)}>
                Print card
              </button>
            </div>
          ))}
        </div>

        {printing && printing.person && (
          <div className="print-sheet">
            <button type="button" className="btn ghost no-print" onClick={() => setPrintId(null)}>
              Close
            </button>
            <div className="print-card">
              <p className="kicker">True Family Photography</p>
              <h2>{printing.title}</h2>
              <p>{printing.person.credit}</p>
              <p className="success-code">{printing.code}</p>
              <QrCard value={printing.url} caption="Scan to open your album" />
              <p className="print-mark">{watermarkFor(printing.person)}</p>
              <button type="button" className="btn no-print" onClick={() => window.print()}>
                Print
              </button>
            </div>
          </div>
        )}

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
