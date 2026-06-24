# Online Converter

A bilingual SEO-first converter hub built with Astro and React islands. The site generates static pages for English and Hebrew, while each converter runs locally in the browser for speed and privacy.

## Features

- 66 converter tools across data formats, text, encoding, dates, colors, calculators and developer utilities.
- Static SEO pages for every tool and category in English and Hebrew.
- Browser-only conversion: pasted input is not uploaded to a server.
- Canonical URLs, hreflang, OpenGraph, JSON-LD, FAQ schema, sitemap and robots.txt.
- Optional privacy-friendly analytics through Cloudflare Web Analytics or Plausible.
- Google AdSense script, manual ad slots and generated `ads.txt` support.
- Vitest unit tests and Playwright browser tests.

## Tech Stack

- Astro static site generation
- React for the interactive converter widget
- TypeScript
- YAML parser via `yaml`
- Playwright and Vitest

## Development

```bash
npm install
npm run dev
```

Local preview:

```bash
npm run build
npm run preview
```

## Analytics

Analytics is optional and disabled unless environment variables are provided.

```bash
PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN=your_cloudflare_token
PUBLIC_PLAUSIBLE_DOMAIN=online-converter.evyatarhazan.com
```

Cloudflare Web Analytics tracks page views. Plausible also receives converter events such as `convert_tool`, `convert_error`, `copy_output` and `download_output`.

## Google AdSense

AdSense is optional and disabled unless a real AdSense client ID is provided.

```bash
PUBLIC_GOOGLE_ADSENSE_CLIENT=ca-pub-6696643120887220
PUBLIC_GOOGLE_ADSENSE_SLOT_TOP=1234567890
PUBLIC_GOOGLE_ADSENSE_SLOT_INLINE=1234567890
PUBLIC_GOOGLE_ADSENSE_SLOT_SIDEBAR=1234567890
PUBLIC_GOOGLE_ADSENSE_SLOT_BOTTOM=1234567890
```

When `PUBLIC_GOOGLE_ADSENSE_CLIENT` is set, the AdSense script loads in the site layout and `/ads.txt` is generated from that client ID. Manual ad placements render only when both the client ID and the matching slot ID are configured. Google will serve real ads only after the domain is approved in AdSense. See `docs/adsense-setup.md` for the production checklist.

## Production Deployment

Production is handled by Cloudflare Pages Git integration.

- Site: `https://online-converter.evyatarhazan.com/`
- Cloudflare Pages project: `online-converter`
- Production branch: `main`
- Build command: `npm run build`
- Output directory: `dist`

Every push to `main` triggers a Cloudflare Pages deployment.

## Quality Checks

```bash
npm run build
npm run lint
npm run test
npm run test:e2e
npm audit --omit=dev
npm run smoke:prod
```

## Adding a Converter

1. Add the converter function in `src/lib/converter-functions.ts`.
2. Register the tool metadata in `src/data/converters.ts` with English and Hebrew title, description, keywords, examples, FAQ and related tools.
3. Add or extend unit tests in `src/lib/converter-functions.test.ts`.
4. Run `npm run test` to verify registry, SEO and converter behavior.
5. Run `npm run build` and `npm run test:e2e` before pushing.

The next SEO-focused converter ideas are tracked in `docs/next-converters.md`.
