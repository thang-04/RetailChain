const { chromium } = require('playwright');

const BASE_URL = 'http://localhost:5173';

(async () => {
    console.log('🚀 Starting Verification of Auto-Generated Code');
    const browser = await chromium.launch({ headless: false, slowMo: 1200 });
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
    const page = await context.newPage();

    // 1. Visit Warehouse Page
    await page.goto(`${BASE_URL}/warehouse`);
    await page.waitForLoadState('networkidle');

    // 2. Open Create Modal
    await page.click('button:has-text("Tạo Kho Mới")');
    await page.waitForTimeout(500);

    // 3. Verify Code Input is GONE
    const codeInput = await page.locator('input#code').isVisible();
    if (!codeInput) {
        console.log("✅ Code Input field is HIDDEN (Auto-generated).");
    } else {
        console.error("❌ Code Input field is STILL VISIBLE.");
    }

    // 4. Fill Data
    const whName = `Auto-Code WH ${Date.now()}`;
    await page.fill('input#name', whName);

    // Select a store
    try {
        await page.click('button[role="combobox"]');
        await page.waitForTimeout(300);
        // Ensure options are loaded
        const opts = page.locator('div[role="option"]');
        if (await opts.count() > 0) {
            const firstStore = opts.first();
            await firstStore.click();
        } else {
            console.warn("⚠️ No stores available to select. Might fail submission.");
        }
    } catch (e) {
        console.error("Store selection error:", e);
    }

    // 5. Submit
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1500);

    // 6. Verify Creation & Pattern
    await page.reload();
    await page.click('div:has-text("Lọc theo loại")'); // Open filter
    await page.click('div[role="option"]:has-text("Tất cả")'); // Select all to be safe? Or Child is default. Child is default.

    // Find row by Name
    const row = page.locator(`tr:has-text("${whName}")`);
    if (await row.count() > 0) {
        const codeText = await row.locator('td').first().textContent();
        console.log(`Created Warehouse: ${whName}, Code: ${codeText}`);

        if (codeText.startsWith("WH-")) {
            console.log("✅ Code generated successfully with prefix 'WH-'.");
        } else {
            console.error(`❌ Code pattern mismatch: ${codeText}`);
        }
    } else {
        console.error("❌ Failed to create warehouse or find it in list.");
    }

    await page.screenshot({ path: './automation-results/verify_toc_code.png' });
    await browser.close();
})();
