import { chromium } from 'playwright';

const BASE_URL = 'https://www.nellisauction.com/';

/** Searches public listings; keep site-specific selectors isolated in this module. */
export async function searchListings(query) {
  if (process.env.SCRAPER_MODE === 'mock') return mockResults(query);
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  try {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 30_000 });
    // `.first()` tolerates the site's desktop/mobile duplicate search controls.
    const input = page.getByRole('searchbox', { name: /search items/i }).first();
    await input.fill(query);
    await page.getByRole('button', { name: /^search$/i }).click();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(800);
    const listings = await page.locator('h6').evaluateAll((headings) => headings.map((heading) => {
      const title = heading.textContent?.replace(/\s+/g, ' ').trim() || '';
      const card = heading.closest('a, article, li, [class*="card" i]');
      const link = card?.closest('a')?.href || card?.querySelector('a')?.href || '';
      const image = card?.querySelector('img')?.currentSrc || card?.querySelector('img')?.src || '';
      return { title, url: link, imageUrl: image };
    }).filter((listing) => listing.title && listing.url).slice(0, 24));
    return listings.map((listing) => ({ ...listing, source: 'Nellis Auction' }));
  } finally { await browser.close(); }
}

function mockResults(query) {
  return Array.from({ length: 6 }, (_, index) => ({ title: `${query} — sample auction listing ${index + 1}`, url: BASE_URL, imageUrl: '', source: 'Sample data' }));
}
