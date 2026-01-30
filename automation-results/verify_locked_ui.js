const { chromium } = require('playwright');

const BASE_URL = 'http://localhost:5173';
const CENTRAL_WH_NAME = 'Angelaborough Warehouse';

(async () => {
    console.log('🚀 Starting Verification of LOCKED UI Controls');
    const browser = await chromium.launch({ headless: false, slowMo: 500 });
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
    const page = await context.newPage();

    // 1. Visit Stock In
    console.log('\n--- Checking Stock In (Import) ---');
    await page.goto(`${BASE_URL}/stock-in/create`);
    await page.waitForLoadState('networkidle');

    // Check if dropdown is disabled. 
    // Playwright locator check for attribute 'disabled' or class indicating disabled state.
    // In shadcn/radix, the trigger button usually gets `disabled` attribute or `data-disabled`.
    const importTrigger = page.locator('button[role="combobox"]').first();
    const isImportDisabled = await importTrigger.isDisabled();

    // Also check if text contains "Angelaborough" (auto-filled)
    const importText = await importTrigger.textContent();
    console.log(`[Import] Dropdown Disabled: ${isImportDisabled}`);
    console.log(`[Import] Selected Value: ${importText}`);

    if (isImportDisabled && importText.includes("Angelaborough")) {
        console.log("✅ Import Page: Central Warehouse is Locked & Defaulted.");
    } else {
        console.error("❌ Import Page: Not correctly locked or defaulted.");
    }
    await page.screenshot({ path: './automation-results/verify_import_locked.png' });


    // 2. Visit Transfer
    console.log('\n--- Checking Transfer (Central -> Store) ---');
    await page.goto(`${BASE_URL}/transfers/create`);
    await page.waitForLoadState('networkidle');

    const transferTriggers = page.locator('button[role="combobox"]');
    const sourceTrigger = transferTriggers.first(); // 1st is Source

    const isSourceDisabled = await sourceTrigger.isDisabled();
    const sourceText = await sourceTrigger.textContent();

    console.log(`[Transfer] Source Dropdown Disabled: ${isSourceDisabled}`);
    console.log(`[Transfer] Selected Source: ${sourceText}`);

    if (isSourceDisabled && sourceText.includes("Angelaborough")) {
        console.log("✅ Transfer Page: Source is Locked & Defaulted to Central.");
    } else {
        console.error("❌ Transfer Page: Source not correctly locked or defaulted.");
    }
    await page.screenshot({ path: './automation-results/verify_transfer_locked.png' });

    // 3. Visit Stock Out
    console.log('\n--- Checking Stock Out ---');
    await page.goto(`${BASE_URL}/stock-out/create`);
    await page.waitForLoadState('networkidle');

    const exportTrigger = page.locator('button[role="combobox"]').first();
    const isExportDisabled = await exportTrigger.isDisabled();
    const exportText = await exportTrigger.textContent();

    console.log(`[Export] Dropdown Disabled: ${isExportDisabled}`);
    console.log(`[Export] Selected Value: ${exportText}`);

    if (isExportDisabled && exportText.includes("Angelaborough")) {
        console.log("✅ Export Page: Warehouse is Locked & Defaulted.");
    } else {
        console.error("❌ Export Page: Not correctly locked or defaulted.");
    }
    await page.screenshot({ path: './automation-results/verify_export_locked.png' });

    await browser.close();
})();
