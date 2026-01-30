const { chromium } = require('playwright');

const BASE_URL = 'http://localhost:5173';

(async () => {
    console.log('🚀 Starting Verification of Refactored Stock Out');
    const browser = await chromium.launch({ headless: false, slowMo: 500 });
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
    const page = await context.newPage();

    await page.goto(`${BASE_URL}/stock-out/create`);
    await page.waitForLoadState('networkidle');

    // 1. Check Header Change
    const header = await page.locator('h2').textContent();
    console.log(`Header: "${header}"`);
    if (header.includes("Xuất Kho Đến Cửa Hàng")) {
        console.log("✅ Custom Header Verified");
    } else {
        console.error("❌ Header mismatch");
    }

    // 2. Check "Target Warehouse" Dropdown existence
    const targetLabel = page.locator('label:has-text("Xuất Kho Đến Cửa Hàng (Kho Đích)")');
    const isTargetVisible = await targetLabel.isVisible();
    console.log(`Target Field Visible: ${isTargetVisible}`);

    // 3. Check "Reason" Dropdown absence
    const reasonLabel = page.locator('label:has-text("Lý Do Xuất")');
    const isReasonVisible = await reasonLabel.isVisible();
    console.log(`Reason Field Visible: ${isReasonVisible}`);

    if (isTargetVisible && !isReasonVisible) {
        console.log("✅ UI Refactored Successfully: Target Field Added, Reason Field Removed.");
    } else {
        console.error("❌ UI Refactoring Issues Detected.");
    }

    await page.screenshot({ path: './automation-results/verify_stockout_refactor.png' });
    await browser.close();
})();
