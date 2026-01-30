const { chromium } = require('playwright');

const BASE_URL = 'http://localhost:5173';

(async () => {
    console.log('🚀 Starting Verification of SIDEBAR');
    const browser = await chromium.launch({ headless: false, slowMo: 500 });
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
    const page = await context.newPage();

    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // Look for "Stock Out" link in sidebar
    const stockOutLink = page.locator('a[href="/stock-out"]');
    const isVisible = await stockOutLink.isVisible();
    const linkText = await stockOutLink.textContent();

    console.log(`Link Visible: ${isVisible}`);
    console.log(`Link Text: "${linkText?.trim()}"`);

    if (isVisible && linkText.includes("Stock Out")) {
        console.log("✅ Sidebar contains 'Stock Out'");
    } else {
        console.error("❌ 'Stock Out' missing from Sidebar");
    }

    await page.screenshot({ path: './automation-results/verify_sidebar.png' });
    await browser.close();
})();
