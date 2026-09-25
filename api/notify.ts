const STUDIO_PIN = "8288824";
const BREVO = "https://api.brevo.com/v3";

type Signup = {
  channel?: string;
  contact?: string;
  page?: string;
};

type StoredSignup = {
  id: string;
  channel: "email" | "text";
  contact: string;
  page: string;
  createdAt: string;
};

function apiKey() {
  return process.env.BREVO_API_KEY || "";
}

function listId() {
  const raw = process.env.BREVO_LIST_ID || "";
  const id = Number(raw);
  return Number.isFinite(id) && id > 0 ? id : 0;
}

function clean(fields: Signup): { channel: "email" | "text"; contact: string; page: string } | null {
  const channel = fields.channel === "text" ? "text" : "email";
  const raw = (fields.contact || "").trim();
  if (channel === "email") {
    const contact = raw.toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)) return null;
    return { channel, contact, page: (fields.page || "").slice(0, 200) };
  }
  const digits = raw.replace(/\D/g, "");
  const contact = digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
  if (contact.length !== 10) return null;
  return { channel, contact, page: (fields.page || "").slice(0, 200) };
}

function sms(contact: string) {
  return `+1${contact}`;
}

async function brevo(path: string, init: RequestInit = {}) {
  return fetch(`${BREVO}${path}`, {
    ...init,
    headers: {
      "api-key": apiKey(),
      Accept: "application/json",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...(init.headers || {}),
    },
    signal: AbortSignal.timeout(6000),
  });
}

export async function deliverSignup(fields: Signup) {
  const entry = clean(fields);
  if (!entry || !apiKey() || !listId()) return { ok: false as const, reason: "failed" as const };
  const body =
    entry.channel === "email"
      ? { email: entry.contact, listIds: [listId()], updateEnabled: false }
      : { attributes: { SMS: sms(entry.contact) }, listIds: [listId()], updateEnabled: false };
  const res = await brevo("/contacts", { method: "POST", body: JSON.stringify(body) });
  if (res.status === 400) {
    const data = (await res.json().catch(() => ({}))) as { code?: string };
    if (data.code === "duplicate_parameter") return { ok: true as const, reason: "duplicate" as const };
  }
  if (!res.ok && res.status !== 201 && res.status !== 204) {
    return { ok: false as const, reason: "failed" as const };
  }
  return { ok: true as const, reason: "saved" as const };
}

export async function listSignups(): Promise<StoredSignup[]> {
  if (!apiKey() || !listId()) return [];
  const rows: StoredSignup[] = [];
  for (let offset = 0; offset < 500; offset += 50) {
    const res = await brevo(`/contacts/lists/${listId()}/contacts?limit=50&offset=${offset}`);
    if (!res.ok) break;
    const data = (await res.json()) as {
      contacts?: { email?: string; attributes?: { SMS?: string }; createdAt?: string; id?: number }[];
    };
    const contacts = data.contacts || [];
    for (const contact of contacts) {
      const phone = contact.attributes?.SMS?.replace(/\D/g, "") || "";
      if (contact.email) {
        rows.push({
          id: `email-${contact.id || contact.email}`,
          channel: "email",
          contact: contact.email,
          page: "",
          createdAt: contact.createdAt || "",
        });
      }
      if (phone) {
        rows.push({
          id: `text-${contact.id || phone}`,
          channel: "text",
          contact: phone,
          page: "",
          createdAt: contact.createdAt || "",
        });
      }
    }
    if (contacts.length < 50) break;
  }
  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function GET(req: Request) {
  try {
    if (req.headers.get("x-studio-pin") !== STUDIO_PIN) {
      return Response.json({ error: "unauthorized" }, { status: 401 });
    }
    return Response.json(await listSignups(), { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "unavailable" }, { status: 502 });
  }
}

export async function POST(req: Request) {
  try {
    const result = await deliverSignup((await req.json()) as Signup);
    return Response.json(result, { status: result.ok ? 200 : 502 });
  } catch {
    return Response.json({ ok: false, reason: "failed" }, { status: 502 });
  }
}
