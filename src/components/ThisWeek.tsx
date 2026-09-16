import { Link } from "react-router-dom";
import { nextKickoff } from "../data/studio";
import { listBookings, listHeldDates, listOrders } from "../lib/storage";

export function ThisWeek() {
  const holds = listHeldDates().length;
  const books = listBookings().length;
  const orders = listOrders().length;
  const kick = new Date(nextKickoff.when);
  const soon = kick.getTime() - Date.now() < 1000 * 60 * 60 * 24 * 8;

  return (
    <section className="this-week">
      <div className="wrap">
        <p className="kicker">This week at the studio</p>
        <h2>Chris’s desk, in public.</h2>
        <div className="week-grid">
          <article>
            <strong>{holds}</strong>
            <span>dates held</span>
          </article>
          <article>
            <strong>{books}</strong>
            <span>booking requests</span>
          </article>
          <article>
            <strong>{orders}</strong>
            <span>shop orders in the queue</span>
          </article>
          <article>
            <strong>{soon ? "Lights" : "Prep"}</strong>
            <span>{soon ? `${nextKickoff.team} this week` : "Batteries charged anyway"}</span>
          </article>
        </div>
        <p className="week-note">
          Galleries go out when Chris says they go out.{" "}
          <Link to="/studio">Family desk</Link> · <Link to="/galleries">Open yours</Link>
        </p>
      </div>
    </section>
  );
}
