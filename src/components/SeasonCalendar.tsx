import { Link } from "react-router-dom";
import { isDateHeld } from "../lib/storage";
import { seasonGames } from "../data/studio";

export function SeasonCalendar() {
  return (
    <div className="season">
      <p className="kicker">The season</p>
      <h3>Friday nights Skylar can cover</h3>
      <ul>
        {seasonGames.map((g) => {
          const day = g.when.slice(0, 10);
          const held = isDateHeld("skylar", day);
          return (
            <li key={g.id} className={held ? "is-held" : ""}>
              <div>
                <strong>{g.home ? "Home" : "Away"} vs {g.opponent}</strong>
                <span>{new Date(g.when).toLocaleString(undefined, { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</span>
              </div>
              {held ? (
                <em>Held</em>
              ) : (
                <Link to={`/book/skylar?date=${day}&session=sports`} className="btn">
                  Hold this night
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
