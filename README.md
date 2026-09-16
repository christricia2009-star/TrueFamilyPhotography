# True Family Photography

Family studio site for Patricia, Skylar, Phoenix, and Chris.

- Patricia and Skylar: photographer pages with real work
- Phoenix (age 8): Little Lens page — coloring studio, field notebook, comic, polaroid wall
- Chris: studio / gear / website — battery meter, not a photographer
- Client galleries unlock with a code or QR; hearts and slideshow once open
- Shop: prints, albums, gift certificates; Stripe checkout when `STRIPE_SECRET_KEY` is set
- Booking: session agreement, year-of-the-family, date holds, gift redeem
- Galleries: cinematic reveal, wall preview, album download, Phoenix coloring from a frame
- Skylar season calendar; Chris “this week at the studio”
- Family desk: portfolio drop (no code), polaroids, hearts, orders, printable cards

Deploy on Vercel. Copy `.env.example` and set `STRIPE_SECRET_KEY` for live payments.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Sample gallery codes

| Album | Code |
| --- | --- |
| The Hale Family | `TFP-HALE-2026` |
| Aria · Formals | `TFP-ARIA-2026` |
| Friday Night | `TFP-FRIDAY-3310` |

Family desk pin: `8288824`

Watermark on every photograph: `patricia@truefamilyphotography`, `skylar@truefamilyphotography`, and so on.
