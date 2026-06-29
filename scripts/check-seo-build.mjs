import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { JSDOM } from 'jsdom';

const siteUrl = 'https://online-converter.evyatarhazan.com';
const distDir = join(process.cwd(), 'dist');

const fail = (message) => {
  throw new Error(`SEO build check failed: ${message}`);
};

const readDistFile = (path) => readFileSync(join(distDir, path), 'utf8');

const htmlPathFor = (pathname) => {
  const cleanPath = pathname.replace(/^\/+/, '').replace(/\/$/, '');
  return cleanPath ? join(cleanPath, 'index.html') : 'index.html';
};

const getDocument = (pathname) => new JSDOM(readDistFile(htmlPathFor(pathname))).window.document;

const walkDistFiles = (directory = '') => {
  const root = join(distDir, directory);
  const entries = readdirSync(root, { withFileTypes: true });

  return entries.flatMap((entry) => {
    const nested = directory ? join(directory, entry.name) : entry.name;
    if (entry.isDirectory()) {
      return walkDistFiles(nested);
    }

    return [nested];
  });
};

const countLocalizedHtmlPages = () => {
  const countIndexFiles = (directory) => {
    const entries = readdirSync(join(distDir, directory), { withFileTypes: true });

    return entries.reduce((total, entry) => {
      if (entry.isDirectory()) {
        const nested = join(directory, entry.name);
        return total + (readDistFile(join(nested, 'index.html')) ? 1 : 0);
      }

      return total;
    }, 1);
  };

  return countIndexFiles('en') + countIndexFiles('he');
};

const getAttribute = (document, selector, attribute) => {
  const element = document.querySelector(selector);

  if (!element) {
    fail(`Missing ${selector}`);
  }

  return element.getAttribute(attribute);
};

const normalizePublicPath = (pathname) => {
  if (!pathname || pathname === '/') {
    return '/';
  }

  if (/\.[a-z0-9]+$/i.test(pathname)) {
    return pathname;
  }

  return pathname.endsWith('/') ? pathname : `${pathname}/`;
};

const toPublicPath = (relativeFile) => {
  if (relativeFile === 'index.html') {
    return '/';
  }

  if (relativeFile.endsWith('/index.html')) {
    return `/${relativeFile.slice(0, -'index.html'.length)}`;
  }

  return `/${relativeFile}`;
};

const resolvableInternalHref = (href) => {
  if (!href) return null;
  if (href.startsWith('#')) return null;
  if (/^(mailto:|tel:|javascript:)/i.test(href)) return null;

  const url = new URL(href, `${siteUrl}/`);
  if (url.origin !== siteUrl) {
    return null;
  }

  return normalizePublicPath(url.pathname);
};

const assertNoBrokenInternalLinks = () => {
  const distFiles = walkDistFiles();
  const publicTargets = new Set(
    distFiles.map((file) => normalizePublicPath(toPublicPath(file)))
  );
  const htmlFiles = distFiles.filter((file) => file.endsWith('.html'));
  const brokenLinks = [];

  for (const htmlFile of htmlFiles) {
    const sourcePath = normalizePublicPath(toPublicPath(htmlFile));
    const document = new JSDOM(readDistFile(htmlFile)).window.document;
    const anchors = [...document.querySelectorAll('a[href]')];

    for (const anchor of anchors) {
      const href = anchor.getAttribute('href');
      if (!href) continue;

      const resolved = resolvableInternalHref(href.startsWith('/') ? href : new URL(href, `${siteUrl}${sourcePath}`).pathname);
      if (!resolved) continue;

      if (!publicTargets.has(resolved)) {
        brokenLinks.push(`${sourcePath} -> ${href} (resolved to ${resolved})`);
      }
    }
  }

  if (brokenLinks.length > 0) {
    fail(`Broken internal links found:\n${brokenLinks.join('\n')}`);
  }
};

const assertEqual = (actual, expected, label) => {
  if (actual !== expected) {
    fail(`${label}: expected "${expected}", received "${actual}"`);
  }
};

const sitemap = readDistFile('sitemap.xml');
const robots = readDistFile('robots.txt');

const publicPaths = [
  '/en/',
  '/he/',
  '/en/data/',
  '/he/text/',
  '/en/json-to-csv/',
  '/he/json-to-csv/',
  '/en/sort-lines/',
  '/he/sort-lines/'
];

const expectedAlternates = (pathname) => {
  const [, locale, slug = ''] = pathname.split('/');
  const alternateSlug = slug ? `${slug}/` : '';

  return {
    en: `${siteUrl}/en/${alternateSlug}`,
    he: `${siteUrl}/he/${alternateSlug}`,
    default: `${siteUrl}/en/${alternateSlug}`,
    dir: locale === 'he' ? 'rtl' : 'ltr'
  };
};

for (const pathname of publicPaths) {
  const document = getDocument(pathname);
  const canonical = `${siteUrl}${pathname}`;
  const alternates = expectedAlternates(pathname);

  assertEqual(document.documentElement.lang, pathname.startsWith('/he/') ? 'he' : 'en', `${pathname} html lang`);
  assertEqual(document.documentElement.dir, alternates.dir, `${pathname} html dir`);
  assertEqual(getAttribute(document, 'meta[name="robots"]', 'content'), 'index, follow, max-image-preview:large', `${pathname} robots`);
  assertEqual(getAttribute(document, 'link[rel="canonical"]', 'href'), canonical, `${pathname} canonical`);
  assertEqual(getAttribute(document, 'link[rel="alternate"][hreflang="en"]', 'href'), alternates.en, `${pathname} English hreflang`);
  assertEqual(getAttribute(document, 'link[rel="alternate"][hreflang="he"]', 'href'), alternates.he, `${pathname} Hebrew hreflang`);
  assertEqual(getAttribute(document, 'link[rel="alternate"][hreflang="x-default"]', 'href'), alternates.default, `${pathname} x-default hreflang`);

  if (!sitemap.includes(`<loc>${canonical}</loc>`)) {
    fail(`${pathname} is missing from sitemap.xml`);
  }
}

const locCount = [...sitemap.matchAll(/<loc>/g)].length;
const expectedLocCount = countLocalizedHtmlPages();
if (locCount !== expectedLocCount) {
  fail(`Expected ${expectedLocCount} sitemap URLs, received ${locCount}`);
}

if (sitemap.includes('<loc>https://online-converter.evyatarhazan.com/analytics/</loc>')) {
  fail('/analytics/ must not be listed in sitemap.xml');
}

const analyticsDocument = getDocument('/analytics/');
assertEqual(getAttribute(analyticsDocument, 'meta[name="robots"]', 'content'), 'noindex, nofollow', '/analytics/ robots');

if (!robots.includes('User-agent: *') || !robots.includes('Allow: /')) {
  fail('robots.txt must allow public crawling');
}

if (/Disallow:\s*\//.test(robots)) {
  fail('robots.txt must not disallow the site root');
}

if (!robots.includes(`Sitemap: ${siteUrl}/sitemap.xml`)) {
  fail('robots.txt must point to the canonical sitemap URL');
}

assertNoBrokenInternalLinks();

console.log(`SEO build check passed for ${publicPaths.length} representative pages and ${locCount} sitemap URLs.`);
