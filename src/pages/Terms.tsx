import { Link } from "react-router-dom";
import { LIABILITY_NOTE, SERVICE_AREA, STUDIO_EMAIL, STUDIO_NAME } from "../data/studio";

export function Terms() {
  return (
    <section className="section" style={{ paddingTop: 140 }}>
      <div className="wrap legal-page">
        <div className="page-hero" style={{ paddingTop: 0 }}>
          <p className="kicker">{STUDIO_NAME}</p>
          <h1>Terms</h1>
          <p>Effective September 25, 2026.</p>
        </div>

        <h2>The business</h2>
        <p>
          These terms are between you and {STUDIO_NAME}. The studio photographs families, weddings, formals,
          sports, cars, and the other sessions shown on this site. {SERVICE_AREA} Support is{" "}
          <a href={`mailto:${STUDIO_EMAIL}`}>{STUDIO_EMAIL}</a>.
        </p>

        <h2>Sessions and galleries</h2>
        <p>
          A booking request holds a date while we confirm it. It is not a finished contract until the studio
          writes back and you agree to the session. Client galleries open with an access code. Public pages
          show watermarked previews. The code unlocks the clean files for that gallery. {LIABILITY_NOTE}
        </p>

        <h2>The shop</h2>
        <p>
          Shop prices are in US dollars and are charged by Stripe at checkout. A gift card is a code for the
          studio. It is not a cash balance at a bank.
        </p>

        <h2>Photo alerts</h2>
        <p>
          {STUDIO_NAME} sends email and text alerts about new events and when photographs are ready. You join
          by entering an email address or a mobile number on this site. Texts also require the consent box.
          The message says a gallery or event is available. It is not the gallery itself.
        </p>
        <dl className="legal-facts">
          <div>
            <dt>Business</dt>
            <dd>
              {STUDIO_NAME}. {SERVICE_AREA} Support is{" "}
              <a href={`mailto:${STUDIO_EMAIL}`}>{STUDIO_EMAIL}</a>.
            </dd>
          </div>
          <div>
            <dt>Product</dt>
            <dd>Text messages about new photography events and when a photo gallery is ready.</dd>
          </div>
          <div>
            <dt>Frequency</dt>
            <dd>
              Message frequency varies. You may receive a message when you join, and later messages when a new
              event is added or a gallery is ready. There is no fixed daily or weekly schedule.
            </dd>
          </div>
          <div>
            <dt>Rates</dt>
            <dd>
              Message and data rates may apply. Your carrier’s rates for texts and data are your own.{" "}
              {STUDIO_NAME} does not charge for the alert. Consent to texts is not a condition of any purchase
              or booking.
            </dd>
          </div>
          <div>
            <dt>Support</dt>
            <dd>
              Reply HELP for help, or email <a href={`mailto:${STUDIO_EMAIL}`}>{STUDIO_EMAIL}</a>.
            </dd>
          </div>
          <div>
            <dt>Stop</dt>
            <dd>
              Reply STOP to cancel text alerts. You will receive one confirmation that you have been
              unsubscribed. Email <a href={`mailto:${STUDIO_EMAIL}`}>{STUDIO_EMAIL}</a> to leave the email
              list.
            </dd>
          </div>
        </dl>
        <p>
          Alerts are sent with the help of Brevo. Carriers are not liable for delayed or undelivered messages.
          Our <Link to="/privacy">privacy page</Link> explains what we keep.
        </p>

        <h2>The photographs</h2>
        <p>
          The studio keeps the copyright in the photographs. A client may use the delivered images for
          personal display and sharing. The studio may show watermarked previews of its work on this site.
        </p>

        <h2>Contact</h2>
        <p>
          {STUDIO_NAME}
          <br />
          <a href={`mailto:${STUDIO_EMAIL}`}>{STUDIO_EMAIL}</a>
        </p>
      </div>
    </section>
  );
}
