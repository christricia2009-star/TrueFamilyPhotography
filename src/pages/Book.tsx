import { FormEvent, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { bookablePhotographers, getPhotographer, sessionsFor } from "../data/studio";
import { saveBooking } from "../lib/storage";

export function Book() {
  const { id } = useParams();
  const preset = id ? getPhotographer(id) : undefined;
  const [photographerId, setPhotographerId] = useState(
    preset?.bookable ? preset.id : bookablePhotographers[0].id,
  );
  const [sessionType, setSessionType] = useState("");
  const [sent, setSent] = useState<string | null>(null);

  const person = getPhotographer(photographerId);
  const sessions = useMemo(() => (person ? sessionsFor(person) : []), [person]);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (!person) return;
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
    });
    setSent(booking.id);
  }

  if (sent && person) {
    return (
      <section className="section" style={{ paddingTop: 140 }}>
        <div className="wrap confirm">
          <p className="kicker">Request received</p>
          <h1>We’ll write back.</h1>
          <p>
            {person.name} is on it — well, {person.kind === "junior" ? "the family studio is on it, with Phoenix" : person.name}{" "}
            and Chris will see the request on the family desk. You’ll hear from us at the email you left.
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
            adventures (parent along). Chris will see the request too — he just won’t be the one holding
            the camera.
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
              <input type="date" name="date" required />
            </label>
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
              Anything we should know
              <textarea name="message" placeholder="Kickoff time, ages, the dog’s name…" />
            </label>
            <button className="btn" type="submit">
              Send to the studio
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
