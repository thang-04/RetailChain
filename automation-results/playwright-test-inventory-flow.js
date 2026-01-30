const { chromium } = require('playwright');

const BASE_URL = 'http://localhost:5173';
const CENTRAL_WH_NAME = 'Angelaborough Warehouse';
const STORE_WH_NAME = 'Byrdburgh Warehouse';
const PRODUCT_NAME = 'Produce Edge';

(async () => {
    console.log('🚀 Starting Inventory Flow Test');
    const browser = await chromium.launch({ headless: false, slowMo: 500 }); // SlowMo to watch
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
    const page = await context.newPage();

    // 1. Visit Home (to ensure auth if needed)
    await page.goto(BASE_URL);
    console.log('Navigated to Home');

    // =========================================================================
    // TEST CASE 1: STOCK IN (CENTRAL WAREHOUSE)
    // =========================================================================
    console.log('\n--- Testing Stock In (Import) ---');
    await page.goto(`${BASE_URL}/stock-in/create`);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: './automation-results/01_stockin_page.png' });

    // Select Warehouse
    // Assuming shadcn Select or similar
    // Note: Adjust selector based on actual UI. Trying generic first.
    // Look for label "Target Warehouse" or just "Warehouse"
    console.log('Selecting Warehouse...');
    // Try to find the trigger
    const warehouseTrigger = page.locator('button[role="combobox"]').first(); // Dangerous if multiple, but let's try
    // Or look for label proximity
    // await page.getByLabel('Warehouse').click(); 

    if (await warehouseTrigger.isVisible()) {
        await warehouseTrigger.click();
        console.log('Dropdown opened');
        await page.waitForTimeout(500);
        await page.screenshot({ path: './automation-results/02_stockin_dropdown.png' });

        // Clean check: Type to filter or just click exact text
        const centralOption = page.getByRole('option', { name: CENTRAL_WH_NAME });
        if (await centralOption.isVisible()) {
            await centralOption.click();
            console.log(`Selected Central Warehouse: ${CENTRAL_WH_NAME}`);
        } else {
            console.error(`Could not find option ${CENTRAL_WH_NAME}`);
        }
    } else {
        console.log('Could not find Warehouse Combobox');
    }

    // Select Supplier (Just pick first available if any, or skip if optional? Likely required)
    // ... (Simplifying flow: just verifying Warehouse restriction logic primarily)
    // To truly test "Import Success", we need to fill everything.
    // But verifying restriction is key.

    // Check if Store Warehouse is in the list (Negative check for Import)
    // Re-open dropdown
    /*
    await warehouseTrigger.click();
    const storeOption = page.getByRole('option', { name: STORE_WH_NAME });
    if (await storeOption.isVisible()) {
        console.log('WARNING: Store Warehouse is visible in Import! It should be restricted?');
    } else {
        console.log('SUCCESS: Store Warehouse is NOT visible in Import (or filtered out).');
    }
    await page.keyboard.press('Escape'); // Close dropdown
    */

    // =========================================================================
    // TEST CASE 2: TRANSFER (CENTRAL -> STORE)
    // =========================================================================
    console.log('\n--- Testing Stock Transfer (Central -> Store) ---');
    await page.goto(`${BASE_URL}/transfers/create`);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: './automation-results/03_transfer_page.png' });

    // Select Source Warehouse
    console.log('Selecting Source Warehouse...');
    // Identify Source vs Target dropdowns.
    // Assume generic order or labels.
    // Using placeholders or labels if shadcn

    // Try finding by text "Source Warehouse" or similar
    // await page.getByText('Source Warehouse').click(); // Might click label, not input

    // Let's try locating all comboboxes
    const comboboxes = await page.getByRole('combobox').all();
    console.log(`Found ${comboboxes.length} comboboxes`);

    if (comboboxes.length >= 2) {
        // 1st is Source
        await comboboxes[0].click();
        await page.getByRole('option', { name: CENTRAL_WH_NAME }).click();
        console.log('Selected Source: Central');

        // 2nd is Target
        await comboboxes[1].click();
        await page.getByRole('option', { name: STORE_WH_NAME }).click();
        console.log('Selected Target: Store');

        await page.screenshot({ path: './automation-results/04_transfer_filled.png' });
    }

    // =========================================================================
    // TEST CASE 3: NEGATIVE TRANSFER (STORE -> CENTRAL)
    // =========================================================================
    console.log('\n--- Testing Negative Transfer (Store -> Central) ---');
    // Refresh or new page
    await page.reload();
    await page.waitForTimeout(1000);

    const boxes2 = await page.getByRole('combobox').all();
    if (boxes2.length >= 2) {
        // Try to select Store as Source
        await boxes2[0].click();
        const storeSourceOption = page.getByRole('option', { name: STORE_WH_NAME });

        const isVisible = await storeSourceOption.isVisible();
        if (isVisible) {
            console.log('Store is selectable as Source. Selecting it...');
            await storeSourceOption.click();

            // Verify if any error appears or if Submit is disabled
            // Wait and see
            await page.waitForTimeout(500);
            await page.screenshot({ path: './automation-results/05_transfer_negative_attempt.png' });
            console.log('Selected Store as Source. Check screenshot 05 to see validations.');
        } else {
            console.log('SUCCESS: Store Warehouse is NOT selectable as Source.');
        }
    }

    await browser.close();
})();
