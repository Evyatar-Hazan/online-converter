import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { JSDOM } from 'jsdom';

const siteUrl = 'https://online-converter.evyatarhazan.com';
const distDir = join(process.cwd(), 'dist');
const publisherId = 'pub-6696643120887220';
const adClient = `ca-${publisherId}`;
const infoSegments = new Set(['about', 'editorial', 'privacy', 'contact']);

const fail = (message) => {
  throw new Error(`AdSense readiness check failed: ${message}`);
};

if (!existsSync(distDir)) {
  fail('dist directory is missing; run npm run adsense:readiness or npm run build first');
}

const readDistFile = (path) => readFileSync(join(distDir, path), 'utf8');

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

const getDocument = (htmlFile) => new JSDOM(readDistFile(htmlFile)).window.document;

const getRobots = (document) => document.querySelector('meta[name="robots"]')?.getAttribute('content') ?? '';

const getVisibleText = (document) => {
  const clone = document.body.cloneNode(true);
  clone.querySelectorAll('script, style, noscript, svg').forEach((node) => node.remove());
  return clone.textContent?.replace(/\s+/g, ' ').trim() ?? '';
};

const countWords = (text) => text.split(/\s+/).filter((word) => /[\p{L}\p{N}]/u.test(word)).length;

const countAdSlots = (document) => document.querySelectorAll('[data-ad-real="true"]').length;

const hasAdSenseLoader = (document) =>
  Boolean(document.querySelector(`script[src*="pagead2.googlesyndication.com"][src*="${adClient}"]`));

const pageKind = (publicPath) => {
  const segments = publicPath.split('/').filter(Boolean);
  if (segments.length === 1 && ['en', 'he'].includes(segments[0])) {
    return 'home';
  }

  if (segments.length === 2 && ['data', 'text', 'encoding', 'time', 'developer', 'color', 'calculator'].includes(segments[1])) {
    return 'category';
  }

  if (segments.length === 2 && infoSegments.has(segments[1])) {
    return 'info';
  }

  if (segments.length === 2 && ['en', 'he'].includes(segments[0])) {
    return 'tool';
  }

  return 'other';
};

const requiredSectionsByKind = {
  home: ['#tools'],
  category: ['#featured-tools', '#workflow', '#faq', '#all-tools'],
  info: ['[data-info-page]', '.info-section'],
  tool: ['#converter', '#use-cases', '#quality-checks', '#examples', '#faq', '#related-tools']
};

const thresholdsByKind = {
  home: { minWords: 190, minAdSlots: 0, maxAdSlots: 0, minFaqItems: 0 },
  category: { minWords: 430, minAdSlots: 0, maxAdSlots: 0, minFaqItems: 4 },
  info: { minWords: 100, minAdSlots: 0, maxAdSlots: 0, minFaqItems: 0 },
  tool: { minWords: 720, minAdSlots: 2, maxAdSlots: 2, minFaqItems: 4, minExamples: 2 }
};

const sitemap = readDistFile('sitemap.xml');
const sitemapLocs = new Set([...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]));
const htmlFiles = walkDistFiles().filter((file) => file.endsWith('.html'));
const failures = [];
const risks = [];
const summary = {
  indexable: 0,
  monetized: 0,
  noindex: 0,
  tool: 0,
  category: 0,
  home: 0,
  info: 0
};

const recordFailure = (message) => failures.push(message);
const recordRisk = (message) => risks.push(message);

const assertAdsTxt = () => {
  const adsTxt = readDistFile('ads.txt');
  const expectedLine = `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0`;

  if (!adsTxt.includes(expectedLine)) {
    recordFailure(`ads.txt is missing expected publisher line: ${expectedLine}`);
  }
};

const assertForbiddenPagesAreNotMonetized = () => {
  const forbiddenFiles = ['404.html', 'analytics/index.html'].filter((file) => existsSync(join(distDir, file)));

  for (const file of forbiddenFiles) {
    const document = getDocument(file);
    const publicPath = normalizePublicPath(toPublicPath(file));
    if (hasAdSenseLoader(document) || countAdSlots(document) > 0) {
      recordFailure(`${publicPath} must not include AdSense loader or ad slots`);
    }

    if (!getRobots(document).startsWith('noindex')) {
      recordFailure(`${publicPath} must be noindex`);
    }
  }
};

const assertBacklogRoutesAreAbsent = () => {
  const blockedRoutes = ['en/html-escape/index.html', 'he/html-escape/index.html', 'en/not-a-real-tool/index.html'];
  for (const route of blockedRoutes) {
    if (existsSync(join(distDir, route))) {
      recordFailure(`Backlog or fake route was generated into dist: /${route.replace(/index\.html$/, '')}`);
    }
  }
};

