import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { nextKickoff } from "../data/studio";

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return {
    d: Math.floor(s / 86400),
    h: Math.floor((s % 86400) / 3600),
    m: Math.floor((s % 3600) / 60),
    sec: s % 60,
  };
}

export function KickoffCountdown() {
  const target = new Date(nextKickoff.when).getTime();
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const left = parts(target - now);
  const live = target - now <= 0;

  return (
    <div className="kickoff">
      <p className="kicker">{nextKickoff.title}</p>
      <h3>{live ? "Lights are on." : `Until ${nextKickoff.team} kickoff`}</h3>
      {!live && (
        <div className="ticks">
          <span>
            <strong>{left.d}</strong> days
          </span>
          <span>
            <strong>{left.h}</strong> hrs
          </span>
          <span>
            <strong>{left.m}</strong> min
          </span>
          <span>
            <strong>{left.sec}</strong> sec
          </span>
        </div>
      )}
      <p>{nextKickoff.blurb}</p>
      <Link to="/book?session=sports" className="btn" style={{ marginTop: 16 }}>
        Book the night
      </Link>
    </div>
  );
}
