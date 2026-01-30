const { chromium } = require('playwright');

const BASE_URL = 'http://localhost:5173';

(async () => {
    console.log('🚀 Starting Verification of Refactored Warehouse Creation');
    const browser = await chromium.launch({ headless: false, slowMo: 1000 });
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
    const page = await context.newPage();

    // 1. Visit Warehouse Page
    await page.goto(`${BASE_URL}/warehouse`);
    await page.waitForLoadState('networkidle');

    // 2. Open Create Modal
    await page.click('button:has-text("Tạo Kho Mới")');
    await page.waitForTimeout(500);

    // 3. Verify Modal Content
    // Should NOT see "Loại Kho" dropdown anymore (or strictly Type 2)
    const typeLabel = await page.locator('label:has-text("Loại Kho")').isVisible();
    if (!typeLabel) {
        console.log("✅ 'Loại Kho' selector is HIDDEN.");
    } else {
        console.error("❌ 'Loại Kho' selector is STILL VISIBLE.");
    }

    // Should see "Chọn Cửa Hàng" dropdown
    const storeLabel = await page.locator('label:has-text("Chọn Cửa Hàng")').isVisible();
    if (storeLabel) {
        console.log("✅ 'Chọn Cửa Hàng' selector is VISIBLE.");
    } else {
        console.error("❌ 'Chọn Cửa Hàng' selector is MISSING.");
    }

    // 4. Fill Data
    const testCode = `WH-CX-STORE-${Date.now()}`;
    await page.fill('input#code', testCode);
    await page.fill('input#name', 'Refactor Test Store Warehouse');

    // Select a store (Wait for stores to load)
    try {
        await page.click('button[role="combobox"]'); // Click the trigger
        await page.waitForTimeout(500);
        // Select first available store item
        const firstStore = page.locator('div[role="option"]').first();
        const storeName = await firstStore.textContent();
        await firstStore.click();
        console.log(`Selected Store: ${storeName.trim()}`);
    } catch (e) {
        console.error("Failed to select store:", e);
    }

    // 5. Submit
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    // 6. Verify Creation
    await page.reload();
    const isCreated = await page.isVisible(`td:has-text("${testCode}")`);
    if (isCreated) {
        console.log("✅ Store Warehouse created successfully.");
    } else {
        console.error("❌ Failed to create Store Warehouse.");
    }

    await page.screenshot({ path: './automation-results/verify_create_store_wh.png' });
    await browser.close();
})();
