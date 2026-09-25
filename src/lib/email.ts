import { STUDIO_EMAIL } from "../data/studio";

export async function emailStudio(fields: Record<string, string>) {
  try {
    const res = await fetch(`https://formsubmit.co/ajax/${STUDIO_EMAIL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        _captcha: "false",
        _template: "table",
        ...fields,
      }),
    });
    const data = (await res.json().catch(() => ({}))) as { success?: string };
    return res.ok && String(data.success) === "true";
  } catch {
    return false;
  }
}

export function mailtoStudio(subject: string, body: string) {
  return `mailto:${STUDIO_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