const auditIndexablePage = (htmlFile) => {
  const publicPath = normalizePublicPath(toPublicPath(htmlFile));
  const kind = pageKind(publicPath);
  const document = getDocument(htmlFile);
  const robots = getRobots(document);
  const indexable = robots.startsWith('index');
  const adSlots = countAdSlots(document);
  const loader = hasAdSenseLoader(document);
  const text = getVisibleText(document);
  const words = countWords(text);

  if (!indexable) {
    summary.noindex += 1;
    if (adSlots > 0 || loader) {
      recordFailure(`${publicPath} is noindex but includes AdSense markup`);
    }
    return;
  }

  if (!/^\/(en|he)\//.test(publicPath)) {
    return;
  }

  summary.indexable += 1;

  if (!sitemapLocs.has(`${siteUrl}${publicPath}`)) {
    recordFailure(`${publicPath} is indexable but missing from sitemap.xml`);
  }

  if (!thresholdsByKind[kind]) {
    recordRisk(`${publicPath} is indexable with unclassified page kind "${kind}"`);
    return;
  }

  summary[kind] += 1;

  if (kind === 'tool' && !loader) {
    recordFailure(`${publicPath} is a reviewed tool page but is missing the AdSense loader`);
  }

  if (kind !== 'tool' && loader) {
    recordFailure(`${publicPath} is a ${kind} page and must not load AdSense`);
  }

  if (adSlots > 0) {
    summary.monetized += 1;
  }

  const thresholds = thresholdsByKind[kind];
  if (adSlots < thresholds.minAdSlots || adSlots > thresholds.maxAdSlots) {
    recordFailure(`${publicPath} has ${adSlots} real ad slots; expected ${thresholds.minAdSlots}-${thresholds.maxAdSlots}`);
  }

  if (words < thresholds.minWords) {
    recordFailure(`${publicPath} has ${words} visible words; expected at least ${thresholds.minWords}`);
  }

  for (const selector of requiredSectionsByKind[kind]) {
    if (!document.querySelector(selector)) {
      recordFailure(`${publicPath} is missing required readiness section ${selector}`);
    }
  }

  const faqItems = document.querySelectorAll('#faq details').length;
  if (faqItems < thresholds.minFaqItems) {
    recordFailure(`${publicPath} has ${faqItems} FAQ items; expected at least ${thresholds.minFaqItems}`);
  }

  if (kind === 'tool') {
    const examples = document.querySelectorAll('#examples .example-card').length;
    if (examples < thresholds.minExamples) {
      recordFailure(`${publicPath} has ${examples} starter examples; expected at least ${thresholds.minExamples}`);
    }

    if (!document.querySelector('[data-editorial-review]')) {
      recordFailure(`${publicPath} is missing visible editorial review provenance`);
    }

    const placements = [...document.querySelectorAll('[data-ad-real="true"]')]
      .map((slot) => slot.getAttribute('data-ad-placement'))
      .sort();
    if (placements.join(',') !== 'bottom,inline') {
      recordFailure(`${publicPath} must use only the separated inline and bottom placements; received ${placements.join(',')}`);
    }
  }

  const locale = publicPath.split('/').filter(Boolean)[0];
  for (const infoPage of infoSegments) {
    const expectedHref = `/${locale}/${infoPage}/`;
    if (!document.querySelector(`footer a[href="${expectedHref}"]`)) {
      recordFailure(`${publicPath} footer is missing ${expectedHref}`);
    }
  }

  const searchFirstPhrases = [
    'search demand',
    'build authority',
    'internal linking hubs',
    'למשוך עוד חיפושים',
    'כיסוי חיפושים',
    'לצבור authority'
  ];
  for (const phrase of searchFirstPhrases) {
    if (text.toLowerCase().includes(phrase.toLowerCase())) {
      recordFailure(`${publicPath} exposes search-engine-first copy: "${phrase}"`);
    }
  }

  if (publicPath.endsWith('/privacy/')) {
    const privacyText = text.toLowerCase();
    const privacyPhrases = publicPath.startsWith('/he/')
      ? ['google adsense', 'cookies', 'web beacons', 'כתובת ip']
      : ['google adsense', 'cookies', 'web beacons', 'ip address'];
    for (const phrase of privacyPhrases) {
      if (!privacyText.includes(phrase)) {
        recordFailure(`${publicPath} privacy notice is missing disclosure: ${phrase}`);
      }
    }
    if (!document.querySelector('a[href="https://policies.google.com/technologies/partner-sites"]')) {
      recordFailure(`${publicPath} privacy notice is missing Google partner-sites disclosure link`);
    }
    if (!document.querySelector('a[href="https://adssettings.google.com/"]')) {
      recordFailure(`${publicPath} privacy notice is missing Google Ads Settings link`);
    }
  }
};

assertAdsTxt();
assertForbiddenPagesAreNotMonetized();
assertBacklogRoutesAreAbsent();

for (const htmlFile of htmlFiles) {
  auditIndexablePage(htmlFile);
}

if (summary.indexable !== sitemapLocs.size) {
  recordFailure(`Indexable page count (${summary.indexable}) does not match sitemap URL count (${sitemapLocs.size})`);
}

if (summary.monetized !== summary.tool) {
  recordFailure(`Monetized public page count (${summary.monetized}) must match reviewed tool page count (${summary.tool})`);
}

if (risks.length > 0) {
  console.warn('AdSense readiness risks:');
  for (const risk of risks) {
    console.warn(`- ${risk}`);
  }
}

if (failures.length > 0) {
  fail(`\n${failures.map((message) => `- ${message}`).join('\n')}`);
}

console.log('AdSense readiness check passed.');
console.log(`- ${summary.indexable} indexable public pages`);
console.log(`- ${summary.monetized} monetized public pages`);
console.log(`- ${summary.home} home pages`);
console.log(`- ${summary.category} category pages`);
console.log(`- ${summary.tool} tool pages`);
console.log(`- ${summary.info} policy and ownership pages`);
console.log(`- ${summary.noindex} noindex pages checked for ad leakage`);
