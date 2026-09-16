import { comicPanels } from "../data/studio";

export function ComicStrip() {
  return (
    <section className="section tight">
      <div className="wrap">
        <p className="kicker">How a Little Lens adventure works</p>
        <h2>A parent always comes along.</h2>
        <div className="comic">
          {comicPanels.map((panel, i) => (
            <article key={panel.title} className="comic-panel">
              <span className="comic-num">{i + 1}</span>
              <h3>{panel.title}</h3>
              <p>{panel.line}</p>
              <small>{panel.stamp}</small>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
