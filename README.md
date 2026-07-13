# OPG Luk i strijela — website

A small, fast, mobile-first website for an OPG (obiteljsko poljoprivredno gospodarstvo /
family farm) built with [Astro](https://astro.build) and [Tailwind CSS](https://tailwindcss.com).

The whole site is driven by one JSON file and a folder of images. To turn this into a
site for a **different** OPG, you don't need to touch any component code — just swap
the data and the images (see below).

## Running the dev server

Requires Node 18+.

```bash
npm install
npm run dev
```

The site is served at `http://localhost:4321`.

Other scripts:

```bash
npm run build     # production build to ./dist
npm run preview   # serve the production build locally
npm run astro check   # type-check the project
```

## How the site is structured

- `src/data/luk-i-strijela.json` — **the single source of truth.** Farm name, tagline,
  story, location, delivery area, contact details, social links, and the full product
  list (name, price, unit, category, description, image filename) all live here.
- `src/lib/data.ts` — typed accessor for the JSON above. Components import from here,
  never from the JSON file directly, and never hardcode farm-specific copy.
- `src/assets/products/` — one image per product, referenced by filename from the JSON
  (`"image": "onion.svg"` → `src/assets/products/onion.svg`).
- `src/assets/photos/` — larger photos used in the hero and "About" sections.
- `src/assets/logo/logo.png` — the farm's logo, shown in the header.
- `src/components/` — Header, Hero, ProductGrid, About, ContactForm, Footer, etc. All
  of them read from `src/lib/data.ts`.

## Swapping in a new OPG

To re-skin this site for a different family farm:

1. **Edit the data file** — `src/data/luk-i-strijela.json`:
   - Update `opg` (name, tagline, story, location, deliveryArea, contact, social).
   - Replace the `products` array with the new farm's products. Each product needs:
     `id`, `name`, `price`, `unit`, `category`, `image` (a filename you'll add to
     `src/assets/products/`), `description`, and `stripePriceId` (leave as `null` —
     see "Future: online payment" below).
   - If you rename the JSON file itself, update the single `import` in `src/lib/data.ts`.

2. **Replace the images**, keeping the same filenames referenced in the JSON, or add
   new files and point `image` at the new filenames:
   - `src/assets/products/*` — product photos (square photos work best; the card crops
     to a 1:1 ratio).
   - `src/assets/photos/*` — hero background and About section photo. Update the two
     `import` lines in `src/components/Hero.astro` and `src/components/About.astro` if
     you use different filenames.
   - `src/assets/logo/logo.png` — the header logo. Any reasonably-sized image works;
     it's displayed in a small rounded square (`Header.astro`).
   - `public/favicon.svg` — the browser tab icon.

   Images placed under `src/assets/` are automatically optimized, resized, and
   lazy-loaded by Astro's `<Image>` component — you don't need to compress them
   yourself first.

3. **Set up the order form** — the contact form in `src/components/ContactForm.astro`
   posts to [Web3Forms](https://web3forms.com), a free form-to-email service with no
   backend required:
   - Go to https://web3forms.com and create an access key with the new farm's email.
   - Replace `WEB3FORMS_ACCESS_KEY` at the top of `src/components/ContactForm.astro`
     with the real key.

4. **Colors and fonts** live in `tailwind.config.mjs` (the `soil` / `parchment` /
   `field` / `onion-skin` / `arrow` / `sprout` palette) and are loaded as self-hosted
   `@fontsource` packages in `src/styles/global.css`. Change these if the new farm's
   branding differs — everything in the components references the named tokens, not
   hardcoded hex values.

No other files need to change — every page section reads through `src/lib/data.ts`.

## Future: online payment

Each product has a `stripePriceId` field, currently always `null`. This is a placeholder
for a future Stripe Checkout integration — no checkout flow is implemented yet. When
that's built, this field will hold the Stripe Price ID for each product.

## Deploying to Cloudflare Pages

1. Push this repository to GitHub (or GitLab).
2. In the Cloudflare dashboard, go to **Workers & Pages → Create → Pages → Connect to Git**
   and select the repository.
3. Use these build settings:
   - **Framework preset:** Astro
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Deploy. Cloudflare will rebuild automatically on every push to the connected branch.

Alternatively, deploy directly from the CLI with
[Wrangler](https://developers.cloudflare.com/pages/get-started/direct-upload/):

```bash
npm run build
npx wrangler pages deploy dist
```
