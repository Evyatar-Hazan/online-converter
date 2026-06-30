# Analytics Dashboard

The site now has two analytics layers:

1. Runtime tracking through `src/components/Analytics.astro`.
2. Internal readiness dashboard at `/analytics/`.

The dashboard is intentionally `noindex,nofollow` and is not included in `sitemap.xml`.

## Providers

- `PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN`: enables Cloudflare Web Analytics beacon.
- `PUBLIC_PLAUSIBLE_DOMAIN`: optional Plausible event forwarding.
- `window.dataLayer`: always available as a privacy-safe local event queue.

## Events

The event taxonomy lives in `src/data/analytics-dashboard.ts`.

Events do not store raw converter input, raw output, or raw search text. They store safe metadata such as locale, category, slug, character counts, visible tool counts and ad placement names.

## Next production step

Add `PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN` to Cloudflare Pages production and preview environment variables once Cloudflare API/dashboard access is available.

## Operational use

- Treat `/analytics/` as an internal operations surface, not a public growth page.
- Use the stabilization section before shipping more converters:
  - tighten literal titles and descriptions
  - reduce thin-feeling page sections through stronger template depth
  - keep ad placements stable and non-disruptive
- Wait for real Search Console impressions before running CTR experiments or analytics-driven prioritization work.
- Use the weekly operations cadence in `/analytics/` together with the recurring Codex audit lane for ranking review, CTR watchlist review and production verification.
