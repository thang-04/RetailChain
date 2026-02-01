const { chromium } = require('playwright');
const { expect } = require('@playwright/test');

const TARGET_URL = 'http://localhost:5173';
const DOCUMENT_CODE_TO_DELETE = 'TEST-DEL-E2E';

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 150 });
  const page = await browser.newPage();

  try {
    console.log(`Navigating to stock-in list to find document: ${DOCUMENT_CODE_TO_DELETE}`);
    await page.goto(`${TARGET_URL}/stock-in`);
    
    await page.waitForLoadState('networkidle');

    const rowToDelete = page.locator(`tr:has-text("${DOCUMENT_CODE_TO_DELETE}")`);
    await expect(rowToDelete).toBeVisible({ timeout: 10000 });
    console.log(`Found row for document ${DOCUMENT_CODE_TO_DELETE}.`);

    // Click the 'More' button to open the dropdown
    await rowToDelete.locator('button[aria-haspopup="menu"]').click();
    
    // Set up a listener for the dialog/confirm prompt BEFORE clicking delete
    page.on('dialog', dialog => {
        console.log(`Dialog message: ${dialog.message()}`);
        dialog.accept();
        console.log('Accepted the confirmation dialog.');
    });

    console.log('Clicking the delete button...');
    await page.locator('div[role="menuitem"]:has-text("Delete")').click();

    console.log('Waiting for the row to disappear...');
    await expect(rowToDelete).not.toBeVisible({ timeout: 10000 });
    
    console.log(`✅ Verification successful! Row for document ${DOCUMENT_CODE_TO_DELETE} has been removed from the UI.`);

  } catch (error) {
    console.error('❌ Automation script failed during deletion:', error);
    await page.screenshot({ path: './automation-results/error-delete-receipt.png', fullPage: true });
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
