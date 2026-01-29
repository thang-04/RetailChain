
const { chromium } = require('playwright');

const TARGET_URL = 'http://localhost:5173/stock-in/create';

(async () => {
  console.log('🚀 Starting Test: Create Stock In Page');
  const browser = await chromium.launch({ headless: false }); // Show browser
  const page = await browser.newPage();

  try {
    // 1. Go to page
    await page.goto(TARGET_URL);
    console.log('✅ Page loaded');

    // 2. Wait for data loading (Warehouses & Products)
    // Wait for the Select trigger to be enabled/visible
    await page.waitForSelector('button[role="combobox"]', { state: 'visible', timeout: 10000 });
    console.log('✅ Select components visible');

    // 3. Click Warehouse Dropdown
    console.log('👉 Opening Warehouse Dropdown...');
    // The first combobox is usually Warehouse (based on order in code)
    const selects = await page.locator('button[role="combobox"]').all();
    if (selects.length > 0) {
        await selects[0].click();
        await page.waitForTimeout(1000); // Wait for animation
        await page.screenshot({ path: './automation-results/1-warehouse-dropdown.png' });
        
        // Select first warehouse option if available
        const options = await page.locator('[role="option"]').all();
        if (options.length > 0) {
            console.log(`   Found ${options.length} warehouses`);
            await options[0].click(); 
        } else {
            console.warn('⚠️ No warehouses found in dropdown');
             // Close dropdown if empty
            await page.keyboard.press('Escape');
        }
    }

    // 4. Click Product Dropdown (in the table)
    console.log('👉 Opening Product Dropdown...');
    // The last combobox in the list is likely the product one (or locate by table cell)
    // Refresh selects handle
    const updatedSelects = await page.locator('button[role="combobox"]').all();
    const productSelect = updatedSelects[updatedSelects.length - 1]; // Assume last one is product
    
    await productSelect.click();
    await page.waitForTimeout(1000); 

    // Check content of product dropdown
    const productOptions = await page.locator('[role="option"]').all();
    console.log(`✅ Found ${productOptions.length} product variants`);
    
    let foundMockData = false;
    for (const opt of productOptions) {
        const text = await opt.textContent();
        // Check for our inserted data (P001, P002...)
        if (text.includes('P001') || text.includes('P002')) {
            console.log(`   found matching item: ${text}`);
            foundMockData = true;
            break;
        }
    }

    if (foundMockData) {
        console.log('🎉 SUCCESS: Real product data is visible!');
    } else {
        console.error('❌ FAILURE: Could not find mock product data (P001/P002)');
    }

    await page.screenshot({ path: './automation-results/2-product-dropdown.png' });

  } catch (error) {
    console.error('❌ Error:', error.message);
    await page.screenshot({ path: './automation-results/error.png' });
  } finally {
    await browser.close();
  }
})();
