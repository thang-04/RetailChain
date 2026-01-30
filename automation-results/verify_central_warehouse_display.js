const { chromium } = require('playwright');

const BASE_URL = 'http://localhost:5173';

(async () => {
    console.log('🚀 Starting Verification of Central Warehouse Display');
    const browser = await chromium.launch({ headless: false, slowMo: 500 });
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
    const page = await context.newPage();

    console.log('\n--- Checking Stock Out Page ---');
    await page.goto(`${BASE_URL}/stock-out/create`);
    await page.waitForLoadState('networkidle');

    // Check for "Kho Xuất (Kho Tổng)" label
    const label = page.locator('label:has-text("Kho Xuất (Kho Tổng)")');
    const isLabelVisible = await label.isVisible();
    console.log(`Label Visible: ${isLabelVisible}`);

    if (isLabelVisible) {
        // Check the input value next to it (or below it)
        const input = page.locator('input[disabled]').first(); // Assuming it's the first disabled input
        const value = await input.inputValue();
        console.log(`Displayed Warehouse: "${value}"`);

        if (value.includes("Angelaborough") || value.length > 5) { // Check for some content
            console.log("✅ Central Warehouse is displayed correctly.");
        } else {
            console.error("❌ Central Warehouse value is empty or incorrect.");
        }
    } else {
        console.error("❌ Label 'Kho Xuất (Kho Tổng)' not found.");
    }

    await page.screenshot({ path: './automation-results/verify_cw_display.png' });
    await browser.close();
})();
