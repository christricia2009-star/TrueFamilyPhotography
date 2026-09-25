import { get, list, put } from "@vercel/blob";

const STUDIO_PIN = "8288824";

type Signup = {
  channel?: string;
  contact?: string;
  consent?: string;
  page?: string;
};

type StoredSignup = {
  id: string;
  channel: "email" | "text";
  contact: string;
  page: string;
  createdAt: string;
};

function token() {
  return process.env.BLOB_READ_WRITE_TOKEN;
}

function clean(fields: Signup): StoredSignup | null {
  const channel = fields.channel === "text" ? "text" : "email";
  const raw = (fields.contact || "").trim();
  const contact = channel === "text" ? raw.replace(/\D/g, "").slice(-10) : raw.toLowerCase();
  if (channel === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)) return null;
  if (channel === "text" && contact.length !== 10) return null;
  const slug = channel === "text" ? contact : contact.replace(/[^a-z0-9._-]/g, "-");
  return {
    id: `${channel}-${slug}`,
    channel,
    contact,
    page: (fields.page || "").slice(0, 200),
    createdAt: new Date().toISOString(),
  };
}

function pathname(entry: StoredSignup) {
  return `alerts/${entry.id}.json`;
}

async function readEntry(path: string): Promise<StoredSignup | null> {
  const file = await get(path, {
    access: "private",
    token: token(),
    useCache: false,
    abortSignal: AbortSignal.timeout(4000),
  });
  if (!file?.stream) return null;
  return JSON.parse(await new Response(file.stream).text()) as StoredSignup;
}

export async function listSignups(): Promise<StoredSignup[]> {
  if (!token()) return [];
  const found = await list({
    prefix: "alerts/",
    token: token(),
    abortSignal: AbortSignal.timeout(4000),
  });
  const rows = await Promise.all(found.blobs.map((blob) => readEntry(blob.pathname).catch(() => null)));
  return rows
    .filter((row): row is StoredSignup => Boolean(row?.contact))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function deliverSignup(fields: Signup) {
  const entry = clean(fields);
  if (!entry || !token()) return { ok: false as const, reason: "failed" as const };
  const path = pathname(entry);
  const existing = await readEntry(path).catch(() => null);
  if (existing) return { ok: true as const, reason: "duplicate" as const };
  try {
    await put(path, JSON.stringify(entry), {
      access: "private",
      token: token(),
      addRandomSuffix: false,
      allowOverwrite: false,
      contentType: "application/json",
      cacheControlMaxAge: 60,
      abortSignal: AbortSignal.timeout(4000),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    if (/exist/i.test(message)) return { ok: true as const, reason: "duplicate" as const };
    return { ok: false as const, reason: "failed" as const };
  }
  return { ok: true as const, reason: "saved" as const };
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
    return Response.json({ ok: false, reason: "failed" }, { status: 502 });
  }
}
