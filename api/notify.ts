import { STUDIO_EMAIL } from "../src/data/studio";

type Signup = {
  channel?: string;
  contact?: string;
  consent?: string;
  page?: string;
};

export async function deliverSignup(fields: Signup) {
  const channel = fields.channel === "text" ? "text" : "email";
  const contact = (fields.contact || "").trim();
  const res = await fetch(`https://formsubmit.co/ajax/${STUDIO_EMAIL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Referer: "https://www.truefamilyphotography.com/",
    },
    body: JSON.stringify({
      email: channel === "email" ? contact : STUDIO_EMAIL,
      _replyto: channel === "email" ? contact : undefined,
      _subject: "Photo alert signup",
      _captcha: "false",
      _template: "table",
      channel,
      contact,
      consent: fields.consent || "",
      page: fields.page || "",
    }),
  });
  const data = (await res.json().catch(() => ({}))) as { success?: string; message?: string };
  return { ok: res.ok && String(data.success) === "true", message: data.message || "" };
}

export default async function handler(req: Request) {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  try {
    const body = (await req.json()) as Signup;
    const result = await deliverSignup(body);
    return Response.json(result, { status: result.ok ? 200 : 502 });
  } catch {
    return Response.json({ ok: false }, { status: 502 });
  }
}
