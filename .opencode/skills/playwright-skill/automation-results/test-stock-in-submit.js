
const { chromium } = require('playwright');

const TARGET_URL = 'http://localhost:5173/stock-in/create';

(async () => {
  console.log('🚀 Starting Test: Create Stock In Flow');
  const browser = await chromium.launch({ headless: false, slowMo: 300 }); // Slow down to see actions
  const page = await browser.newPage();

  try {
    // 1. Go to page
    await page.goto(TARGET_URL);
    console.log('✅ Page loaded');

    // 2. Select Warehouse
    console.log('👉 Selecting Warehouse...');
    await page.waitForSelector('button[role="combobox"]', { state: 'visible' });
    const selects = await page.locator('button[role="combobox"]').all();
    if (selects.length > 0) {
        await selects[0].click(); // First combobox is Warehouse
        // Select first available option
        await page.locator('[role="option"]').first().click();
        console.log('✅ Warehouse selected');
    }

    // 3. Select Supplier (Second combobox)
    console.log('👉 Selecting Supplier...');
    if (selects.length > 1) {
        await selects[1].click();
        await page.locator('[role="option"]').first().click();
        console.log('✅ Supplier selected');
    }

    // 4. Fill Note
    console.log('👉 Filling Note...');
    await page.fill('textarea', 'Test auto import stock via Playwright');

    // 5. Add Item
    console.log('👉 Selecting Product...');
    // Last combobox is Product
    const updatedSelects = await page.locator('button[role="combobox"]').all();
    const productSelect = updatedSelects[updatedSelects.length - 1]; 
    await productSelect.click();
    await page.locator('[role="option"]').first().click();
    console.log('✅ Product selected');

    console.log('👉 Entering Quantity...');
    await page.fill('input[type="number"]', '50');

    await page.screenshot({ path: './automation-results/stock-in-form-filled.png' });

    // 6. Submit
    console.log('👉 Submitting form...');
    await page.click('button:has-text("Lưu Phiếu Nhập")');

    // 7. Verify Redirect
    await page.waitForURL('**/stock-in');
    console.log('🎉 SUCCESS: Redirected to /stock-in list page');
    
    await page.screenshot({ path: './automation-results/stock-in-success.png' });

  } catch (error) {
    console.error('❌ Error:', error.message);
    await page.screenshot({ path: './automation-results/stock-in-error.png' });
  } finally {
    await browser.close();
  }
})();
