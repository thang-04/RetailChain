const { chromium } = require('playwright');
const { expect } = require('@playwright/test');

const TARGET_URL = 'http://localhost:5173';
const NOTE_TEXT = 'PLAYWRIGHT-TEST-' + Date.now();

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 100 });
  const page = await browser.newPage();

  try {
    console.log('Navigating to create stock-in page...');
    await page.goto(`${TARGET_URL}/stock-in/create`);
    
    console.log('Waiting for all network requests to settle...');
    await page.waitForLoadState('networkidle', { timeout: 20000 });

    console.log('Network is idle. Now looking for the dropdown...');
    const firstDropdownTrigger = page.locator('div[role="combobox"]:has-text("Chọn sản phẩm")').first();
    await expect(firstDropdownTrigger).toBeVisible({ timeout: 5000 });

    console.log('Dropdown is visible. Selecting the first product...');
    await firstDropdownTrigger.click();
    await page.locator('div[role="option"]').first().click();

    console.log('Filling in quantity...');
    const quantityInput = page.locator('input[type="number"]').first();
    await quantityInput.fill('99');
    
    console.log('Filling in note for identification...');
    await page.locator('textarea[placeholder="Nhập ghi chú nhập kho..."]').fill(NOTE_TEXT);

    console.log('Saving the receipt...');
    const saveButton = page.locator('button:has-text("Lưu Phiếu Nhập")');
    await expect(saveButton).toBeEnabled();
    await saveButton.click();
    
    console.log('Waiting for navigation to stock-in list...');
    await page.waitForURL(`${TARGET_URL}/stock-in`, { timeout: 10000 });
    
    console.log('✅ Successfully created and redirected. Now verifying...');
    
    // Find row based on the unique note
    const newRecordRow = page.locator(`tr:has-text("${NOTE_TEXT}")`).first();
    await expect(newRecordRow).toBeVisible({ timeout: 10000 });
    
    const documentCode = await newRecordRow.locator('td').nth(1).textContent();
    console.log(`✅ Verification successful! Found new receipt with note: ${NOTE_TEXT}. Document Code: ${documentCode}`);
    
    // Store outputs for the next step
    console.log(`::set-output name=documentCode::${documentCode.trim()}`);
    console.log(`::set-output name=noteText::${NOTE_TEXT}`);

  } catch (error) {
    console.error('❌ Automation script failed:', error);
    await page.screenshot({ path: './automation-results/error-create-receipt-final.png', fullPage: true });
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
