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
        const searchInput = page.locator('input[placeholder*="Search"]');
        if (await searchInput.isVisible()) console.log('✅ Search Input visible');

        const statusSelect = page.locator('button:has-text("Filter by Status")'); // SelectTrigger is often a button
        if (await statusSelect.isVisible()) console.log('✅ Status Filter visible');

        const dateInputs = await page.locator('input[type="date"]').count();
        if (dateInputs >= 2) console.log(`✅ Date Range Inputs visible (${dateInputs} inputs)`);

        // 2. Check Table Columns (Expect STT column now)
        console.log('\n--- Checking Table Columns ---');
        const firstHeader = page.locator('table thead th').first();
        const firstHeaderText = await firstHeader.innerText();
        if (firstHeaderText.includes('#')) {
            console.log('✅ STT Column (#) is present as first column');
        } else {
            console.error(`❌ Expected "#" but found "${firstHeaderText}"`);
        }

        // 3. Check Actions (Dropdown)
        console.log('\n--- Checking Actions ---');
        const actionButton = page.locator('table tbody tr').first().locator('button').last(); // Usually the action button is last
        if (await actionButton.isVisible()) {
            console.log('✅ Action button (Dropdown trigger) is visible');
        }

        // 4. Check Pagination
        console.log('\n--- Checking Pagination ---');
        const paginationText = page.locator('span:has-text("Page 1 of")');
        if (await paginationText.isVisible()) console.log('✅ Pagination info visible');

        const nextButton = page.locator('button:has-text("Next")');
        if (await nextButton.isVisible()) console.log('✅ Pagination Controls (Next button) visible');

        await page.screenshot({ path: './automation-results/stock_in_enhanced_ui.png', fullPage: true });
        console.log('📸 Screenshot saved to ./automation-results/stock_in_enhanced_ui.png');

    } catch (error) {
        console.error('❌ Error during verification:', error);
    } finally {
        await browser.close();
    }
})();
