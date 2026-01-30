const { chromium } = require('playwright');

const BASE_URL = 'http://localhost:5173';

(async () => {
    console.log('🚀 Starting Verification of HIDDEN FIELDS');
    const browser = await chromium.launch({ headless: false, slowMo: 500 });
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
    const page = await context.newPage();

    async function checkAbsence(pageTitle, url, labelText) {
        console.log(`\n--- Checking ${pageTitle} ---`);
        await page.goto(`${BASE_URL}${url}`);
        await page.waitForLoadState('networkidle');

        // Look for the label
        const label = page.locator(`label:has-text("${labelText}")`);
        const isVisible = await label.isVisible();

        if (!isVisible) {
            console.log(`✅ ${pageTitle}: Field "${labelText}" is HIDDEN.`);
        } else {
            console.error(`❌ ${pageTitle}: Field "${labelText}" is STILL VISIBLE.`);
        }
        await page.screenshot({ path: `./automation-results/verify_hidden_${pageTitle.replace(/ /g, '_')}.png` });
    }

    // 1. Check Import
    await checkAbsence("Stock In", "/stock-in/create", "Kho Nhập");

    // 2. Check Transfer
    await checkAbsence("Transfer", "/transfers/create", "Kho Nguồn");

    // 3. Check Stock Out
    await checkAbsence("Stock Out", "/stock-out/create", "Kho Xuất");

    await browser.close();
})();
