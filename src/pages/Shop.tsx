import { FormEvent, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { formatMoney, shopProducts } from "../data/studio";
import { emailStudio } from "../lib/email";
import { startStripeCheckout } from "../lib/stripe";
import {
  addToCart,
  cartTotal,
  clearCart,
  getCart,
  saveGift,
  saveOrder,
  updateCartQty,
  type CartItem,
} from "../lib/storage";

export function Shop() {
  const [params] = useSearchParams();
  const [cart, setCart] = useState(getCart);
  const [done, setDone] = useState<{ orderId: string; gifts: string[] } | null>(
    params.get("paid") === "1" ? { orderId: "stripe", gifts: [] } : null,
  );
  const [payError, setPayError] = useState("");
  const total = useMemo(() => cart.reduce((n, i) => n + i.price * i.qty, 0), [cart]);

  function refresh() {
    setCart(getCart());
  }

  async function checkout(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const items = getCart();
    if (!items.length) return;
    const name = String(data.get("name") || "");
    const email = String(data.get("email") || "");
    const giftCodes: string[] = [];
    for (const item of items.filter((i) => i.productId === "gift")) {
      for (let n = 0; n < item.qty; n += 1) {
        const gift = saveGift({
          amount: item.price,
          from: name,
          to: String(data.get("giftTo") || name),
          email,
        });
        giftCodes.push(gift.code);
      }
    }
    const order = saveOrder({
      items,
      name,
      email,
      phone: String(data.get("phone") || ""),
      address: String(data.get("address") || ""),
      note: String(data.get("note") || ""),
      total: cartTotal(),
      giftCodes,
    });
    await emailStudio({
      _subject: `Shop order — ${name}`,
      name,
      email,
      phone: String(data.get("phone") || ""),
      total: formatMoney(order.total),
      items: items.map((i) => `${i.qty}× ${i.name} (${i.variant})`).join(", "),
      gifts: giftCodes.join(", "),
      note: String(data.get("note") || ""),
    });
    const striped = await startStripeCheckout(items, { name, email, note: String(data.get("note") || "") });
    if (striped) return;
    setPayError("Stripe is not live yet on this host — Chris has the order on the family desk.");
    clearCart();
    setDone({ orderId: order.id, gifts: giftCodes });
  }

  if (done) {
    return (
      <section className="section" style={{ paddingTop: 140 }}>
        <div className="wrap confirm">
          <p className="kicker">The shop</p>
          <h1>Chris has the order.</h1>
          <p>
            {payError ||
              "We have the order. If Stripe is connected, you were sent to pay. Prints ship after we confirm the frame from your gallery."}
          </p>
          {done.gifts.length > 0 && (
            <div className="note" style={{ marginTop: 18 }}>
              Gift codes (hand these over):
              {done.gifts.map((c) => (
                <div key={c} className="success-code">
                  {c}
                </div>
              ))}
            </div>
          )}
          <Link to="/shop" className="btn" style={{ marginTop: 24 }} onClick={() => setDone(null)}>
            Back to the shop
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section" style={{ paddingTop: 140 }}>
      <div className="wrap">
        <div className="page-hero" style={{ paddingTop: 0 }}>
          <p className="kicker">The shop</p>
          <h1>Prints, albums, and a code in an envelope.</h1>
          <p>
            Gift certificates become a booking. Prints come from an album you already unlocked. Tell us
            which hearts you tapped — Chris keeps that list.
          </p>
        </div>
        <div className="shop-grid">
          {shopProducts.map((p) => (
            <ProductCard key={p.id} product={p} onAdd={refresh} />
          ))}
        </div>

        <h2 style={{ margin: "56px 0 16px" }}>Cart</h2>
        {cart.length === 0 ? (
          <p className="note">Empty. The coloring set is eighteen dollars and very fridge-friendly.</p>
        ) : (
          <>
            <ul className="cart-list">
              {cart.map((item) => (
                <li key={item.productId + item.variant}>
                  <span>
                    {item.name} · {item.variant}
                  </span>
                  <span>{formatMoney(item.price * item.qty)}</span>
                  <input
                    type="number"
                    min={0}
                    value={item.qty}
                    onChange={(e) => {
                      updateCartQty(item.productId, item.variant, Number(e.target.value));
                      refresh();
                    }}
                  />
                </li>
              ))}
            </ul>
            <p style={{ margin: "12px 0 24px", fontFamily: "var(--serif)", fontSize: "1.8rem" }}>{formatMoney(total)}</p>
            <form className="form" onSubmit={checkout}>
              <label>
                Name
                <input name="name" required />
              </label>
              <label>
                Email
                <input type="email" name="email" required />
              </label>
              <label>
                Phone
                <input name="phone" />
              </label>
              <label>
                Shipping / where to send it
                <input name="address" />
              </label>
              {cart.some((c) => c.productId === "gift") && (
                <label>
                  Gift is for
                  <input name="giftTo" placeholder="Their name" />
                </label>
              )}
              <label>
                Which photos, if prints
                <textarea name="note" placeholder="Gallery name, hearts, sizes…" />
              </label>
              <button className="btn" type="submit">
                Place order with the studio
              </button>
            </form>
          </>
        )}
      </div>
    </section>
  );
}

function ProductCard({
  product,
  onAdd,
}: {
  product: (typeof shopProducts)[number];
  onAdd: () => void;
}) {
  const [variantId, setVariantId] = useState(product.variants[0].id);
  const variant = product.variants.find((v) => v.id === variantId) ?? product.variants[0];

  function add() {
    const item: Omit<CartItem, "qty"> = {
      productId: product.id,
      name: product.name,
      variant: variant.label,
      price: variant.price,
      image: product.image,
    };
    addToCart(item);
    onAdd();
  }

  return (
    <article className="product-card">
      <img src={product.image} alt="" />
      <div className="meta">
        <h3>{product.name}</h3>
        <p>{product.blurb}</p>
        <select value={variantId} onChange={(e) => setVariantId(e.target.value)}>
          {product.variants.map((v) => (
            <option key={v.id} value={v.id}>
              {v.label.includes("$") ? v.label : `${v.label} · ${formatMoney(v.price)}`}
            </option>
          ))}
        </select>
        <button type="button" className="btn" onClick={add}>
          Add · {formatMoney(variant.price)}
        </button>
      </div>
    </article>
  );
}
