import { Link } from "react-router-dom";
import { SERVICE_AREA, STUDIO_EMAIL, STUDIO_NAME } from "../data/studio";

export function Privacy() {
  return (
    <section className="section" style={{ paddingTop: 140 }}>
      <div className="wrap legal-page">
        <div className="page-hero" style={{ paddingTop: 0 }}>
          <p className="kicker">{STUDIO_NAME}</p>
          <h1>Privacy</h1>
          <p>Effective September 25, 2026. {SERVICE_AREA}</p>
        </div>

        <h2>Who we are</h2>
        <p>
          {STUDIO_NAME} is the business that photographs families, weddings, formals, sports, and the other
          sessions on this site. Questions about your information go to{" "}
          <a href={`mailto:${STUDIO_EMAIL}`}>{STUDIO_EMAIL}</a>.
        </p>

        <h2>What we collect</h2>
        <p>
          If you book a session, we keep the name, email, phone number, date, and note you send. If you join
          photo alerts, we keep the email address or mobile number you enter, and whether you asked for email
          or text. If you buy from the shop, Stripe processes the payment. We do not store your card number.
          If you open a client gallery, we keep the access code you use on that browser. We also count a
          browser once so the visitor total at the bottom of the site is not inflated by repeat visits.
        </p>

        <h2>How we use it</h2>
        <p>
          We use this information to schedule sessions, deliver photographs, run the shop, and tell you when a
          new event or gallery is ready if you asked us to. We do not sell your information.
        </p>

        <h2>Photo alerts</h2>
        <p>
          Email alerts go to the address you give us. Text alerts go to the mobile number you give us. Message
          frequency varies. Message and data rates may apply. You can stop texts by replying STOP, and get
          help by replying HELP or emailing {STUDIO_EMAIL}. The program is described in our{" "}
          <Link to="/terms">terms</Link>.
        </p>

        <h2>Who else handles it</h2>
        <p>
          Stripe handles shop checkout. Brevo holds the photo-alert list so we can send the email or text when
          the pictures are ready. Those companies process the information only to provide that service.
        </p>

        <h2>How long we keep it</h2>
        <p>
          We keep booking details and gallery records for as long as the studio needs them to deliver the work
          and answer questions about it. We remove a photo-alert contact when you opt out or ask us to.
        </p>

        <h2>Your choices</h2>
        <p>
          Email {STUDIO_EMAIL} to ask what we have, to correct it, or to be removed from photo alerts. For
          texts, reply STOP. Reply HELP for help.
        </p>
      </div>
    </section>
  );
}
