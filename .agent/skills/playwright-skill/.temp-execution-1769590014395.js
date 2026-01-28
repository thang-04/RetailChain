const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5173';
const TS = Date.now();
const WH_NAME = `PW_WH_${TS}`;
const WH_CODE = `WH_${TS}`;

// Save timestamp for verification later
fs.writeFileSync('C:\\tmp\\test_timestamp.txt', TS.toString());

(async () => {
    console.log(`Starting End-to-End Test with Timestamp: ${TS}`);
    const browser = await chromium.launch({ headless: false, slowMo: 100 });
    const context = await browser.newContext({ viewport: { width: 1366, height: 768 } });
    const page = await context.newPage();

    try {
        // --- 1. Create Warehouse ---
        console.log('--- Step 1: Create Warehouse ---');
        await page.goto(`${BASE_URL}/warehouse`);
        await page.click('text=+ Tạo Kho Mới');

        await page.waitForSelector('input[name="name"]');
        await page.fill('input[name="code"]', WH_CODE);
        await page.fill('input[name="name"]', WH_NAME);

        // Use Default "Kho Tổng" (Type 1) to avoid storeId requirement

        await page.click('button[type="submit"]');

        // Wait for modal to close and list to update
        await page.waitForSelector('div[role="dialog"]', { state: 'hidden' });

        // Reload page to be sure
        await page.reload();
        await page.waitForSelector(`text=${WH_NAME}`, { timeout: 10000 });
        console.log(`Verified Warehouse ${WH_NAME} created.`);

        // --- 2. Create Stock In (Import) ---
        console.log('--- Step 2: Create Stock In ---');
        await page.goto(`${BASE_URL}/stock-in/create`);

        // Select Warehouse
        await page.click('text=Chọn kho nhập');
        // Type to filter
        await page.type('input[aria-expanded="true"]', WH_CODE).catch(() => { });
        // Or just click the item if visible. 
        // Shadcn select might not be an input. It renders a list in a portal.
        // We look for the option text.
        await page.waitForSelector(`div[role="option"]:has-text("${WH_NAME}")`, { timeout: 5000 });
        await page.click(`div[role="option"]:has-text("${WH_NAME}")`);

        // Select Supplier
        await page.click('text=Chọn nhà cung cấp');
        await page.click('text=Vinamilk Corp'); // Hardcoded in UI

        // Select Product
        await page.click('text=Chọn sản phẩm');
        await page.click('text=Produce Edge (XL/Red)'); // ID 1

        // Quantity
        await page.fill('input[type="number"]', '100');

        await page.click('button:has-text("Lưu Phiếu Nhập")');
        await page.waitForURL('**/stock-in');
        console.log('Stock In created.');

        // --- 3. Create Stock Out (Export) ---
        console.log('--- Step 3: Create Stock Out ---');
        await page.goto(`${BASE_URL}/stock-out/create`);

        await page.click('text=Chọn kho');
        await page.click(`div[role="option"]:has-text("${WH_NAME}")`);

        await page.click('text=Chọn lý do');
        await page.click('text=Bán Hàng (Sales)');

        await page.click('text=Chọn sản phẩm');
        await page.click('text=Produce Edge (XL/Red)');

        await page.fill('input[type="number"]', '20');

        await page.click('button:has-text("Lưu Phiếu Xuất")');
        await page.waitForURL('**/stock-out');
        console.log('Stock Out created.');

        // --- 4. Create Transfer ---
        console.log('--- Step 4: Create Transfer ---');
        await page.goto(`${BASE_URL}/transfers/create`);

        // Source
        await page.click('text=Chọn kho nguồn');
        await page.click(`div[role="option"]:has-text("${WH_NAME}")`);

        // Target - Pick "Store A" or any other
        await page.click('text=Chọn kho đích');
        await page.waitForSelector('div[role="option"]');
        const options = page.locator('div[role="option"]');
        const count = await options.count();
        let clicked = false;
        for (let i = 0; i < count; i++) {
            const text = await options.nth(i).textContent();
            if (!text.includes(WH_NAME)) {
                await options.nth(i).click();
                clicked = true;
                break;
            }
        }

        // Product
        await page.click('text=Chọn sản phẩm');
        await page.click('text=Produce Edge (XL/Red)');

        await page.fill('input[type="number"]', '10');

        await page.click('button:has-text("Tạo Lệnh Điều Chuyển")');
        await page.waitForURL('**/transfers');
        console.log('Transfer created.');

        console.log('SUCCESS: All steps verified.');

    } catch (e) {
        console.error('TEST FAILED:', e);
        await page.screenshot({ path: path.join('C:', 'tmp', 'flow_failure_v2.png') });
    } finally {
        await browser.close();
    }
})();
