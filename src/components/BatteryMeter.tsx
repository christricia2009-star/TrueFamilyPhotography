function levelForToday() {
  const month = new Date().getMonth();
  const busy = month === 8 || month === 9 || month === 10;
  const weekend = [0, 6].includes(new Date().getDay());
  if (busy && weekend) return 1;
  if (busy) return 2;
  if (weekend) return 3;
  return 4;
}

export function BatteryMeter() {
  const filled = levelForToday();
  const cells = [0, 1, 2, 3, 4, 5];
  return (
    <div className="battery-wrap">
      <p className="kicker">Equipment check</p>
      <h3>The batteries, as of this minute</h3>
      <div className="battery" aria-label={`${filled} of 6 charged`}>
        {cells.map((i) => (
          <span key={i} className={`cell ${i < filled ? "is-full" : ""}`} />
        ))}
      </div>
      <p className="chris-aside" style={{ marginTop: 14 }}>
        {filled <= 2
          ? "Busy season. He charged them anyway."
          : "Not empty. He will still charge them. That is the job."}
      </p>
    </div>
  );
}
