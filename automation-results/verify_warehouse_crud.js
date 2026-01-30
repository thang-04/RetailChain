const { chromium } = require('playwright');

const BASE_URL = 'http://localhost:5173';

(async () => {
    console.log('🚀 Starting Warehouse Operations Verification');
    const browser = await chromium.launch({ headless: false, slowMo: 800 });
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
    const page = await context.newPage();

    // 1. Visit Warehouse Page
    await page.goto(`${BASE_URL}/warehouse`);
    await page.waitForLoadState('networkidle');
    console.log("Navigated to Warehouse Page");

    // 2. Check UI Elements
    const hasSearch = await page.isVisible('input[placeholder*="Tìm kiếm"]');
    const hasFilter = await page.isVisible('button:has-text("Lọc theo loại")'); // Select Trigger
    console.log(`Search Visible: ${hasSearch}, Filter Visible: ${hasFilter}`);

    // Capture initial state
    await page.screenshot({ path: './automation-results/warehouse_list.png' });

    // 3. Create New Warehouse (Child)
    const testCode = `WH-TEST-${Date.now()}`;
    await page.click('button:has-text("Tạo Kho Mới")');
    await page.fill('input#code', testCode);
    await page.fill('input#name', 'Test Child Warehouse');
    // Ensure Type 2 is selected (default, but verify)
    // Add Store ID
    await page.fill('input#storeId', '999');

    await page.click('button[type="submit"]');
    // Wait for success
    await page.waitForTimeout(1000);
    console.log("Created Warehouse:", testCode);

    // 4. Verify Creation in List
    // Need to clear filter or search specifically?
    // Filter is default '2', so it should show up.
    await page.reload();
    await page.waitForTimeout(1000);
    const isRowVisible = await page.isVisible(`td:has-text("${testCode}")`);
    if (isRowVisible) {
        console.log("✅ Create Success: Warehouse found in list.");
    } else {
        console.error("❌ Create Failed: Warehouse not found.");
    }

    // 5. Edit Warehouse
    if (isRowVisible) {
        // Find the specific row for our test code
        const row = page.locator(`tr:has-text("${testCode}")`);
        await row.locator('button[title="Chỉnh sửa"]').click();

        await page.fill('input#name', 'Test Child Warehouse UPDATED');
        await page.click('button:has-text("Cập Nhật")');
        await page.waitForTimeout(1000);

        await page.reload();
        const updatedName = await page.isVisible(`td:has-text("Test Child Warehouse UPDATED")`);
        if (updatedName) console.log("✅ Edit Success: Name updated.");
        else console.error("❌ Edit Failed.");
    }

    // 6. Delete Warehouse
    if (isRowVisible) {
        page.on('dialog', async dialog => {
            console.log(`Dialog message: ${dialog.message()}`);
            await dialog.accept();
        });

        const row = page.locator(`tr:has-text("${testCode}")`);
        await row.locator('button[title="Xóa"]').click();
        await page.waitForTimeout(1000); // Wait for API

        await page.reload();
        // Check status or absence. Our soft delete sets status to 'Đã khóa' (Inactive) or removes depending on backend/frontend filtering?
        // Code sets status=0. Frontend shows "Đã khóa".
        const inactiveBadge = await page.isVisible(`tr:has-text("${testCode}") >> span:has-text("Đã khóa")`);

        if (inactiveBadge) console.log("✅ Delete Success: Warehouse marked properly.");
        else console.error("❌ Delete Verification Issue.");
    }

    await page.screenshot({ path: './automation-results/warehouse_crud.png' });
    await browser.close();
})();
