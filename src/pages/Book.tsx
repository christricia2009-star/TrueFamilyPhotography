import { FormEvent, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { bookablePhotographers, getPhotographer, sessionsFor } from "../data/studio";
import { emailStudio } from "../lib/email";
import { findGift, isDateHeld, listHeldDates, redeemGift, saveBooking } from "../lib/storage";

export function Book() {
  const { id } = useParams();
  const preset = id ? getPhotographer(id) : undefined;
  const [photographerId, setPhotographerId] = useState(
    preset?.bookable ? preset.id : bookablePhotographers[0].id,
  );
  const [sessionType, setSessionType] = useState("");
  const [date, setDate] = useState("");
  const [giftCode, setGiftCode] = useState("");
  const [sent, setSent] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const person = getPhotographer(photographerId);
  const sessions = useMemo(() => (person ? sessionsFor(person) : []), [person]);
  const holdsDates = person?.id === "patricia" || person?.id === "skylar";
  const dateTaken = Boolean(person && date && isDateHeld(person.id, date));
  const held = person ? listHeldDates().filter((d) => d.photographerId === person.id) : [];
  const gift = giftCode ? findGift(giftCode) : undefined;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!person) return;
    if (dateTaken) {
      setError("That date is already held for this photographer. Pick another.");
      return;
    }
    if (giftCode && (!gift || gift.remaining <= 0)) {
      setError("That gift code is not open. Check the envelope.");
      return;
    }
    setBusy(true);
    const data = new FormData(e.currentTarget);
    if (gift && gift.remaining > 0) redeemGift(gift.code);
    const booking = saveBooking({
      photographerId: person.id,
      sessionType: String(data.get("sessionType") || sessions[0]?.id || ""),
      date: String(data.get("date") || ""),
      location: String(data.get("location") || ""),
      name: String(data.get("name") || ""),
      email: String(data.get("email") || ""),
      phone: String(data.get("phone") || ""),
      partySize: String(data.get("partySize") || ""),
      message: String(data.get("message") || ""),
      giftCode: gift?.code,
    });
    await emailStudio({
      _subject: `Booking · ${person.name} · ${booking.date}`,
      photographer: person.credit,
      session: booking.sessionType,
      date: booking.date,
      location: booking.location,
      name: booking.name,
      email: booking.email,
      phone: booking.phone,
      party: booking.partySize,
      gift: booking.giftCode || "none",
      message: booking.message,
    });
    setBusy(false);
    setSent(booking.id);
  }

  if (sent && person) {
    return (
      <section className="section" style={{ paddingTop: 140 }}>
        <div className="wrap confirm">
          <p className="kicker">Request received</p>
          <h1>We’ll write back.</h1>
          <p>
            {person.kind === "junior" ? "The family studio is on it, with Phoenix" : person.name} — and
            Chris just got the email. The date is held for Patricia and Skylar so nobody else can take
            that sunset.
          </p>
          <Link to={`/photographers/${person.id}`} className="btn" style={{ marginTop: 28 }}>
            Back to {person.handle}
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section" style={{ paddingTop: 140 }}>
      <div className="wrap">
        <div className="page-hero" style={{ paddingTop: 0 }}>
          <p className="kicker">Book</p>
          <h1>Pick a photographer.</h1>
          <p>
            Patricia for families and formals. Skylar for sports and cars. Phoenix for Little Lens
            adventures (parent along). Chris gets the email. He will not be the one holding the camera.
          </p>
        </div>

        <div className="picker">
          {bookablePhotographers.map((p) => (
            <button
              key={p.id}
              type="button"
              className={p.id === photographerId ? "is-on" : ""}
              onClick={() => {
                setPhotographerId(p.id);
                setSessionType("");
                setError("");
              }}
            >
              <span className="handle">{p.handle}</span>
              <strong style={{ display: "block", fontFamily: "var(--serif)", fontSize: "1.4rem" }}>{p.name}</strong>
              <span style={{ fontSize: "0.78rem", opacity: 0.7 }}>{p.role}</span>
            </button>
          ))}
        </div>

        {person && (
          <form className="form" onSubmit={onSubmit}>
            {person.bookingNote && <p className="note">{person.bookingNote}</p>}
            <label>
              Session
              <select
                name="sessionType"
                value={sessionType || sessions[0]?.id || ""}
                onChange={(e) => setSessionType(e.target.value)}
                required
              >
                {sessions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Preferred date
              <input
                type="date"
                name="date"
                required
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  setError("");
                }}
              />
            </label>
            {holdsDates && (
              <p className={dateTaken ? "error" : "note"}>
                {dateTaken
                  ? "That Saturday is taken. Patricia and Skylar hold dates so two families do not get the same light."
                  : held.length
                    ? `Already held: ${held.map((d) => d.date).join(", ")}`
                    : "Patricia and Skylar hold the date once you send this, so nobody else can book that sunset."}
              </p>
            )}
            <label>
              Where
              <input name="location" placeholder="City, park, field, backyard…" required />
            </label>
            <label>
              Your name
              <input name="name" required />
            </label>
            <label>
              Email
              <input type="email" name="email" required />
            </label>
            <label>
              Phone
              <input name="phone" />
            </label>
            <label>
              How many people
              <input name="partySize" placeholder="e.g. 5" />
            </label>
            <label>
              Gift certificate
              <input
                name="gift"
                placeholder="TFP-GIFT-————"
                value={giftCode}
                onChange={(e) => setGiftCode(e.target.value.toUpperCase())}
              />
            </label>
            {gift && gift.remaining > 0 && (
              <p className="note">Code is open · ${gift.remaining} · we will mark it redeemed with this request.</p>
            )}
            <label>
              Anything we should know
              <textarea name="message" placeholder="Kickoff time, ages, the dog’s name…" />
            </label>
            {error && <p className="error">{error}</p>}
            <button className="btn" type="submit" disabled={busy || dateTaken}>
              {busy ? "Sending…" : "Send to the studio"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
