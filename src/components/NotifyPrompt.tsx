import { FormEvent, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { STUDIO_EMAIL } from "../data/studio";
import { emailStudio } from "../lib/email";
import { NOTIFY_SEEN_KEY, saveNotifySignup } from "../lib/storage";

const SMS_CONSENT =
  "I agree to receive text messages from True Family Photography about new events and when photos are ready. Message and data rates may apply. Message frequency varies. Reply STOP to opt out and HELP for help. Consent is not a condition of any purchase.";

export function NotifyPrompt() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [channel, setChannel] = useState<"email" | "text">("email");
  const [contact, setContact] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (pathname.startsWith("/studio")) return;
    try {
      if (localStorage.getItem(NOTIFY_SEEN_KEY)) return;
    } catch {
      return;
    }
    const timer = window.setTimeout(() => setOpen(true), 700);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  function dismiss() {
    try {
      localStorage.setItem(NOTIFY_SEEN_KEY, "1");
    } catch {
      /* private mode */
    }
    setOpen(false);
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const value = contact.trim();
    if (channel === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError("Enter an email address.");
      return;
    }
    const digits = value.replace(/\D/g, "");
    if (channel === "text" && digits.length < 10) {
      setError("Enter a mobile number, including the area code.");
      return;
    }
    if (channel === "text" && !consent) {
      setError("Check the box to agree to text messages.");
      return;
    }
    setBusy(true);
    setError("");
    const sent = await emailStudio({
      _subject: "Photo alert signup",
      channel,
      contact: channel === "text" ? digits : value,
      consent: channel === "text" ? SMS_CONSENT : "Email alerts for new events and ready galleries.",
      page: pathname,
    });
    setBusy(false);
    if (!sent) {
      setError(`That didn’t send. Email ${STUDIO_EMAIL} and we’ll add you.`);
      return;
    }
    saveNotifySignup({
      channel,
      contact: channel === "text" ? digits : value,
      page: pathname,
    });
    try {
      localStorage.setItem(NOTIFY_SEEN_KEY, "1");
    } catch {
      /* still sent */
    }
    setDone(true);
  }

  if (!open) return null;

  return (
    <div className="notify-modal" role="dialog" aria-modal="true" aria-labelledby="notify-title">
      <form className="notify-card" onSubmit={onSubmit}>
        <p className="kicker">Friday nights</p>
        <h2 id="notify-title">Pictures go up after the game.</h2>
        {done ? (
          <>
            <p>You’re on the list. We’ll reach out when a new event is ready.</p>
            <button type="button" className="btn" onClick={() => setOpen(false)}>
              Close
            </button>
          </>
        ) : (
          <>
            <p>
              If you scanned the code at the field, the gallery may still be empty. Leave an email or a
              mobile number and we’ll tell you when the photos are up.
            </p>
            <div className="notify-choice" role="group" aria-label="How should we reach you">
              <button
                type="button"
                className={channel === "email" ? "is-on" : ""}
                onClick={() => {
                  setChannel("email");
                  setError("");
                }}
              >
                Email
              </button>
              <button
                type="button"
                className={channel === "text" ? "is-on" : ""}
                onClick={() => {
                  setChannel("text");
                  setError("");
                }}
              >
                Text
              </button>
            </div>
            <label>
              {channel === "email" ? "Email" : "Mobile number"}
              <input
                name="contact"
                type={channel === "email" ? "email" : "tel"}
                inputMode={channel === "email" ? "email" : "tel"}
                autoComplete={channel === "email" ? "email" : "tel"}
                placeholder={channel === "email" ? "you@email.com" : "(480) 555-0100"}
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                required
              />
            </label>
            {channel === "text" ? (
              <label className="agree">
                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
                <span>{SMS_CONSENT}</span>
              </label>
            ) : (
              <p className="note">We’ll email you when a new event or gallery is ready.</p>
            )}
            {error && <p className="error">{error}</p>}
            <div className="notify-actions">
              <button className="btn" type="submit" disabled={busy}>
                {busy ? "Sending…" : "Remind me"}
              </button>
              <button type="button" className="btn ghost" onClick={dismiss}>
                Not now
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
