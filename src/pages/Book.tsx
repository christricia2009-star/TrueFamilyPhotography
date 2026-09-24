import { FormEvent, useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { agreementBody, agreementTitle } from "../data/agreement";
import { bookablePhotographers, getPhotographer, LIABILITY_NOTE, sessionCatalog } from "../data/studio";
import { emailStudio } from "../lib/email";
import { findGift, isDateHeld, listHeldDates, redeemGift, saveBooking } from "../lib/storage";

export function Book() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const preset = id ? getPhotographer(id) : undefined;
  const [photographerId, setPhotographerId] = useState(
    preset?.bookable && preset.kind === "photographer" ? preset.id : "",
  );
  const [sessionType, setSessionType] = useState(
    params.get("session") || (preset?.kind === "junior" ? "adventure" : ""),
  );
  const [date, setDate] = useState(params.get("date") || "");
  const [agreed, setAgreed] = useState(false);
  const [showLegal, setShowLegal] = useState(false);
  const [giftCode, setGiftCode] = useState("");
  const [sent, setSent] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const person = photographerId ? getPhotographer(photographerId) : undefined;
  const sessions = sessionCatalog;
  const dateTaken = Boolean(date && isDateHeld("studio", date));
  const held = listHeldDates();
  const gift = giftCode ? findGift(giftCode) : undefined;
  const year = (sessionType || sessions[0]?.id) === "year";

  useEffect(() => {
    const d = params.get("date");
    const s = params.get("session");
    if (d) setDate(d);
    if (s) setSessionType(s);
  }, [params]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (dateTaken) {
      setError("That date is already held. Pick another.");
      return;
    }
    if (giftCode && (!gift || gift.remaining <= 0)) {
      setError("That gift code is not open. Check the envelope.");
      return;
    }
    if (!agreed) {
      setError("The session agreement has to be checked. It is how the studio stays a real business.");
      return;
    }
    setBusy(true);
    const data = new FormData(e.currentTarget);
    if (gift && gift.remaining > 0) redeemGift(gift.code);
    const booking = saveBooking({
      photographerId: person?.id || "studio",
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
      _subject: `Booking · ${booking.sessionType} · ${booking.date}`,
      photographer: person?.credit || "studio",
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

  if (sent) {
    return (
      <section className="section" style={{ paddingTop: 140 }}>
        <div className="wrap confirm">
          <p className="kicker">Request received</p>
          <h1>We’ll write back.</h1>
          <p>
            The studio has the request. The date is held so another session does not take that same light.
          </p>
          <Link to="/" className="btn" style={{ marginTop: 28 }}>
            Back to the photographs
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
          <h1>Book a session.</h1>
          <p>
            Families, football, formals, cars, newborns — the studio photographs all of it. A preferred
            name is optional. The session is not locked to one person.
          </p>
          <p>{LIABILITY_NOTE}</p>
        </div>

        <form className="form" onSubmit={onSubmit}>
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
              Photographer, if you have a preference
              <select
                name="photographer"
                value={photographerId}
                onChange={(e) => setPhotographerId(e.target.value)}
              >
                <option value="">No preference</option>
                {bookablePhotographers
                  .filter((p) => p.kind === "photographer")
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
              </select>
            </label>
            {(sessionType || sessions[0]?.id) === "adventure" && (
              <p className="note">
                Little Lens adventures are 30–45 minutes, with a parent photographer along. Phoenix is eight.
                The booking still goes through the studio.
              </p>
            )}
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
            <p className={dateTaken ? "error" : "note"}>
              {dateTaken
                ? "That date is already held. Pick another so two sessions do not share the same light."
                : held.length
                  ? `Already held: ${held.map((d) => d.date).join(", ")}`
                  : "The studio holds the date once you send this, so nobody else can book that day."}
            </p>
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
            {year && (
              <p className="note">
                Year of the family: tell us spring, first day of school, and a birthday in the note. The studio
                keeps the year, not just the Saturday.
              </p>
            )}
            <label className="agree">
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
              <span>
                I agree to the{" "}
                <button type="button" className="text-link" onClick={() => setShowLegal(true)}>
                  session agreement
                </button>{" "}
                with True Family Photography.
              </span>
            </label>
            {error && <p className="error">{error}</p>}
            <button className="btn" type="submit" disabled={busy || dateTaken || !agreed}>
              {busy ? "Sending…" : "Send to the studio"}
            </button>
            {showLegal && (
              <div className="legal-box">
                <h3>{agreementTitle}</h3>
                <p style={{ whiteSpace: "pre-wrap" }}>{agreementBody}</p>
                <button type="button" className="btn ghost" onClick={() => setShowLegal(false)}>
                  Close
                </button>
              </div>
            )}
          </form>
      </div>
    </section>
  );
}
