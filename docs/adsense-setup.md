# AdSense Production Checklist

This project supports AdSense only on editorially reviewed tool pages. Real in-page ads need Google approval and ad unit slot IDs.

## Current Verified State

- Publisher ID: `pub-6696643120887220`
- Client ID: `ca-pub-6696643120887220`
- Converter domain `ads.txt`: `https://online-converter.evyatarhazan.com/ads.txt`
- Main evaluated domain `ads.txt`: `https://evyatarhazan.com/ads.txt`
- Cloudflare Pages production and preview currently have `PUBLIC_GOOGLE_ADSENSE_CLIENT` configured.
- Cloudflare Pages production and preview currently have manual slot variables configured.
- AdSense site approval is still waiting on Google review, so the HTML can render real AdSense slots before Google starts filling paid ads.

## Current Manual Ad Slots

These display ad units were created in AdSense for the `online-converter` manual placements:

```bash
PUBLIC_GOOGLE_ADSENSE_SLOT_TOP=3116545087
PUBLIC_GOOGLE_ADSENSE_SLOT_INLINE=7318111602
PUBLIC_GOOGLE_ADSENSE_SLOT_SIDEBAR=9458592152
PUBLIC_GOOGLE_ADSENSE_SLOT_BOTTOM=6038221894
```

Only the inline and bottom units are rendered by the current reviewed-tool layout. The top and sidebar IDs remain configured legacy units but must not be rendered on home or category navigation pages. Rendered units include `data-ad-real="true"` and the matching `data-ad-slot` values.

## Required In AdSense

1. Review `docs/adsense-approval-tracker.md` and close every pre-submission gate.
2. Confirm the site is approved in AdSense.
3. Confirm policy checks have no blocking issues.
4. Keep the inline and bottom display ad units active for reviewed tool pages only.
5. Keep home, category, policy, contact, analytics and error pages ad-free.
6. If a slot is replaced later, copy the new numeric `data-ad-slot` value into Cloudflare Pages and redeploy.

## Verification Commands

```bash
npm run adsense:readiness
npm run adsense:readiness:dist
curl -i https://online-converter.evyatarhazan.com/ads.txt
curl -i https://evyatarhazan.com/ads.txt
curl -s https://online-converter.evyatarhazan.com/en/json-to-csv/ | rg 'ca-pub-6696643120887220|data-ad-real'
```

`npm run adsense:readiness` builds with the public AdSense client and slot IDs, then scans the generated `dist` output. It fails if a reviewed tool page is missing AdSense, if any navigation/info/noindex page includes ads, if ownership and policy footer links disappear, if backlog routes are generated, if `ads.txt` is wrong, or if reviewed tool pages lose their content, FAQ, examples, editorial provenance or expected placement shape.

Use `npm run adsense:readiness:dist` only when the current `dist` artifact was already built with the AdSense environment variables.

If the AdSense dashboard still says the site is preparing immediately after these checks pass, wait for Google to recrawl. The dashboard can lag behind the live `ads.txt` state.
