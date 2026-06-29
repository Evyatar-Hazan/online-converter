import { spawn } from 'node:child_process';
import process from 'node:process';
import { chromium } from '@playwright/test';

const host = '127.0.0.1';
const port = 4321;
const baseUrl = `http://${host}:${port}`;

const pages = [
  { label: 'English home', path: '/en/', maxLcp: 2500, maxCls: 0.05, maxFcp: 1800, maxTtfb: 800, maxDomContentLoaded: 1800, maxLoad: 3000 },
  { label: 'English category', path: '/en/calculator/', maxLcp: 2600, maxCls: 0.05, maxFcp: 1900, maxTtfb: 800, maxDomContentLoaded: 1900, maxLoad: 3200 },
  { label: 'Hebrew converter', path: '/he/sort-lines/', maxLcp: 2600, maxCls: 0.05, maxFcp: 1900, maxTtfb: 800, maxDomContentLoaded: 1900, maxLoad: 3200 }
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer(url, attempts = 40) {
  for (let index = 0; index < attempts; index += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return;
      }
    } catch {
      // Preview server is still starting.
    }

    await sleep(500);
  }

  throw new Error(`Preview server did not become ready at ${url}`);
}

function startPreviewServer() {
  const child = spawn('npm', ['run', 'preview', '--', '--host', host, '--port', String(port)], {
    cwd: process.cwd(),
    stdio: 'pipe',
    env: { ...process.env, FORCE_COLOR: '0' }
  });

  let stderr = '';
  child.stderr.on('data', (chunk) => {
    stderr += chunk.toString();
  });

  return { child, getStderr: () => stderr };
}

async function collectMetrics(browser, path) {
  const page = await browser.newPage();
  await page.addInitScript(() => {
    window.__ocPerfMetrics = {
      lcp: 0,
      cls: 0
    };

    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const last = entries[entries.length - 1];
      if (last) {
        window.__ocPerfMetrics.lcp = last.startTime;
      }
    }).observe({ type: 'largest-contentful-paint', buffered: true });

    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          window.__ocPerfMetrics.cls += entry.value;
        }
      }
    }).observe({ type: 'layout-shift', buffered: true });
  });

  await page.goto(`${baseUrl}${path}`, { waitUntil: 'load' });
  await page.waitForTimeout(1000);

  const metrics = await page.evaluate(() => {
    const navigation = performance.getEntriesByType('navigation')[0];
    const paints = performance.getEntriesByType('paint');
    const firstContentfulPaint = paints.find((entry) => entry.name === 'first-contentful-paint')?.startTime ?? 0;

    return {
      lcp: Number(window.__ocPerfMetrics?.lcp ?? 0),
      cls: Number(window.__ocPerfMetrics?.cls ?? 0),
      fcp: Number(firstContentfulPaint),
      ttfb: navigation ? Number(navigation.responseStart) : 0,
      domContentLoaded: navigation ? Number(navigation.domContentLoadedEventEnd) : 0,
      load: navigation ? Number(navigation.loadEventEnd) : 0
    };
  });

  await page.close();
  return metrics;
}

function formatMetric(value, digits = 0) {
  return digits > 0 ? value.toFixed(digits) : Math.round(value).toString();
}

function assertMetric(name, value, max, label) {
  if (value > max) {
    throw new Error(`${label} ${name} ${formatMetric(value, name === 'cls' ? 3 : 0)} exceeded threshold ${formatMetric(max, name === 'cls' ? 3 : 0)}`);
  }
}

const { child: previewServer, getStderr } = startPreviewServer();
let stoppingPreview = false;

try {
  previewServer.on('exit', (code) => {
    if (!stoppingPreview && code !== null && code !== 0) {
      console.error(`Preview server exited early with code ${code}`);
    }
  });

  await waitForServer(`${baseUrl}/en/`);

  const browser = await chromium.launch();
  try {
    for (const page of pages) {
      const metrics = await collectMetrics(browser, page.path);
      assertMetric('lcp', metrics.lcp, page.maxLcp, page.label);
      assertMetric('cls', metrics.cls, page.maxCls, page.label);
      assertMetric('fcp', metrics.fcp, page.maxFcp, page.label);
      assertMetric('ttfb', metrics.ttfb, page.maxTtfb, page.label);
      assertMetric('domContentLoaded', metrics.domContentLoaded, page.maxDomContentLoaded, page.label);
      assertMetric('load', metrics.load, page.maxLoad, page.label);

      console.log(
        [
          `${page.label} ${page.path}`,
          `LCP ${formatMetric(metrics.lcp)}ms`,
          `CLS ${formatMetric(metrics.cls, 3)}`,
          `FCP ${formatMetric(metrics.fcp)}ms`,
          `TTFB ${formatMetric(metrics.ttfb)}ms`,
          `DCL ${formatMetric(metrics.domContentLoaded)}ms`,
          `Load ${formatMetric(metrics.load)}ms`
        ].join(' | ')
      );
    }
  } finally {
    await browser.close();
  }

  console.log('Performance check passed for representative pages.');
} catch (error) {
  const details = getStderr().trim();
  if (details) {
    console.error(details);
  }
  throw error;
} finally {
  stoppingPreview = true;
  previewServer.kill('SIGTERM');
}
