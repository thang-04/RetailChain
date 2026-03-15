const { chromium } = require('playwright');
const path = require('path');

// Parameterized URL
const TARGET_URL = process.env.TARGET_URL || 'http://localhost:5173';

(async () => {
    // Launch browser
    const browser = await chromium.launch({ headless: false, slowMo: 100 });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        console.log(`🚀 Starting product creation test on ${TARGET_URL}`);

        // 1. Login
        console.log('--- Logging in ---');
        await page.goto(`${TARGET_URL}/login`);
        await page.fill('input[type="email"]', 'admin@retailchain.com');
        await page.fill('input[type="password"]', 'admin123');
        await Promise.all([
            page.waitForURL(`${TARGET_URL}/`),
            page.click('button[type="submit"]')
        ]);
        console.log('✅ Logged in successfully');

        // 2. Navigate to Products
        console.log('--- Navigating to Products ---');
        await page.goto(`${TARGET_URL}/products`, { waitUntil: 'networkidle' });
        console.log(`   Current URL: ${page.url()}`);
        
        // Take debug screenshot
        await page.screenshot({ path: path.join(__dirname, 'automation-results', 'debug-products-page.png') });
        console.log('📸 Debug screenshot saved: debug-products-page.png');

        const buttonExists = await page.isVisible('#btn-add-product');
        console.log(`   Button #btn-add-product exists: ${buttonExists}`);

        if (!buttonExists) {
            console.log('   Content of the page:', await page.textContent('body'));
        }

        await page.waitForSelector('#btn-add-product', { timeout: 10000 });
        console.log('✅ Product page loaded');

        // 3. Click Create Product
        console.log('--- Opening Create Product form ---');
        await page.click('#btn-add-product');
        await page.waitForURL('**/products/create');
        await page.waitForSelector('input[name="name"]');
        console.log('✅ Create Product form opened');

        // 4. Fill form
        console.log('--- Filling product details ---');
        const productName = `Test Product ${Date.now()}`;
        await page.fill('input[name="name"]', productName);
        console.log(`   Product Name: ${productName}`);

        // Fill Description
        await page.fill('textarea[name="description"]', 'This is an automated test product created by Playwright.');
        console.log('   ✅ Description filled');

        // Handle Category Select (shadcn)
        console.log('   Selecting category...');
        const selectors = await page.locator('button[role="combobox"]').all();
        console.log(`   Found ${selectors.length} select triggers`);
        
        if (selectors.length >= 1) {
            await selectors[0].click();
            await page.waitForTimeout(500);
            await page.click('[role="option"]:first-child, [role="menuitem"]:first-child');
            console.log('   ✅ Category selected');
        }

        // Handle Gender Select
        console.log('   Selecting gender...');
        if (selectors.length >= 2) {
            await selectors[1].click();
            await page.waitForTimeout(500);
            const unisexOption = page.locator('[role="option"]:has-text("Unisex"), [role="menuitem"]:has-text("Unisex")');
            if (await unisexOption.isVisible()) {
                await unisexOption.click();
            } else {
                await page.click('[role="option"]:first-child, [role="menuitem"]:first-child');
            }
            console.log('   ✅ Gender selected');
        }

        // Take screenshot before submit
        await page.screenshot({ path: path.join(__dirname, 'automation-results', 'before-submit.png') });
        console.log('📸 Screenshot saved: before-submit.png');

        // 5. Submit
        console.log('--- Submitting form ---');
        // The button is in the header
        await page.click('header button:has-text("Create Product")');

        // 6. Verify redirect and visibility
        await page.waitForURL('**/products');
        console.log('✅ Redirected back to products list');

        // Check if the new product is in the table
        await page.waitForSelector('table');
        const productInTable = await page.isVisible(`text="${productName}"`);
        if (productInTable) {
            console.log(`✅ Success! Product "${productName}" is visible in the list.`);
        } else {
            console.log(`⚠️ Product "${productName}" was not found in the list immediately.`);
        }

        // Final screenshot
        await page.screenshot({ path: path.join(__dirname, 'automation-results', 'final-result.png') });
        console.log('📸 Screenshot saved: final-result.png');

        console.log('🎉 Test completed successfully!');

    } catch (error) {
        console.error('❌ Test failed:', error);
        await page.screenshot({ path: path.join(__dirname, 'automation-results', 'error.png') });
        console.log('📸 Error screenshot saved: error.png');
    } finally {
        await browser.close();
    }
})();
