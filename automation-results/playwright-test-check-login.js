const { chromium } = require('playwright');

// Parameters
const TARGET_URL = 'http://localhost:5173';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log(`Navigating to ${TARGET_URL}...`);
  await page.goto(TARGET_URL);
  
  // Wait to see where we land
  await page.waitForTimeout(2000);
  
  console.log('Current URL:', page.url());
  console.log('Page Title:', await page.title());

  // Screenshot
  await page.screenshot({ path: './automation-results/initial_page.png', fullPage: true });
  console.log('📸 Screenshot saved to ./automation-results/initial_page.png');

  await browser.close();
})();
