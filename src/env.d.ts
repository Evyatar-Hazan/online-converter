/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN?: string;
  readonly PUBLIC_PLAUSIBLE_DOMAIN?: string;
  readonly PUBLIC_GOOGLE_ADSENSE_CLIENT?: string;
  readonly PUBLIC_GOOGLE_ADSENSE_SLOT_TOP?: string;
  readonly PUBLIC_GOOGLE_ADSENSE_SLOT_INLINE?: string;
  readonly PUBLIC_GOOGLE_ADSENSE_SLOT_SIDEBAR?: string;
  readonly PUBLIC_GOOGLE_ADSENSE_SLOT_BOTTOM?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
