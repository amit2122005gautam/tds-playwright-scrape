const { chromium } = require('playwright');

async function scrapeAndSum() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  let totalSum = 0;
  const seeds = [18, 19, 20, 21, 22, 23, 24, 25, 26, 27];

  for (const seed of seeds) {
    const url = 'https://sanand0.github.io/tdsdata/js_table/?seed=' + seed;
    console.log('Navigating to: ' + url);

    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('td');

    const texts = await page.locator('td').allInnerTexts();
    const pageSum = texts
      .map(t => parseFloat(t.trim()))
      .filter(v => !isNaN(v))
      .reduce((a, b) => a + b, 0);

    console.log('Seed ' + seed + ' sum: ' + pageSum);
    totalSum += pageSum;
  }

  console.log('========================================');
  console.log('TOTAL SUM: ' + totalSum);
  console.log('========================================');

  await browser.close();
}

scrapeAndSum().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
