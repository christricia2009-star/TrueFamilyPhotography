import { PointerEvent, useCallback, useEffect, useRef, useState } from "react";

const CRAYONS = [
  { hex: "#e23e6b", name: "Punch" },
  { hex: "#ff8fab", name: "Bubblegum" },
  { hex: "#ffb347", name: "Pop" },
  { hex: "#ffe08a", name: "Butter" },
  { hex: "#b5f2c0", name: "Grass" },
  { hex: "#1aa6c4", name: "Pool" },
  { hex: "#7ad7f0", name: "Ice" },
  { hex: "#c9b6ff", name: "Grape" },
  { hex: "#6b5748", name: "Mud" },
  { hex: "#1f1814", name: "Night" },
  { hex: "#fbf6ee", name: "Paper" },
  { hex: "#d4a574", name: "Honey" },
];

const SIZES = [
  { id: "skinny", n: 10, label: "skinny" },
  { id: "regular", n: 22, label: "regular" },
  { id: "chunky", n: 42, label: "chunky" },
] as const;

type Tool = "draw" | "fill" | "erase";
type Stroke = {
  color: string;
  size: number;
  erase: boolean;
  points: { x: number; y: number }[];
};
type Hist = { kind: "stroke" } | { kind: "fill"; prev: Record<string, string> };

const PAGES = [
  { id: "bug", title: "Look at the bug", hint: "He is not looking at the camera. Perfect." },
  { id: "dog", title: "The dog said yes", hint: "Very close. Slightly wet." },
  { id: "boots", title: "Yellow boots", hint: "Puddle optional. Splash not optional." },
  { id: "camera", title: "Camera in the clover", hint: "Phoenix’s, after snack." },
  { id: "horizon", title: "Tippy horizon", hint: "Grown-ups call this a mistake. Phoenix does not." },
];

