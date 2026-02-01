const { chromium } = require('playwright');

const FRONTEND_URL = 'http://localhost:5173'; // Common Vite port
const BACKEND_URL = 'http://localhost:8080/retail-chain';

(async () => {
  console.log('🧪 Testing Stock Out API directly via Frontend...\n');

  const browser = await chromium.launch({ headless: false, slowMo: 100 });
  const page = await browser.newPage();

  // Listen for network requests
  const apiCalls = [];

  page.on('request', request => {
    if (request.url().includes('/api/inventory')) {
      apiCalls.push({
        url: request.url(),
        method: request.method(),
        postData: request.postData()
      });
      console.log('📡 API Call:', request.method(), request.url());
    }
  });

  page.on('response', response => {
    if (response.url().includes('/api/inventory')) {
      console.log('📥 API Response:', response.status(), response.url());
    }
  });

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('❌ Console Error:', msg.text());
    }
  });

  try {
    // Try different frontend ports
    const ports = [5173, 3000, 3001, 5174];

    let foundPort = null;
    for (const port of ports) {
      console.log(`\n🔍 Trying port ${port}...`);
      try {
        const response = await page.goto(`http://localhost:${port}`, { waitUntil: 'domcontentloaded', timeout: 3000 });
        if (response && response.status() === 200) {
          foundPort = port;
          console.log(`   ✅ Found frontend at port ${port}`);
          break;
        }
      } catch (e) {
        // Port not available
      }
    }

    if (!foundPort) {
      console.log('\n⚠️ Frontend not found on common ports, testing with Playwright directly...');
    }

    // Now test the API directly to identify the issue
    console.log('\n🧪 Direct API Tests...\n');

    // Test 1: Get warehouses
    console.log('1️⃣ Testing GET /api/inventory/warehouse');
    const warehouseResponse = await page.request.get(`${BACKEND_URL}/api/inventory/warehouse`);
    console.log('   Status:', warehouseResponse.status());
    const warehouseData = await warehouseResponse.json();
    console.log('   Data:', JSON.stringify(warehouseData).substring(0, 200));

    // Test 2: Try export stock with sample data
    console.log('\n2️⃣ Testing POST /api/inventory/export with valid data');
    const exportPayload = {
      warehouseId: warehouseData.data?.[0]?.id || 1,
      note: 'Test from Playwright',
      items: [{ variantId: 1, quantity: 1 }]
    };

    const exportResponse = await page.request.post(`${BACKEND_URL}/api/inventory/export`, {
      data: exportPayload,
      headers: { 'Content-Type': 'application/json' }
    });
    console.log('   Status:', exportResponse.status());
    const exportResult = await exportResponse.json();
    console.log('   Result:', JSON.stringify(exportResult));

    // Test 3: Try transfer stock
    console.log('\n3️⃣ Testing POST /api/inventory/transfer');
    const warehouses = warehouseData.data || [];
    const sourceWarehouse = warehouses.find(w => w.warehouseType === 1);
    const targetWarehouse = warehouses.find(w => w.warehouseType === 2);

    if (sourceWarehouse && targetWarehouse) {
      const transferPayload = {
        sourceWarehouseId: sourceWarehouse.id,
        targetWarehouseId: targetWarehouse.id,
        note: 'Test transfer from Playwright',
        items: [{ variantId: 1, quantity: 1 }]
      };

      const transferResponse = await page.request.post(`${BACKEND_URL}/api/inventory/transfer`, {
        data: transferPayload,
        headers: { 'Content-Type': 'application/json' }
      });
      console.log('   Status:', transferResponse.status());
      const transferResult = await transferResponse.json();
      console.log('   Result:', JSON.stringify(transferResult));
    } else {
      console.log('   ⚠️ Need Central Warehouse (Type 1) and Store Warehouse (Type 2) for transfer test');
      console.log('   Available warehouses:', warehouses.map(w => `${w.name} (Type ${w.warehouseType})`).join(', '));
    }

  } catch (error) {
    console.error('\n❌ Test Error:', error.message);
  } finally {
    console.log('\n📸 Taking screenshot...');
    await page.screenshot({
      path: './automation-results/api-test-result.png',
      fullPage: true
    });
    console.log('📸 Screenshot saved');

    await browser.close();
  }
})();
