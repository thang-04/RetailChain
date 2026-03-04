const { chromium } = require('playwright');
const helpers = require('../lib/helpers');

const TARGET_URL = 'http://localhost:5173'; // Assuming Vite default

(async () => {
    const browser = await chromium.launch({ headless: false, slowMo: 500 });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        console.log('--- Starting User Management Test ---');

        // 1. Go to Login and authenticate as Super Admin
        console.log('1. Logging in as Super Admin...');
        await page.goto(`${TARGET_URL}/login`);
        await page.fill('input[type="email"]', 'superadmin@retailchain.com');
        await page.fill('input[type="password"]', '123');
        await page.click('button[type="submit"]');

        // Wait for dashboard to load
        await page.waitForURL('**/');
        console.log('Login successful.');

        // 2. Navigate to User Management
        console.log('2. Navigating to User Management...');
        await page.click('a[href="/users"]');
        await page.waitForSelector('text=User Management');
        console.log('Reached User Management page.');

        // Take a screenshot of the initial grid
        await page.screenshot({ path: './automation-results/users-initial.png', fullPage: true });

        // 3. Create a Subordinate (Regional Admin)
        console.log('3. Opening Create User dialog...');
        await page.click('button:has-text("Create User")');
        await page.waitForSelector('text=Create New User');

        console.log('Filling out user form...');
        const testUsername = `testra_${Date.now()}`;
        await page.fill('input[name="username"]', testUsername);
        await page.fill('input[name="email"]', `${testUsername}@retailchain.com`);
        await page.fill('input[name="password"]', 'password123');
        await page.fill('input[name="fullName"]', 'Test Regional Admin');

        // Select Role
        await page.click('button[role="combobox"]:has-text("Select a role")');
        await page.click('div[role="option"]:has-text("REGIONAL_ADMIN")');

        // Select Region (appears conditionally)
        await page.click('button[role="combobox"]:has-text("Select region")');
        await page.click('div[role="option"]:has-text("Miền Bắc")');

        // Submit
        console.log('Submit Create User...');
        await page.click('button[type="submit"]:has-text("Create User")');

        // Wait for modal to close and list to update
        await page.waitForTimeout(2000);
        console.log('User created. Verifying in list...');

        // Check if new user is in the list
        await page.waitForSelector(`text=${testUsername}`);
        await page.screenshot({ path: './automation-results/users-after-create.png', fullPage: true });
        console.log('User found in table.');

        // 4. Toggle Block status
        console.log('4. Testing Block Toggle...');
        // Find the row containing the test user and click block
        const row = page.locator('tr').filter({ hasText: testUsername });
        const blockBtn = row.locator('button[title="Block User"]');
        await blockBtn.click();

        await page.waitForTimeout(1000);
        console.log('Verified user blocked.');
        await page.screenshot({ path: './automation-results/users-blocked.png', fullPage: true });

        // 5. Unblock
        console.log('5. Testing Unblock...');
        const unblockBtn = row.locator('button[title="Unblock User"]');
        await unblockBtn.click();
        await page.waitForTimeout(1000);
        console.log('Verified user unblocked.');

        console.log('--- Test Completed Successfully ---');

    } catch (error) {
        console.error('❌ Error during test:', error);
        await page.screenshot({ path: './automation-results/error-screenshot.png', fullPage: true });
    } finally {
        console.log('Closing browser...');
        await browser.close();
    }
})();
