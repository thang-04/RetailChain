const { chromium } = require('playwright');

const TARGET_URL = 'http://localhost:5173/staff/shifts';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('Navigating to ' + TARGET_URL);
  await page.goto(TARGET_URL);
  
  // Wait for the page to load
  await page.waitForTimeout(3000);
  
  console.log('Page title:', await page.title());
  
  // Try to click Add Shift
  try {
      await page.click('text="Add Shift"');
      console.log('Clicked Add Shift');
      await page.waitForTimeout(2000); // wait for modal
  } catch(e) {
      console.log('Could not click Add Shift:', e.message);
  }

  await page.screenshot({ path: './automation-results/shifts-ui-test.png', fullPage: true });
  console.log('📸 Screenshot saved to ./automation-results/shifts-ui-test.png');

  // Let's also get console logs
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));

  await browser.close();
})();
