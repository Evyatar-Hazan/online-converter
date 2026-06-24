# AdSense Production Checklist

This project already supports AdSense, but real in-page ads need both Google approval and ad unit slot IDs.

## Current Verified State

- Publisher ID: `pub-6696643120887220`
- Client ID: `ca-pub-6696643120887220`
- Converter domain `ads.txt`: `https://online-converter.evyatarhazan.com/ads.txt`
- Main evaluated domain `ads.txt`: `https://evyatarhazan.com/ads.txt`
- Cloudflare Pages production currently has `PUBLIC_GOOGLE_ADSENSE_CLIENT` configured.
- Cloudflare Pages production does not yet have manual slot variables configured.

## Required For Real Manual Ad Slots

Create or copy AdSense display ad unit slot IDs, then configure these Cloudflare Pages production and preview environment variables:

```bash
PUBLIC_GOOGLE_ADSENSE_SLOT_TOP=1234567890
PUBLIC_GOOGLE_ADSENSE_SLOT_INLINE=1234567890
PUBLIC_GOOGLE_ADSENSE_SLOT_SIDEBAR=1234567890
PUBLIC_GOOGLE_ADSENSE_SLOT_BOTTOM=1234567890
```

After setting them, trigger a new Cloudflare Pages deployment. The rendered ad slots should change from `data-ad-real="false"` to `data-ad-real="true"`.

## Required In AdSense

1. Confirm the site is approved in AdSense.
2. Confirm policy checks have no blocking issues.
3. Create display ad units or enable Auto ads.
4. If using manual slots, copy each numeric `data-ad-slot` value into Cloudflare Pages.

## Verification Commands

```bash
curl -i https://online-converter.evyatarhazan.com/ads.txt
curl -i https://evyatarhazan.com/ads.txt
curl -s https://online-converter.evyatarhazan.com/en/ | rg 'ca-pub-6696643120887220|data-ad-real'
```

If the AdSense dashboard still says the site is preparing immediately after these checks pass, wait for Google to recrawl. The dashboard can lag behind the live `ads.txt` state.
