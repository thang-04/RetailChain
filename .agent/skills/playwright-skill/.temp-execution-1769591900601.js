const { chromium } = require('playwright');
const path = require('path');

const BASE_URL = 'http://localhost:5173';

(async () => {
    console.log('Testing Stock In List Page with Real API...');
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        await page.goto(`${BASE_URL}/stock-in`);

        // Wait for table rows (excluding header)
        // Adjust selector based on actual DOM of Shadcn Table
        await page.waitForSelector('tbody tr', { timeout: 10000 });

        // Check if loading text is gone
        const loading = await page.isVisible('text=Loading records...');
        if (loading) {
            console.log('Still loading...');
            await page.waitForSelector('text=Loading records...', { state: 'hidden', timeout: 10000 });
        }

        const rows = await page.locator('tbody tr');
        const count = await rows.count();
        console.log(`Found ${count} records in the list.`);

        if (count > 0) {
            const firstRowText = await rows.first().innerText();
            console.log('First Record Data:', firstRowText);
        } else {
            console.log('No records found. API might be empty or failed.');
        }

        await page.screenshot({ path: path.join('C:', 'tmp', 'stock_in_list_api.png') });
        console.log('Screenshot saved.');

    } catch (e) {
        console.error('Test Failed:', e);
    } finally {
        await browser.close();
    }
})();
