const { chromium } = require('playwright');

const FRONTEND_URL = 'http://localhost:9000';
const BACKEND_URL = 'http://localhost:8080/retail-chain';

(async () => {
  console.log('🧪 Testing Stock Out Form...\n');

  const browser = await chromium.launch({ headless: false, slowMo: 100 });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Listen for console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('❌ Console Error:', msg.text());
    }
  });

  page.on('pageerror', error => {
    console.log('❌ Page Error:', error.message);
  });

  try {
    // 1. Navigate to Stock Out page
    console.log('1️⃣ Navigating to Stock Out page...');
    await page.goto(`${FRONTEND_URL}/stock-out`);
    await page.waitForLoadState('networkidle');
    console.log('   ✅ Page loaded');

    // 2. Click Create Stock Out button
    console.log('\n2️⃣ Clicking "Tạo Phiếu Xuất"...');
    await page.click('a[href="/stock-out/create"]');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    console.log('   ✅ Navigate to create page');

    // 3. Check if warehouses loaded
    console.log('\n3️⃣ Checking warehouses loaded...');
    const warehouseInput = await page.locator('input[disabled]').first();
    const warehouseValue = await warehouseInput.inputValue();
    console.log('   Source Warehouse:', warehouseValue);

    // 4. Select target warehouse
    console.log('\n4️⃣ Selecting target warehouse...');
    await page.click('text=Kho Xuất (Kho Tổng)');
    await page.waitForTimeout(500);

    // 5. Add a product
    console.log('\n5️⃣ Adding product to list...');
    const addButton = await page.locator('button:has-text("Thêm Sản Phẩm")');
    if (await addButton.isVisible()) {
      await addButton.click();
      await page.waitForTimeout(500);
    }

    // 6. Select first available product
    console.log('\n6️⃣ Selecting product...');
    const productSelects = await page.locator('[role="combobox"]:below(:text("Sản Phẩm"))').all();
    if (productSelects.length > 0) {
      await productSelects[0].click();
      await page.waitForTimeout(300);
      await page.click('[role="option"]:first-child');
      await page.waitForTimeout(300);
      console.log('   ✅ Product selected');
    }

    // 7. Set quantity
    console.log('\n7️⃣ Setting quantity...');
    const quantityInputs = await page.locator('input[type="number"]').all();
    if (quantityInputs.length > 1) {
      await quantityInputs[1].fill('5');
      console.log('   ✅ Quantity set to 5');
    }

    // 8. Submit form
    console.log('\n8️⃣ Submitting form...');
    const submitButton = await page.locator('button:has-text("Lưu Phiếu Xuất")');
    if (await submitButton.isEnabled()) {
      await submitButton.click();
      console.log('   ⏳ Waiting for response...');

      // Wait for navigation or error
      await page.waitForTimeout(3000);

      // Check current URL
      const currentUrl = page.url();
      console.log('   Current URL:', currentUrl);

      if (currentUrl.includes('/stock-out')) {
        console.log('   ✅ Navigation back to list - SUCCESS!');
      } else {
        // Check for error messages
        const errorTexts = await page.locator('text*=Error').all();
        if (errorTexts.length > 0) {
          console.log('   ❌ Error displayed:', errorTexts[0].textContent());
        } else {
          console.log('   ⚠️ Form submitted but no clear success/error');
        }
      }
    } else {
      console.log('   ❌ Submit button is disabled');
    }

  } catch (error) {
    console.error('\n❌ Test Error:', error.message);
  } finally {
    console.log('\n🔍 Taking screenshot...');
    await page.screenshot({
      path: './automation-results/stockout-test-result.png',
      fullPage: true
    });
    console.log('📸 Screenshot saved to ./automation-results/stockout-test-result.png');

    await browser.close();
  }
})();
