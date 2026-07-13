# OPG Luk i strijela — website

A small, fast, mobile-first website for an OPG (obiteljsko poljoprivredno gospodarstvo /
family farm) built with [Astro](https://astro.build) and [Tailwind CSS](https://tailwindcss.com).

The whole site is driven by one JSON file and a folder of images. To turn this into a
site for a **different** OPG, you don't need to touch any component code — just swap
the data and the images (see below).

There is intentionally no cart or checkout anywhere on the site. With a small,
intermittently-available catalog, orders go through a simple contact form instead —
see "Future: online payment" below for what's already prepared for later.

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
  list all live here.
- `src/lib/data.ts` — typed accessor for the JSON above. Components import from here,
  never from the JSON file directly, and never hardcode farm-specific copy.
- `src/assets/products/` — one image per product, referenced by filename from the JSON
  (`"image": "garlic.svg"` → `src/assets/products/garlic.svg`).
- `src/assets/photos/` — general farm/field photos. Referenced two ways: by `opg.heroImages`
  (the rotating hero carousel) and by each product's `processImages` array (the supporting
  gallery on that product's detail page).
- `src/assets/logo/` — the farm's logo: `logo-mark-soil.png` (dark line-art version, used
  on light backgrounds like the header) and `logo-mark-parchment.png` (light version, for
  dark backgrounds like the About section and footer). `logo-original.png` is the full
  color source, kept for future re-edits.
- `src/components/` — Header, Hero, About, ProductGrid, ContactForm, Footer, etc. All of
  them read from `src/lib/data.ts`.
- `src/pages/index.astro` — the homepage, assembling the sections above in order:
  Hero → About → offer/"Ponuda" grid → contact form.
- `src/pages/products/[slug].astro` — a detail page generated automatically for every
  product in the JSON (via `getStaticPaths`), at `/products/<id>`. This is the emotional
  core of the site: a large product image, the `growingStory` narrative, a supporting
  photo gallery from `processImages`, price, and a link back to the order form.

### Hero carousel

`opg.heroImages` is an ordered list of filenames (from `src/assets/photos/`) shown as a
full-bleed background carousel behind the hero name/tagline/CTA. It rotates automatically
every 6 seconds and can also be advanced manually with the arrow buttons or the dots — a
manual interaction just restarts the auto-rotate timer rather than fighting it. Add,
remove, or reorder entries in that array to change what's shown; no component code needs
to change. Two of the current entries (`hero-placeholder-1.svg`, `hero-placeholder-2.svg`)
are illustrated placeholders — swap them out for real photos as they become available.

### Product fields

Each entry in the `products` array supports:

| Field           | Purpose                                                                 |
| --------------- | ------------------------------------------------------------------------ |
| `id`            | URL slug — also the product's detail page path, `/products/<id>`        |
| `name`, `price`, `unit`, `category`, `description` | shown on cards and the detail page |
| `image`         | filename in `src/assets/products/` — the main product photo             |
| `available`     | `true`/`false` — only available products show up in the "Ponuda" grid   |
| `growingStory`  | longer narrative text ("how it was planted/grown") for the detail page  |
| `processImages` | array of filenames in `src/assets/photos/` — feeds that product's supporting photo gallery on its detail page |
| `stripePriceId` | reserved for future online payment — leave as `null` (see below)        |

`opg.heroImages` (also an array of filenames in `src/assets/photos/`) is separate from the
per-product `processImages` — it drives the rotating hero carousel at the top of the
homepage. See "Hero carousel" below.

## Swapping in a new OPG

To re-skin this site for a different family farm:

1. **Edit the data file** — `src/data/luk-i-strijela.json`:
   - Update `opg` (name, tagline, story, location, deliveryArea, contact, social).
   - Replace the `products` array with the new farm's products, using the fields above.
     Set `available: false` on anything currently out of season — it'll disappear from
     the offer grid automatically but its detail page still exists if linked directly.
   - If you rename the JSON file itself, update the single `import` in `src/lib/data.ts`.

2. **Replace the images**, keeping the same filenames referenced in the JSON, or add
   new files and point the JSON fields at the new filenames:
   - `src/assets/products/*` — one photo per product (square photos work best; both the
     card and the detail page crop/contain to consistent shapes).
   - `src/assets/photos/*` — field/process photos. Add as many as you like and reference
     their filenames in `opg.heroImages` (hero carousel) and/or each product's
     `processImages` (detail-page gallery) — no component code needs to change.
   - `src/assets/logo/logo-mark-soil.png` / `logo-mark-parchment.png` — the header/footer
     logo marks. See the comment above about light vs. dark background versions.
   - `public/favicon.png` — the browser tab icon.

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

No other files need to change — every page reads through `src/lib/data.ts`.

## Future: online payment

Each product has a `stripePriceId` field, currently always `null`. This is a placeholder
for a future Stripe Checkout integration — no checkout flow is implemented yet. When
that's built, this field will hold the Stripe Price ID for each product.

## Deploying to Cloudflare

This project deploys as a Cloudflare **Worker** serving static assets (not a classic
"Pages" project), configured via `wrangler.jsonc` at the repo root.

1. Push this repository to GitHub.
2. In the Cloudflare dashboard, create a new app from that GitHub repo (**Workers & Pages
   → Create → Import a repository**).
3. Build settings:
   - **Build command:** `npm run build`
   - **Deploy command:** `npx wrangler deploy`
   - (Same for the non-production branch deploy command.)
4. Push to your connected branch and Cloudflare rebuilds and redeploys automatically.

`wrangler.jsonc` already defines the project name (`luk-i-strijela`) and static output
directory (`./dist`), so `wrangler deploy` needs no extra flags.

> **If you see `Authentication error [code: 10000]`** on deploy: this happens if the
> deploy command is set to `wrangler pages deploy` instead of `wrangler deploy` (i.e. the
> project got treated as a Pages project rather than a Workers one) — switch the deploy
> command as above and it resolves without needing any custom API token.

Alternatively, deploy directly from your machine:

```bash
npm run build
npx wrangler deploy
```
