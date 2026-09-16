import { useRef, useState } from "react";

const CRAYONS = [
  "#e23e6b",
  "#ff8fab",
  "#ffb347",
  "#ffe08a",
  "#b5f2c0",
  "#1aa6c4",
  "#7ad7f0",
  "#c9b6ff",
  "#6b5748",
  "#1f1814",
  "#fbf6ee",
  "#d4a574",
];

type Page = {
  id: string;
  title: string;
  hint: string;
};

const PAGES: Page[] = [
  { id: "bug", title: "Look at the bug", hint: "He is not looking at the camera. Perfect." },
  { id: "dog", title: "The dog said yes", hint: "Very close. Slightly wet." },
  { id: "boots", title: "Yellow boots", hint: "Puddle optional. Splash not optional." },
  { id: "camera", title: "Camera in the clover", hint: "Phoenix’s, after snack." },
  { id: "horizon", title: "Tippy horizon", hint: "Grown-ups call this a mistake. Phoenix does not." },
];

export function ColoringStudio() {
  const [page, setPage] = useState(PAGES[0].id);
  const [color, setColor] = useState(CRAYONS[0]);
  const [fills, setFills] = useState<Record<string, Record<string, string>>>({});
  const stage = useRef<HTMLDivElement>(null);
  const current = PAGES.find((p) => p.id === page)!;
  const map = fills[page] ?? {};

  function paint(id: string) {
    setFills((prev) => ({
      ...prev,
      [page]: { ...(prev[page] ?? {}), [id]: color },
    }));
  }

  function fill(id: string, fallback = "#fffdf8") {
    return map[id] ?? fallback;
  }

  async function savePng() {
    const svg = stage.current?.querySelector("svg");
    if (!svg) return;
    const clone = svg.cloneNode(true) as SVGSVGElement;
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    const xml = new XMLSerializer().serializeToString(clone);
    const blob = new Blob([xml], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.src = url;
    await new Promise((res) => {
      img.onload = res;
    });
    const canvas = document.createElement("canvas");
    canvas.width = 1400;
    canvas.height = 1400;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#fffdf8";
    ctx.fillRect(0, 0, 1400, 1400);
    ctx.drawImage(img, 0, 0, 1400, 1400);
    ctx.fillStyle = "rgba(31,24,20,0.55)";
    ctx.font = "italic 42px Georgia";
    ctx.textAlign = "right";
    ctx.fillText("phoenix@truefamilyphotography", 1360, 1360);
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `phoenix-${page}.png`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="section tight" id="coloring">
      <div className="wrap">
        <p className="kicker">Little Lens coloring studio</p>
        <h2>Color this. The horizon can be tippy.</h2>
        <p className="coloring-lead">
          Click a crayon, then click a shape. Print it for the fridge. Every page is marked
          phoenix@truefamilyphotography — same as the real pictures, someday.
        </p>
        <div className="page-tabs">
          {PAGES.map((p) => (
            <button key={p.id} className={p.id === page ? "is-on" : ""} type="button" onClick={() => setPage(p.id)}>
              {p.title}
            </button>
          ))}
        </div>
        <div className="coloring-board">
          <div className="crayon-box" role="listbox" aria-label="Crayons">
            {CRAYONS.map((c) => (
              <button
                key={c}
                type="button"
                className={`crayon ${color === c ? "is-on" : ""}`}
                style={{ background: c }}
                aria-label={c}
                onClick={() => setColor(c)}
              />
            ))}
          </div>
          <div className="coloring-stage" ref={stage}>
            {page === "bug" && <BugPage fill={fill} paint={paint} />}
            {page === "dog" && <DogPage fill={fill} paint={paint} />}
            {page === "boots" && <BootsPage fill={fill} paint={paint} />}
            {page === "camera" && <CameraPage fill={fill} paint={paint} />}
            {page === "horizon" && <HorizonPage fill={fill} paint={paint} />}
            <p className="coloring-hint">{current.hint}</p>
            <p className="coloring-mark">phoenix@truefamilyphotography</p>
          </div>
        </div>
        <div className="coloring-actions">
          <button type="button" className="btn" style={{ background: "#e23e6b" }} onClick={savePng}>
            Save for the fridge
          </button>
          <button type="button" className="btn ghost" onClick={() => window.print()}>
            Print
          </button>
          <button
            type="button"
            className="btn ghost"
            onClick={() => setFills((prev) => ({ ...prev, [page]: {} }))}
          >
            Start over
          </button>
        </div>
      </div>
    </section>
  );
}

type PaintProps = {
  fill: (id: string, fallback?: string) => string;
  paint: (id: string) => void;
};

function BugPage({ fill, paint }: PaintProps) {
  return (
    <svg viewBox="0 0 400 400" className="color-svg">
      <rect width="400" height="400" fill={fill("sky", "#eef9ff")} onClick={() => paint("sky")} />
      <ellipse cx="200" cy="310" rx="170" ry="50" fill={fill("ground", "#d8f3d4")} onClick={() => paint("ground")} />
      <path d="M40 240 C120 80, 280 80, 360 240" fill={fill("leaf", "#8fd18a")} stroke="#1f1814" strokeWidth="3" onClick={() => paint("leaf")} />
      <ellipse cx="210" cy="200" rx="48" ry="32" fill={fill("wing1", "#fff")} stroke="#1f1814" strokeWidth="3" onClick={() => paint("wing1")} />
      <ellipse cx="250" cy="210" rx="40" ry="26" fill={fill("wing2", "#fff")} stroke="#1f1814" strokeWidth="3" onClick={() => paint("wing2")} />
      <ellipse cx="188" cy="214" rx="22" ry="14" fill={fill("body", "#1f1814")} onClick={() => paint("body")} />
      <circle cx="168" cy="210" r="8" fill={fill("head", "#1f1814")} onClick={() => paint("head")} />
      <path d="M162 204 L150 188 M166 202 L158 184" stroke="#1f1814" strokeWidth="2" fill="none" />
    </svg>
  );
}

function DogPage({ fill, paint }: PaintProps) {
  return (
    <svg viewBox="0 0 400 400" className="color-svg">
      <rect width="400" height="400" fill={fill("bg", "#f7efe4")} onClick={() => paint("bg")} />
      <ellipse cx="200" cy="230" rx="130" ry="110" fill={fill("fur", "#e0b07a")} stroke="#1f1814" strokeWidth="3" onClick={() => paint("fur")} />
      <ellipse cx="200" cy="268" rx="48" ry="36" fill={fill("nose", "#3a2a24")} stroke="#1f1814" strokeWidth="3" onClick={() => paint("nose")} />
      <circle cx="148" cy="188" r="18" fill={fill("eye", "#1f1814")} onClick={() => paint("eye")} />
      <circle cx="252" cy="188" r="18" fill={fill("eye")} onClick={() => paint("eye")} />
      <circle cx="154" cy="182" r="6" fill="#fff" />
      <circle cx="258" cy="182" r="6" fill="#fff" />
      <path d="M70 150 Q90 40 160 120" fill={fill("ear", "#c48a58")} stroke="#1f1814" strokeWidth="3" onClick={() => paint("ear")} />
      <path d="M330 150 Q310 40 240 120" fill={fill("ear")} stroke="#1f1814" strokeWidth="3" onClick={() => paint("ear")} />
    </svg>
  );
}

function BootsPage({ fill, paint }: PaintProps) {
  return (
    <svg viewBox="0 0 400 400" className="color-svg">
      <rect width="400" height="220" fill={fill("sky", "#d9f0ff")} onClick={() => paint("sky")} />
      <rect y="220" width="400" height="180" fill={fill("path", "#cbb79a")} onClick={() => paint("path")} />
      <ellipse cx="200" cy="250" rx="140" ry="36" fill={fill("puddle", "#7ec8e3")} stroke="#1f1814" strokeWidth="3" onClick={() => paint("puddle")} />
      <path d="M120 180 h50 v90 l-20 40 h-50 l-10-40 z" fill={fill("boot", "#ffe08a")} stroke="#1f1814" strokeWidth="3" onClick={() => paint("boot")} />
      <path d="M230 180 h50 v90 l-20 40 h-50 l-10-40 z" fill={fill("boot")} stroke="#1f1814" strokeWidth="3" onClick={() => paint("boot")} />
      <path d="M40 80 Q80 40 120 90" fill={fill("cloud", "#fff")} stroke="#1f1814" strokeWidth="2" onClick={() => paint("cloud")} />
    </svg>
  );
}

function CameraPage({ fill, paint }: PaintProps) {
  return (
    <svg viewBox="0 0 400 400" className="color-svg">
      <rect width="400" height="400" fill={fill("grass", "#cfe8b7")} onClick={() => paint("grass")} />
      <circle cx="70" cy="300" r="18" fill={fill("flower", "#ff8fab")} stroke="#1f1814" strokeWidth="2" onClick={() => paint("flower")} />
      <circle cx="320" cy="90" r="22" fill={fill("flower2", "#ffe08a")} stroke="#1f1814" strokeWidth="2" onClick={() => paint("flower2")} />
      <rect x="90" y="140" width="220" height="140" rx="18" fill={fill("body", "#f3e6d0")} stroke="#1f1814" strokeWidth="3" onClick={() => paint("body")} />
      <circle cx="200" cy="210" r="48" fill={fill("lens", "#7ad7f0")} stroke="#1f1814" strokeWidth="3" onClick={() => paint("lens")} />
      <circle cx="200" cy="210" r="22" fill={fill("glass", "#1aa6c4")} onClick={() => paint("glass")} />
      <rect x="120" y="118" width="70" height="24" fill={fill("flash", "#1f1814")} onClick={() => paint("flash")} />
      <path d="M70 250 Q40 200 90 170" fill="none" stroke={fill("strap", "#e23e6b")} strokeWidth="10" onClick={() => paint("strap")} />
    </svg>
  );
}

function HorizonPage({ fill, paint }: PaintProps) {
  return (
    <svg viewBox="0 0 400 400" className="color-svg">
      <rect width="400" height="400" fill={fill("sky", "#fbd9a5")} onClick={() => paint("sky")} />
      <circle cx="280" cy="90" r="36" fill={fill("sun", "#ffb347")} onClick={() => paint("sun")} />
      <path d="M0 250 L80 210 L160 270 L260 180 L400 250 L400 400 L0 400 Z" fill={fill("hill", "#8fbf7a")} stroke="#1f1814" strokeWidth="3" onClick={() => paint("hill")} />
      <path d="M0 310 L400 250 L400 400 L0 400 Z" fill={fill("field", "#c4a574")} stroke="#1f1814" strokeWidth="3" onClick={() => paint("field")} />
    </svg>
  );
}
