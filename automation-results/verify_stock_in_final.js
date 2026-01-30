const { chromium } = require('playwright');

const BASE_URL = 'http://localhost:5173';

(async () => {
    console.log('🚀 Starting Verification of Enhanced Stock In Page UI');
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    try {
        console.log(`Navigating to ${BASE_URL}/stock-in...`);
        await page.goto(`${BASE_URL}/stock-in`);
        await page.waitForLoadState('networkidle');

        // 1. Check Filters
        console.log('\n--- Checking Filters ---');
        // Use more specific locator if possible, or .first()
        const searchInput = page.locator('input[placeholder*="Search"]').first();
        if (await searchInput.isVisible()) console.log('✅ Search Input visible');

        // Check for Status Filter Trigger (it's a button usually in shadcn select)
        const statusTrigger = page.locator('button').filter({ hasText: 'Filter by Status' }).first();
        if (await statusTrigger.isVisible()) {
            console.log('✅ Status Filter visible');
        } else {
            // Fallback: maybe it has a value selected
            const anySelectTrigger = page.locator('div[role="combobox"]').first(); // shadcn select often uses role combobox or button
            if (await anySelectTrigger.isVisible()) console.log('✅ Select Trigger visible (might be status)');
        }

        const dateInputs = await page.locator('input[type="date"]').count();
        if (dateInputs >= 2) console.log(`✅ Date Range Inputs visible (${dateInputs} inputs)`);

        // 2. Check Table Columns (Expect STT column now)
        console.log('\n--- Checking Table Columns ---');
        const firstHeader = page.locator('table thead th').first();
        const firstHeaderText = await firstHeader.innerText();
        if (firstHeaderText.includes('#')) {
            console.log('✅ STT Column (#) is present as first column');
        } else {
            console.log(`ℹ️ First column header is "${firstHeaderText}"`);
        }

        // 3. Check Actions (Dropdown)
        console.log('\n--- Checking Actions ---');
        // Check for 3-dots icon or button in the last cell of first row
        const firstRow = page.locator('table tbody tr').first();
        const actionBtn = firstRow.locator('button').last();

        if (await actionBtn.isVisible()) {
            console.log('✅ Action button (Dropdown trigger) is visible');
            // Optional: Click it to see if menu opens
            // await actionBtn.click();
            // const menu = page.locator('div[role="menu"]');
            // if (await menu.isVisible()) console.log('✅ Dropdown menu opened');
        }

        // 4. Check Pagination
        console.log('\n--- Checking Pagination ---');
        // Look for typical pagination text
        const paginationInfo = page.getByText(/Page \d+ of \d+/);
        if (await paginationInfo.isVisible()) console.log('✅ Pagination info visible');

        await page.screenshot({ path: './automation-results/stock_in_final_v2.png', fullPage: true });
        console.log('📸 Screenshot saved to ./automation-results/stock_in_final_v2.png');

    } catch (error) {
        console.error('❌ Error during verification:', error);
    } finally {
        await browser.close();
    }
})();
