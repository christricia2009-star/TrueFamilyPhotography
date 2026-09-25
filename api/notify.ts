const STUDIO_EMAIL = "truefamilyphotography@gmail.com";
const STUDIO_PIN = "8288824";

type Signup = {
  channel?: string;
  contact?: string;
  consent?: string;
  page?: string;
};

type StoredSignup = {
  _id?: string;
  channel: "email" | "text";
  contact: string;
  page: string;
  createdAt: string;
};

function storeUrl() {
  return process.env.SIGNUP_STORE || "";
}

function clean(fields: Signup): StoredSignup | null {
  const channel = fields.channel === "text" ? "text" : "email";
  const contact = (fields.contact || "").trim();
  if (channel === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)) return null;
  if (channel === "text" && contact.replace(/\D/g, "").length < 10) return null;
  return {
    channel,
    contact: channel === "text" ? contact.replace(/\D/g, "") : contact,
    page: (fields.page || "").slice(0, 200),
    createdAt: new Date().toISOString(),
  };
}

function fetchWithin(url: string, init: RequestInit, ms: number) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  return fetch(url, { ...init, signal: ctrl.signal }).finally(() => clearTimeout(timer));
}

function mailStudio(entry: StoredSignup) {
  return fetchWithin(
    `https://formsubmit.co/ajax/${STUDIO_EMAIL}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Referer: "https://www.truefamilyphotography.com/",
      },
      body: JSON.stringify({
        email: entry.channel === "email" ? entry.contact : STUDIO_EMAIL,
        _replyto: entry.channel === "email" ? entry.contact : undefined,
        _subject: "Photo alert signup",
        _captcha: "false",
        _template: "table",
        channel: entry.channel,
        contact: entry.contact,
        page: entry.page,
      }),
    },
    2500,
  );
}

function sameContact(row: StoredSignup, entry: StoredSignup) {
  if (entry.channel === "text") {
    const a = row.contact.replace(/\D/g, "").slice(-10);
    const b = entry.contact.replace(/\D/g, "").slice(-10);
    return a.length === 10 && a === b;
  }
  return row.contact.trim().toLowerCase() === entry.contact.trim().toLowerCase();
}

export async function deliverSignup(fields: Signup) {
  const entry = clean(fields);
  const url = storeUrl();
  if (!entry || !url) return { ok: false as const, reason: "failed" as const };
  try {
    const existing = await listSignups();
    if (existing.some((row) => sameContact(row, entry))) {
      return { ok: true as const, reason: "duplicate" as const };
    }
  } catch {
    /* a slow list should not block a new signup */
  }
  try {
    const saved = await fetchWithin(
      url,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(entry),
      },
      4000,
    );
    if (!saved.ok) return { ok: false as const, reason: "failed" as const };
  } catch {
    return { ok: false as const, reason: "failed" as const };
  }
  void mailStudio(entry).catch(() => {});
  return { ok: true as const, reason: "saved" as const };
}

export async function listSignups(): Promise<StoredSignup[]> {
  const url = storeUrl();
  if (!url) return [];
  const res = await fetchWithin(url, { headers: { Accept: "application/json" } }, 4000);
  if (!res.ok) return [];
  const data = (await res.json()) as StoredSignup[];
  if (!Array.isArray(data)) return [];
  return data
    .map((row) => ({
      id: row._id || row.createdAt,
      channel: row.channel,
      contact: row.contact,
      page: row.page,
      createdAt: row.createdAt,
    }))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export default async function handler(req: Request) {
  try {
    if (req.method === "GET") {
      if (req.headers.get("x-studio-pin") !== STUDIO_PIN) {
        return Response.json({ error: "unauthorized" }, { status: 401 });
      }
      return Response.json(await listSignups(), { headers: { "Cache-Control": "no-store" } });
    }
    if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
    const body = (await req.json()) as Signup;
    const result = await deliverSignup(body);
    return Response.json(result, { status: result.ok ? 200 : 502 });
  } catch {
    return Response.json({ ok: false }, { status: 502 });
  }
}
