const { chromium } = require('playwright');

const BASE_URL = 'http://localhost:5173';
const UNIQUE_NOTE = `AUTO-TEST-DELETE-${Date.now()}`;

(async () => {
    console.log(`🚀 Starting End-to-End Delete Test with Note: ${UNIQUE_NOTE}`);
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        // --- STEP 1: CREATE A NEW STOCK IN RECEIPT ---
        console.log(`\n[1/3] Creating new Stock In receipt...`);
        await page.goto(`${BASE_URL}/stock-in/create`);
        await page.waitForLoadState('networkidle');

        // 1. Select Supplier
        const supplierSection = page.locator('div.space-y-2').filter({ hasText: 'Nhà Cung Cấp' });
        const supplierTrigger = supplierSection.locator('button[role="combobox"]');
        await supplierTrigger.waitFor({ state: 'visible' });
        await supplierTrigger.click();

        await page.locator('div[role="option"]').first().click();

        // 2. Enter Note
        await page.locator('textarea[placeholder="Nhập ghi chú nhập kho..."]').fill(UNIQUE_NOTE);

        // 3. Select Product
        const productCell = page.locator('table tbody tr').first().locator('td').first();
        const productTrigger = productCell.locator('button[role="combobox"]');
        await productTrigger.click();

        await page.locator('div[role="option"]').first().click();

        // 4. Save
        await page.locator('button:has-text("Lưu Phiếu Nhập")').click();

        // Wait for navigation back to list
        await page.waitForURL(`${BASE_URL}/stock-in`);
        console.log('✅ Created successfully and navigated back to list.');


        // --- STEP 2: VERIFY EXISTENCE VIA DETAILS MODAL ---
        console.log(`\n[2/3] Verifying record exists in list (First Row)...`);

        await page.waitForSelector('table tbody tr');

        const getFirstRowActionBtn = () => page.locator('table tbody tr').first().locator('button').last();

        // Open Actions Menu
        await getFirstRowActionBtn().click();

        // Click "View Details"
        const viewDetailItem = page.locator('div[role="menuitem"]').filter({ hasText: 'View Details' });
        await viewDetailItem.click();

        // Wait for Dialog
        const dialogContent = page.locator('div[role="dialog"]');
        await dialogContent.waitFor({ state: 'visible' });

        // Check Note
        console.log('Checking Note in Detail Modal...');
        const dialogText = await dialogContent.innerText();
        if (!dialogText.includes(UNIQUE_NOTE)) {
            throw new Error(`❌ FAILED: First row content does not contain "${UNIQUE_NOTE}". Content: ${dialogText.substring(0, 100)}...`);
        }
        console.log('✅ Correct record found at top of list.');

        // Close Dialog using ESCAPE
        console.log('Closing dialog with Escape...');
        await page.keyboard.press('Escape');
        await dialogContent.waitFor({ state: 'hidden' });


        // --- STEP 3: DELETE THE RECORD ---
        console.log(`\n[3/3] Deleting the record...`);

        // Open Actions Menu again
        await getFirstRowActionBtn().click();

        // Click "Delete"
        const deleteItem = page.locator('div[role="menuitem"]').filter({ hasText: 'Delete' });

        // Setup dialog handler
        page.once('dialog', async dialog => {
            console.log(`Alert message: ${dialog.message()}`);
            await dialog.accept();
            console.log('✅ Accepted confirmation dialog.');
        });

        await deleteItem.click();

        // Wait for potential UI update
        await page.waitForTimeout(2000);

        // Verify it's gone
        const rowCount = await page.locator('table tbody tr').count();
        if (rowCount === 0) {
            console.log('✅ SUCCESS: Table is empty (record deleted).');
        } else {
            // Check Detail of the NEW first row
            console.log('Verifying the top record is NOT the deleted one...');
            await getFirstRowActionBtn().click();
            await viewDetailItem.click();
            await dialogContent.waitFor({ state: 'visible' });

            const newDialogText = await dialogContent.innerText();

            // Close Dialog
            await page.keyboard.press('Escape');
            await dialogContent.waitFor({ state: 'hidden' });

            if (newDialogText.includes(UNIQUE_NOTE)) {
                throw new Error(`❌ FAILED: Record with note "${UNIQUE_NOTE}" is still present at top of list after delete.`);
            } else {
                console.log('✅ SUCCESS: Top record is different. Deletion successful.');
            }
        }

    } catch (error) {
        console.error('❌ Error occurred:', error);
        process.exit(1);
    } finally {
        await browser.close();
    }
})();
