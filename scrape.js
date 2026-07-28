const { chromium } = require('playwright');

async function scrapeAndSum() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  let totalSum = 0;
  const seeds = [18, 19, 20, 21, 22, 23, 24, 25, 26, 27];

  for (const seed of seeds) {
    const url = 'https://sanand0.github.io/tdsdata/js_table/?seed=' + seed;
    console.log('Navigating to: ' + url);
    
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForSelector('td', { timeout: 15000 });

    const cellValues = await page.eval('td', cells =>
      cells
        .map(cell => parseFloat(cell.innerText.trim()))
        .filter(val => !isNaN(val))
    );

    const pageSum = cellValues.reduce((acc, curr) => acc + curr, 0);
    console.log('Seed ' + seed + ' sum: ' + pageSum);
    totalSum += pageSum;
  }

  console.log('========================================');
  console.log('TOTAL SUM: ' + totalSum);
  console.log('========================================');

  await browser.close();
}

scrapeAndSum().catch(err => {
  console.error(err);
  process.exit(1);
});
