
const { chromium } = require('playwright');
(async () => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    try {
        await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle', timeout: 30000 });
        await page.fill('input[type=" email\]', 'superadmin@retailchain.com');
 await page.fill('input[type=\password\]', '123');
 await page.click('button[type=\submit\]');
 await page.waitForURL('**/');
 
 await page.click('a[href=\/roles\]');
 await page.waitForSelector('text=Roles', { timeout: 10000 });
 
 const roleCount = await page.locator('div.cursor-pointer').count();
 console.log('ROLE COUNT FOUND:', roleCount);
 
 await page.screenshot({ path: 'role-permission-check.png' });
 
 if (roleCount > 0) {
 console.log('SUCCESS: Roles are visible again.');
 } else {
 console.log('FAILURE: Roles list is still empty.');
 }
 } catch (err) {
 console.error('TEST ERROR:', err.message);
 await page.screenshot({ path: 'role-permission-error.png' });
 } finally {
 await browser.close();
 }
})();
