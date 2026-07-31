import process from 'node:process';

const baseUrl = process.env.SMOKE_BASE_URL || 'https://online-converter.evyatarhazan.com';

const checks = [
  { path: '/en/', contains: 'Online Converter' },
  { path: '/he/', contains: 'אונליין קונברטר' },
  { path: '/en/json-to-csv/', contains: 'JSON to CSV Converter' },
  { path: '/he/sort-lines/', contains: 'מיון שורות' },
  { path: '/en/calculator/', contains: 'Online Calculators' },
  { path: '/sitemap.xml', contains: '<urlset' },
  { path: '/robots.txt', contains: 'Sitemap:' }
];

const notFoundChecks = [
  { path: '/en/html-escape/', contains: 'Page not found' },
  { path: '/en/not-a-real-tool/', contains: 'Page not found' }
];

async function checkPage({ path, contains }) {
  const url = new URL(path, baseUrl).toString();
  const response = await fetch(url);
  const body = await response.text();

  if (!response.ok) {
    throw new Error(`${url} returned HTTP ${response.status}`);
  }

  if (!body.includes(contains)) {
    throw new Error(`${url} did not include expected text: ${contains}`);
  }

  return `${response.status} ${url}`;
}

const results = await Promise.all(checks.map(checkPage));
const notFoundResults = await Promise.all(notFoundChecks.map(async ({ path, contains }) => {
  const url = new URL(path, baseUrl).toString();
  const response = await fetch(url);
  const body = await response.text();

  if (response.status !== 404) {
    throw new Error(`${url} returned HTTP ${response.status}; expected 404`);
  }

  if (!body.includes(contains)) {
    throw new Error(`${url} did not include expected not-found text: ${contains}`);
  }

  if (!body.includes('content="noindex, nofollow"')) {
    throw new Error(`${url} did not include noindex robots metadata`);
  }

  return `${response.status} ${url}`;
}));
console.log(`Production smoke passed for ${baseUrl}`);
for (const result of results) {
  console.log(`- ${result}`);
}
for (const result of notFoundResults) {
  console.log(`- ${result}`);
}
