const { chromium } = require('playwright');

const BASE_URL = 'http://localhost:5173';

(async () => {
    console.log('🚀 Starting Verification of LOCKED UI Controls (Refined)');
    const browser = await chromium.launch({ headless: false, slowMo: 500 });
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
    const page = await context.newPage();

    // Helper to find specific label's neighbor select
    // Looking for a div that contains label "Kho Nhập..." and then finding the button inside it.
    async function checkDropdown(labelPartialText) {
        // Find the label containing text
        const label = page.locator('label', { hasText: labelPartialText }).first();
        // Go up to parent div
        const container = label.locator('..');
        // Find the button (Trigger)
        const trigger = container.locator('button[role="combobox"]');

        await trigger.waitFor({ state: 'attached', timeout: 5000 });

        const isDisabled = await trigger.isDisabled();
        const text = await trigger.textContent();

        console.log(`[Check ${labelPartialText}] Disabled: ${isDisabled} | Value: "${text}"`);
        return { isDisabled, text };
    }

    // 1. Visit Stock In
    console.log('\n--- Checking Stock In (Import) ---');
    await page.goto(`${BASE_URL}/stock-in/create`);
    await page.waitForLoadState('networkidle');

    // Label was changed to "Kho Nhập (Mặc định: Kho Tổng)"
    const imp = await checkDropdown("Kho Nhập");
    if (imp.isDisabled && imp.text.includes("Angelaborough")) {
        console.log("✅ Import Page: PASSED");
    } else {
        console.error("❌ Import Page: FAILED");
    }
    await page.screenshot({ path: './automation-results/refined_import.png' });

    // 2. Visit Transfer
    console.log('\n--- Checking Transfer (Central -> Store) ---');
    await page.goto(`${BASE_URL}/transfers/create`);
    await page.waitForLoadState('networkidle');

    // Label: "Kho Nguồn (Mặc định: Kho Tổng)"
    const trf = await checkDropdown("Kho Nguồn");
    if (trf.isDisabled && trf.text.includes("Angelaborough")) {
        console.log("✅ Transfer Page: PASSED");
    } else {
        console.error("❌ Transfer Page: FAILED");
    }
    await page.screenshot({ path: './automation-results/refined_transfer.png' });

    await browser.close();
})();
