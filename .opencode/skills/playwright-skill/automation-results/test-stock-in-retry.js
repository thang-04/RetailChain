
const { chromium } = require('playwright');

const TARGET_URL = 'http://localhost:5173/stock-in/create';

(async () => {
  console.log('🚀 Starting Test: Create Stock In Flow (Fixed Supplier Selection)');
  const browser = await chromium.launch({ headless: false, slowMo: 500 }); // Slower execution
  const page = await browser.newPage();

  try {
    await page.goto(TARGET_URL);
    console.log('✅ Page loaded');

    // 1. Select Warehouse (Find by label proximity or placeholder)
    console.log('👉 Selecting Warehouse...');
    // Click the trigger that has placeholder "Chọn kho nhập"
    await page.click('button:has-text("Chọn kho nhập")');
    await page.locator('[role="option"]').first().click();
    console.log('✅ Warehouse selected');

    // 2. Select Supplier (Find by placeholder)
    console.log('👉 Selecting Supplier...');
    // Click the trigger that has placeholder "Chọn nhà cung cấp"
    // Note: If value is empty, the button text is the placeholder
    await page.click('button:has-text("Chọn nhà cung cấp")'); 
    await page.waitForSelector('[role="option"]');
    await page.locator('[role="option"]').nth(1).click(); // Select 2nd option (Unilever VN)
    console.log('✅ Supplier selected: Unilever VN');

    // 3. Fill Note
    await page.fill('textarea', 'Test auto import stock via Playwright - Full Fields');

    // 4. Select Product
    console.log('👉 Selecting Product...');
    await page.click('button:has-text("Chọn sản phẩm")');
    await page.locator('[role="option"]').first().click();
    
    console.log('👉 Entering Quantity...');
    await page.fill('input[type="number"]', '100');

    await page.screenshot({ path: './automation-results/stock-in-full-form.png' });

    // 5. Submit
    console.log('👉 Submitting form...');
    await page.click('button:has-text("Lưu Phiếu Nhập")');

    await page.waitForURL('**/stock-in');
    console.log('🎉 SUCCESS: Redirected to /stock-in list page');

  } catch (error) {
    console.error('❌ Error:', error.message);
    await page.screenshot({ path: './automation-results/stock-in-error-retry.png' });
  } finally {
    await browser.close();
  }
})();
