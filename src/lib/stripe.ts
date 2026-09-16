import type { CartItem } from "./storage";

export async function startStripeCheckout(
  items: CartItem[],
  customer: { name: string; email: string; note?: string },
) {
  try {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items, customer, success: `${window.location.origin}/shop?paid=1` }),
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { url?: string };
    if (!data.url) return false;
    window.location.href = data.url;
    return true;
  } catch {
    return false;
  }
}
