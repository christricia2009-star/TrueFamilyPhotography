const COUNTER = "https://abacus.jasoncameron.dev";
const NAMESPACE = "truefamilyphotography";
const KEY = "visitors";

function hasVisitorCookie(header: string | null) {
  return /(?:^|;\s*)tfp_vid=/.test(header || "");
}

export default async function handler(req: Request) {
  if (req.method !== "GET") return new Response("Method not allowed", { status: 405 });
  const url = new URL(req.url);
  const remembered = hasVisitorCookie(req.headers.get("cookie")) || url.searchParams.get("seen") === "1";
  const endpoint = remembered
    ? `${COUNTER}/get/${NAMESPACE}/${KEY}`
    : `${COUNTER}/hit/${NAMESPACE}/${KEY}`;
  const res = await fetch(endpoint, { headers: { Accept: "application/json" } });
  if (!res.ok) return Response.json({ error: "unavailable" }, { status: 502 });
  const data = (await res.json()) as { value?: number };
  const headers = new Headers({
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
  });
  if (!hasVisitorCookie(req.headers.get("cookie"))) {
    const secure = (req.headers.get("x-forwarded-proto") || url.protocol).includes("https");
    headers.append(
      "Set-Cookie",
      `tfp_vid=${crypto.randomUUID()}; Path=/; Max-Age=31536000; SameSite=Lax${secure ? "; Secure" : ""}`,
    );
  }
  return Response.json({ count: typeof data.value === "number" ? data.value : null }, { headers });
}
