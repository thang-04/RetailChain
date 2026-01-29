
const { chromium } = require('playwright');

const TARGET_URL = 'http://localhost:5173/stock-in/create';

(async () => {
  console.log('🚀 Starting Test: Create Stock In with Supplier (E2E)');
  const browser = await chromium.launch({ headless: false, slowMo: 500 });
  const page = await browser.newPage();

  try {
    await page.goto(TARGET_URL);
    console.log('✅ Page loaded');

    // 1. Select Warehouse
    console.log('👉 Selecting Warehouse...');
    await page.click('button:has-text("Chọn kho nhập")');
    await page.locator('[role="option"]').first().click();
    console.log('✅ Warehouse selected');

    // 2. Select Supplier (CRITICAL STEP)
    console.log('👉 Selecting Supplier...');
    // Locate the supplier dropdown by placeholder
    const supplierTrigger = page.locator('button:has-text("Chọn nhà cung cấp")');
    
    // Check if suppliers loaded
    if (await supplierTrigger.isVisible()) {
        await supplierTrigger.click();
        await page.waitForSelector('[role="option"]');
        
        const options = await page.locator('[role="option"]').all();
        console.log(`   Found ${options.length} suppliers in dropdown`);
        
        if (options.length > 0) {
            const firstOptionText = await options[0].textContent();
            console.log(`   Selecting supplier: ${firstOptionText}`);
            await options[0].click(); // Select Vinamilk (id=1)
            console.log('✅ Supplier selected successfully');
        } else {
            throw new Error('No suppliers found in dropdown! API might be failing.');
        }
    } else {
        throw new Error('Supplier dropdown not visible');
    }

    // 3. Fill Note
    await page.fill('textarea', 'E2E Test: Import from Supplier via Playwright');

    // 4. Select Product
    console.log('👉 Selecting Product...');
    await page.click('button:has-text("Chọn sản phẩm")');
    await page.locator('[role="option"]').first().click(); // Select first product (P001)
    
    console.log('👉 Entering Quantity...');
    await page.fill('input[type="number"]', '50');

    await page.screenshot({ path: './automation-results/stock-in-supplier-form.png' });

    // 5. Submit
    console.log('👉 Submitting form...');
    await page.click('button:has-text("Lưu Phiếu Nhập")');

    await page.waitForURL('**/stock-in');
    console.log('🎉 SUCCESS: Redirected to /stock-in list page');
    
    await page.screenshot({ path: './automation-results/stock-in-supplier-success.png' });

  } catch (error) {
    console.error('❌ Error:', error.message);
    await page.screenshot({ path: './automation-results/stock-in-supplier-error.png' });
  } finally {
    await browser.close();
  }
})();
