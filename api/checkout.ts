type Body = {
  items: { name: string; variant: string; price: number; qty: number }[];
  customer: { name: string; email: string; note?: string };
  success: string;
};

export async function POST(req: Request) {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return Response.json({ error: "Stripe is not configured. Set STRIPE_SECRET_KEY." }, { status: 501 });
  }
  const body = (await req.json()) as Body;
  const params = new URLSearchParams();
  params.set("mode", "payment");
  params.set("success_url", body.success);
  params.set("cancel_url", body.success.replace("paid=1", "canceled=1"));
  params.set("customer_email", body.customer.email);
  body.items.forEach((item, i) => {
    params.set(`line_items[${i}][quantity]`, String(item.qty));
    params.set(`line_items[${i}][price_data][currency]`, "usd");
    params.set(`line_items[${i}][price_data][unit_amount]`, String(Math.round(item.price * 100)));
    params.set(`line_items[${i}][price_data][product_data][name]`, `${item.name} · ${item.variant}`);
  });
  const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });
  const data = (await res.json()) as { url?: string; error?: { message: string } };
  if (!res.ok) return Response.json({ error: data.error?.message || "Stripe error" }, { status: 400 });
  return Response.json({ url: data.url });
}