export function ColoringStudio() {
  const [page, setPage] = useState(PAGES[0].id);
  const [color, setColor] = useState(CRAYONS[0].hex);
  const [tool, setTool] = useState<Tool>("draw");
  const [sizeId, setSizeId] = useState<(typeof SIZES)[number]["id"]>("regular");
  const [fills, setFills] = useState<Record<string, Record<string, string>>>({});
  const [strokes, setStrokes] = useState<Record<string, Stroke[]>>({});
  const [hist, setHist] = useState<Record<string, Hist[]>>({});
  const paper = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const drawing = useRef<Stroke | null>(null);
  const current = PAGES.find((p) => p.id === page)!;
  const crayon = CRAYONS.find((c) => c.hex === color) ?? CRAYONS[0];
  const size = SIZES.find((s) => s.id === sizeId) ?? SIZES[1];
  const map = fills[page] ?? {};

  const redraw = useCallback(() => {
    const cv = canvas.current;
    const box = paper.current;
    if (!cv || !box) return;
    const rect = box.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (rect.width < 8) return;
    cv.width = Math.round(rect.width * dpr);
    cv.height = Math.round(rect.height * dpr);
    cv.style.width = `${rect.width}px`;
    cv.style.height = `${rect.height}px`;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, cv.width, cv.height);
    for (const stroke of strokes[page] ?? []) drawStroke(ctx, stroke, cv.width, cv.height);
    if (drawing.current) drawStroke(ctx, drawing.current, cv.width, cv.height);
  }, [page, strokes]);

  useEffect(() => {
    redraw();
    const box = paper.current;
    if (!box) return;
    const ro = new ResizeObserver(() => redraw());
    ro.observe(box);
    return () => ro.disconnect();
  }, [redraw]);

  function paint(id: string) {
    if (tool !== "fill") return;
    const prev = { ...(fills[page] ?? {}) };
    setFills((s) => ({ ...s, [page]: { ...prev, [id]: color } }));
    setHist((s) => ({ ...s, [page]: [...(s[page] ?? []), { kind: "fill", prev }] }));
  }

  function fill(id: string, fallback = "#fffdf8") {
    return map[id] ?? fallback;
  }

  function pointFrom(e: PointerEvent<HTMLCanvasElement>) {
    const cv = canvas.current;
    if (!cv) return null;
    const r = cv.getBoundingClientRect();
    return { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height };
  }

  function onDown(e: PointerEvent<HTMLCanvasElement>) {
    if (tool === "fill") return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    const p = pointFrom(e);
    if (!p) return;
    drawing.current = {
      color,
      size: size.n,
      erase: tool === "erase",
      points: [p],
    };
    redraw();
  }

  function onMove(e: PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return;
    const p = pointFrom(e);
    if (!p) return;
    drawing.current.points.push(p);
    redraw();
  }

  function onUp() {
    const stroke = drawing.current;
    drawing.current = null;
    if (!stroke || stroke.points.length === 0) return;
    setStrokes((s) => ({ ...s, [page]: [...(s[page] ?? []), stroke] }));
    setHist((s) => ({ ...s, [page]: [...(s[page] ?? []), { kind: "stroke" }] }));
  }

  function undo() {
    const stack = hist[page] ?? [];
    const last = stack[stack.length - 1];
    if (!last) return;
    setHist((s) => ({ ...s, [page]: stack.slice(0, -1) }));
    if (last.kind === "stroke") {
      setStrokes((s) => ({ ...s, [page]: (s[page] ?? []).slice(0, -1) }));
    } else {
      setFills((s) => ({ ...s, [page]: last.prev }));
    }
  }

  function startOver() {
    setFills((s) => ({ ...s, [page]: {} }));
    setStrokes((s) => ({ ...s, [page]: [] }));
    setHist((s) => ({ ...s, [page]: [] }));
  }

  async function savePng() {
    const svg = paper.current?.querySelector("svg");
    const cv = canvas.current;
    if (!svg || !cv) return;
    const clone = svg.cloneNode(true) as SVGSVGElement;
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    const xml = new XMLSerializer().serializeToString(clone);
    const url = URL.createObjectURL(new Blob([xml], { type: "image/svg+xml;charset=utf-8" }));
    const img = new Image();
    img.src = url;
    await new Promise((res) => {
      img.onload = res;
    });
    const out = document.createElement("canvas");
    out.width = 1400;
    out.height = 1400;
    const ctx = out.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#fffdf8";
    ctx.fillRect(0, 0, 1400, 1400);
    ctx.drawImage(img, 0, 0, 1400, 1400);
    ctx.drawImage(cv, 0, 0, 1400, 1400);
    ctx.fillStyle = "rgba(31,24,20,0.6)";
    ctx.font = "italic 40px Georgia";
    ctx.textAlign = "right";
    ctx.fillText("phoenix@truefamilyphotography", 1360, 1360);
    const a = document.createElement("a");
    a.href = out.toDataURL("image/png");
    a.download = `phoenix-${page}.png`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function printPage() {
    document.body.classList.add("print-coloring");
    window.print();
    window.setTimeout(() => document.body.classList.remove("print-coloring"), 400);
  }

  const how =
    tool === "fill"
      ? "Dump: tap a shape. The whole puddle turns Punch. Or Grass. Your call."
      : tool === "erase"
        ? "Erase: scribble the oops away. Undo is there if you go too far."
        : "Scribble: pick a crayon and color like you would on paper. Stay in the lines. Or don’t.";

  return (
    <section className="section tight" id="coloring">
      <div className="wrap">
        <p className="kicker">Little Lens coloring studio</p>
        <h2>Color this. The horizon can be tippy.</h2>
        <ol className="coloring-how">
          <li>Pick a crayon.</li>
          <li>Scribble, or dump the bucket on a shape.</li>
          <li>Save it for the fridge.</li>
        </ol>
        <div className="page-tabs" role="tablist" aria-label="Coloring pages">
          {PAGES.map((p) => (
            <button
              key={p.id}
              type="button"
              role="tab"
              aria-selected={p.id === page}
              className={p.id === page ? "is-on" : ""}
              onClick={() => setPage(p.id)}
            >
              {p.title}
            </button>
          ))}
        </div>

        <div className="coloring-tools">
          <button type="button" className={tool === "draw" ? "is-on" : ""} onClick={() => setTool("draw")}>
            Scribble
          </button>
          <button type="button" className={tool === "fill" ? "is-on" : ""} onClick={() => setTool("fill")}>
            Dump
          </button>
          <button type="button" className={tool === "erase" ? "is-on" : ""} onClick={() => setTool("erase")}>
            Erase
          </button>
          <span className="tool-gap" />
          {SIZES.map((s) => (
            <button
              key={s.id}
              type="button"
              className={`size-btn ${sizeId === s.id ? "is-on" : ""}`}
              onClick={() => setSizeId(s.id)}
              aria-label={s.label}
            >
              <i style={{ width: 6 + s.n / 4, height: 6 + s.n / 4 }} />
              {s.label}
            </button>
          ))}
          <button type="button" onClick={undo} disabled={!(hist[page] ?? []).length}>
            Oops
          </button>
        </div>
        <p className="coloring-live">{how}</p>

        <div className="coloring-board">
          <div className="crayon-box" role="listbox" aria-label="Crayons">
            {CRAYONS.map((c) => (
              <button
                key={c.hex}
                type="button"
                className={`crayon-stick ${color === c.hex ? "is-on" : ""}`}
                style={{ background: c.hex, color: c.hex === "#fbf6ee" || c.hex === "#ffe08a" ? "#2b1d3a" : "#fff" }}
                aria-label={c.name}
                title={c.name}
                onClick={() => {
                  setColor(c.hex);
                  if (tool === "erase") setTool("draw");
                }}
              >
                <span>{c.name}</span>
              </button>
            ))}
          </div>
          <div className={`coloring-stage coloring-print tool-${tool}`}>
            <p className="using-crayon">
              Using <em style={{ color: crayon.hex }}>{crayon.name}</em>
              {tool === "fill" ? " · dump" : tool === "erase" ? " · eraser" : ` · ${size.label}`}
            </p>
            <div className="coloring-paper" ref={paper}>
              {page === "bug" && <BugPage fill={fill} paint={paint} />}
              {page === "dog" && <DogPage fill={fill} paint={paint} />}
              {page === "boots" && <BootsPage fill={fill} paint={paint} />}
              {page === "camera" && <CameraPage fill={fill} paint={paint} />}
              {page === "horizon" && <HorizonPage fill={fill} paint={paint} />}
              <canvas
                ref={canvas}
                className={`color-draw ${tool === "fill" ? "is-pass" : ""}`}
                onPointerDown={onDown}
                onPointerMove={onMove}
                onPointerUp={onUp}
                onPointerCancel={onUp}
              />
            </div>
            <p className="coloring-hint">{current.hint}</p>
            <p className="coloring-mark">phoenix@truefamilyphotography</p>
          </div>
        </div>
        <div className="coloring-actions">
          <button type="button" className="btn" style={{ background: "#e23e6b" }} onClick={savePng}>
            Save for the fridge
          </button>
          <button type="button" className="btn ghost" onClick={printPage}>
            Print just this page
          </button>
          <button type="button" className="btn ghost" onClick={startOver}>
            Start this page over
          </button>
        </div>
      </div>
    </section>
  );
}

function drawStroke(ctx: CanvasRenderingContext2D, stroke: Stroke, w: number, h: number) {
  const pts = stroke.points;
  if (!pts.length) return;
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = Math.max(4, stroke.size * (w / 420));
  if (stroke.erase) {
    ctx.globalCompositeOperation = "destination-out";
    ctx.strokeStyle = "#000";
    ctx.fillStyle = "#000";
  } else {
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = stroke.color;
    ctx.fillStyle = stroke.color;
    ctx.globalAlpha = 0.9;
  }
  if (pts.length === 1) {
    ctx.beginPath();
    ctx.arc(pts[0].x * w, pts[0].y * h, ctx.lineWidth / 2, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.moveTo(pts[0].x * w, pts[0].y * h);
    for (let i = 1; i < pts.length; i += 1) ctx.lineTo(pts[i].x * w, pts[i].y * h);
    ctx.stroke();
  }
  ctx.restore();
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
