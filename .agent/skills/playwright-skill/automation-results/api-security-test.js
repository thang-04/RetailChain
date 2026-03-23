/**
 * RetailChain API Security & Smoke Test v2
 * ==========================================
 * Correct endpoints: /api/user, /api/supplier, /api/stock-request
 * Context path: /retail-chain
 */

const BASE_URL = 'http://localhost:8080/retail-chain';

// ============ HTTP Helper ============
async function apiCall(method, path, body = null, token = null) {
  const url = `${BASE_URL}${path}`;
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const options = { method, headers };
  if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH' || method === 'DELETE')) {
    options.body = JSON.stringify(body);
  }
  try {
    const res = await fetch(url, options);
    const text = await res.text();
    let data = null;
    try { data = JSON.parse(text); } catch { data = text; }
    return { status: res.status, data, ok: res.ok };
  } catch (e) {
    return { status: 0, data: null, error: e.message, ok: false };
  }
}

// ============ Test Runner ============
const results = { passed: 0, failed: 0, errors: [], tests: [] };

function logTest(category, testName, expected, actual, passed, detail = '') {
  const icon = passed ? '✅' : '❌';
  results.tests.push({ category, testName, expected, actual, passed, detail });
  if (passed) results.passed++; else { results.failed++; results.errors.push({ category, testName, expected, actual, passed, detail }); }
  console.log(`${icon} [${category}] ${testName} | expected=${expected} actual=${actual} ${detail ? '| ' + detail : ''}`);
}

async function login(email, password) {
  const res = await apiCall('POST', '/api/auth/login', { email, password });
  if (res.status === 200 && res.data?.data) {
    return { token: res.data.data.accessToken || res.data.data.token, user: res.data.data.user, ok: true };
  }
  return { token: null, user: null, ok: false, raw: res };
}

// ============ MAIN ============
(async () => {
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║   RETAILCHAIN API SECURITY & SMOKE TEST SUITE v2       ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
  console.log(`Target: ${BASE_URL} | Time: ${new Date().toISOString()}\n`);

  // ──── STEP 1: Login Admin ────
  console.log('═══ STEP 1: LOGIN ═══');
  const admin = await login('admin@retailchain.com', 'admin123');
  logTest('AUTH', 'Super Admin login', 'ok', `${admin.ok}`, admin.ok, `userId=${admin.user?.id}`);
  if (!admin.ok) { console.log('FATAL: Admin login failed'); process.exit(1); }
  const AT = admin.token;

  // ──── STEP 2: Get existing data ────
  console.log('\n═══ STEP 2: DISCOVER EXISTING DATA ═══');

  // Roles
  const rolesRes = await apiCall('GET', '/api/roles', null, AT);
  logTest('SETUP', 'GET /api/roles', '200', rolesRes.status, rolesRes.status === 200);
  const roles = rolesRes.data?.data || [];
  const mgrRoleId = roles.find(r => r.code === 'STORE_MANAGER')?.id;
  const staffRoleId = roles.find(r => r.code === 'STAFF')?.id;
  console.log(`   Roles: STORE_MANAGER=${mgrRoleId}, STAFF=${staffRoleId}`);

  // Stores
  const storesRes = await apiCall('GET', '/api/stores', null, AT);
  const stores = storesRes.data?.data || [];
  const storeId = stores[0]?.id;
  const storeSlug = stores[0]?.slug || stores[0]?.code;
  logTest('SETUP', 'GET /api/stores', '200', storesRes.status, storesRes.status === 200, `storeId=${storeId}, slug=${storeSlug}`);

  // Users (correct endpoint: /api/user)
  const usersRes = await apiCall('GET', '/api/user', null, AT);
  logTest('SETUP', 'GET /api/user', '200', usersRes.status, usersRes.status === 200);
  const allUsers = usersRes.data?.data || [];
  console.log(`   Total users: ${allUsers.length}`);

  // Find existing manager / staff
  let mgrUser = allUsers.find(u => (u.roles || []).some(r => r.code === 'STORE_MANAGER'));
  let staffUser = allUsers.find(u => (u.roles || []).some(r => r.code === 'STAFF'));

  // Create manager if needed
  if (!mgrUser && mgrRoleId) {
    const ts = Date.now();
    const email = `mgr_${ts}@retailchain.com`;
    const res = await apiCall('POST', '/api/user', {
      username: `mgr_${ts}`, email, password: 'Test@123456',
      fullName: 'Test Manager', roleIds: [mgrRoleId], storeId
    }, AT);
    if (res.status === 200 && res.data?.data) {
      mgrUser = { id: res.data.data.id, email };
      logTest('SETUP', 'Create manager', '200', res.status, true, `id=${mgrUser.id}`);
    } else {
      logTest('SETUP', 'Create manager', '200', res.status, false, JSON.stringify(res.data).substring(0, 200));
    }
  } else if (mgrUser) {
    console.log(`   Found existing manager: id=${mgrUser.id}, email=${mgrUser.email}`);
  }

  // Create staff if needed
  if (!staffUser && staffRoleId) {
    const ts = Date.now();
    const email = `staff_${ts}@retailchain.com`;
    const res = await apiCall('POST', '/api/user', {
      username: `staff_${ts}`, email, password: 'Test@123456',
      fullName: 'Test Staff', roleIds: [staffRoleId], storeId
    }, AT);
    if (res.status === 200 && res.data?.data) {
      staffUser = { id: res.data.data.id, email };
      logTest('SETUP', 'Create staff', '200', res.status, true, `id=${staffUser.id}`);
    } else {
      logTest('SETUP', 'Create staff', '200', res.status, false, JSON.stringify(res.data).substring(0, 200));
    }
  } else if (staffUser) {
    console.log(`   Found existing staff: id=${staffUser.id}, email=${staffUser.email}`);
  }

  // Login as manager & staff (password might be default or 'Test@123456')
  let MT = null, ST = null;
  if (mgrUser?.email) {
    for (const pwd of ['Test@123456', 'admin123', 'password', 'Password@123']) {
      const res = await login(mgrUser.email, pwd);
      if (res.ok) { MT = res.token; logTest('AUTH', 'Manager login', 'ok', 'true', true, `email=${mgrUser.email}`); break; }
    }
    if (!MT) logTest('AUTH', 'Manager login', 'ok', 'false', false, `Could not login manager ${mgrUser.email}`);
  }
  if (staffUser?.email) {
    for (const pwd of ['Test@123456', 'admin123', 'password', 'Password@123']) {
      const res = await login(staffUser.email, pwd);
      if (res.ok) { ST = res.token; logTest('AUTH', 'Staff login', 'ok', 'true', true, `email=${staffUser.email}`); break; }
    }
    if (!ST) logTest('AUTH', 'Staff login', 'ok', 'false', false, `Could not login staff ${staffUser.email}`);
  }

  // ──── STEP 3: ADMIN Smoke Tests ────
  console.log('\n═══ STEP 3: SUPER_ADMIN SMOKE TESTS ═══');
  
  const adminEndpoints = [
    ['GET', '/api/roles', 'Roles'],
    ['GET', '/api/permissions', 'Permissions'],
    ['GET', '/api/user', 'Users list'],
    ['GET', '/api/stores', 'Stores list'],
    ['GET', '/api/warehouse', 'Warehouses list'],
    ['GET', '/api/warehouse/central', 'Central warehouse'],
    ['GET', '/api/product', 'Products list'],
    ['GET', '/api/product/categories', 'Categories'],
    ['GET', '/api/inventory/overview', 'Inventory overview'],
    ['GET', '/api/shifts', 'Shifts'],
    ['GET', '/api/shifts/templates', 'Shift templates'],
    ['GET', '/api/dashboard/summary', 'Dashboard summary'],
    ['GET', '/api/supplier', 'Suppliers'],
    ['GET', '/api/attendance/dashboard/all', 'Attendance dashboard all'],
    ['GET', '/api/stock-request/pending', 'Stock requests pending'],
    ['GET', '/api/user/me', 'Current user (me)'],
  ];
  
  for (const [method, path, name] of adminEndpoints) {
    const res = await apiCall(method, path, null, AT);
    logTest('ADMIN', `${method} ${path} (${name})`, '200', res.status, res.status === 200,
      res.status !== 200 ? JSON.stringify(res.data).substring(0, 100) : '');
  }

  if (storeSlug) {
    const res = await apiCall('GET', `/api/stores/${storeSlug}`, null, AT);
    logTest('ADMIN', `GET /api/stores/${storeSlug}`, '200', res.status, res.status === 200);
  }
  if (storeId) {
    const res = await apiCall('GET', `/api/stores/${storeId}/staff-list`, null, AT);
    logTest('ADMIN', `GET /api/stores/${storeId}/staff-list`, '200', res.status, res.status === 200,
      `count=${res.data?.data?.length || 0}`);
    
    const attDash = await apiCall('GET', `/api/attendance/dashboard/${storeId}`, null, AT);
    logTest('ADMIN', `GET /api/attendance/dashboard/${storeId}`, '200', attDash.status, attDash.status === 200);
  }

  // ──── STEP 4: MANAGER Smoke + Negative Tests ────
  console.log('\n═══ STEP 4: STORE_MANAGER TESTS ═══');

  if (MT) {
    // Should have access
    const mgrAccess = [
      ['GET', '/api/stores', 'Stores'],
      ['GET', '/api/product', 'Products'],
      ['GET', '/api/inventory/overview', 'Inventory'],
      ['GET', '/api/user', 'Users'],
      ['GET', '/api/supplier', 'Suppliers'],
    ];
    for (const [m, p, n] of mgrAccess) {
      const r = await apiCall(m, p, null, MT);
      logTest('MGR_OK', `${m} ${p} (${n})`, '200', r.status, r.status === 200);
    }

    // Should NOT have access (negative tests)
    console.log('  --- Negative tests (should be 403) ---');
    
    const mgrNeg = [
      ['POST', '/api/product', { name: 'Hack', code: 'HACK' }, 'Create product (no PRODUCT_CREATE)'],
      ['PUT', '/api/product/test-slug', { name: 'Hack' }, 'Update product (no PRODUCT_UPDATE)'],
      ['DELETE', '/api/product/999', null, 'Delete product (no PRODUCT_DELETE)'],
      ['POST', '/api/warehouse', { name: 'Hack WH' }, 'Create warehouse (no WAREHOUSE_CREATE)'],
      ['PUT', '/api/warehouse/999', { name: 'Hack' }, 'Update warehouse (no WAREHOUSE_UPDATE)'],
      ['DELETE', '/api/warehouse/999', null, 'Delete warehouse (no WAREHOUSE_DELETE)'],
      ['GET', '/api/roles', null, 'View roles (no ROLE_VIEW)'],
      ['POST', '/api/stores', { name: 'Hack' }, 'Create store (no STORE_CREATE)'],
    ];
    for (const [m, p, b, n] of mgrNeg) {
      const r = await apiCall(m, p, b, MT);
      logTest('MGR_NEG', `${m} ${p} -> ${n}`, '403', r.status, r.status === 403,
        r.status !== 403 ? `🔴 ACCESS GRANTED (should be denied!)` : '');
    }
  } else {
    logTest('MGR_OK', 'Manager tests SKIPPED', 'token', 'none', false);
  }

  // ──── STEP 5: STAFF Smoke + Negative Tests ────
  console.log('\n═══ STEP 5: STAFF TESTS ═══');

  if (ST) {
    // Should have access
    const stfAccess = [
      ['GET', '/api/stores', 'Stores'],
      ['GET', '/api/product', 'Products'],
      ['GET', '/api/inventory/overview', 'Inventory'],
      ['GET', '/api/user/me', 'My profile'],
    ];
    for (const [m, p, n] of stfAccess) {
      const r = await apiCall(m, p, null, ST);
      logTest('STF_OK', `${m} ${p} (${n})`, '200', r.status, r.status === 200);
    }

    // Should NOT have access
    console.log('  --- Negative tests (should be 403) ---');
    
    const stfNeg = [
      ['GET', '/api/roles', null, 'View roles'],
      ['GET', '/api/permissions', null, 'View permissions'],
      ['GET', '/api/user', null, 'List all users'],
      ['POST', '/api/user', { username: 'h', email: 'h@h.com', password: '123456', fullName: 'H' }, 'Create user'],
      ['POST', '/api/stores', { name: 'Hack' }, 'Create store'],
      ['POST', '/api/warehouse', { name: 'Hack' }, 'Create warehouse'],
      ['DELETE', '/api/warehouse/1', null, 'Delete warehouse'],
      ['POST', '/api/product', { name: 'Hack' }, 'Create product'],
      ['PUT', '/api/product/slug', { name: 'Hack' }, 'Update product'],
      ['DELETE', '/api/product/1', null, 'Delete product'],
    ];
    for (const [m, p, b, n] of stfNeg) {
      const r = await apiCall(m, p, b, ST);
      logTest('STF_NEG', `${m} ${p} -> ${n}`, '403', r.status, r.status === 403,
        r.status !== 403 ? `🔴 SECURITY HOLE: Staff has access!` : '');
    }
  } else {
    logTest('STF_OK', 'Staff tests SKIPPED', 'token', 'none', false);
  }

  // ──── STEP 6: P0 SECURITY REGRESSION ────
  console.log('\n═══ STEP 6: P0 SECURITY REGRESSION (KNOWN VULNERABILITIES) ═══');
  console.log('Testing endpoints missing @PreAuthorize...\n');

  // Using staff token (lowest privilege) to probe sensitive endpoints
  const PROBE = ST || MT; // Use lowest privilege available
  const probeRole = ST ? 'STAFF' : (MT ? 'MANAGER' : null);

  if (PROBE && storeId) {
    const secTests = [
      // AttendanceController - NO @PreAuthorize
      ['GET', `/api/attendance/store/${storeId}`, null, `Store attendance by ${probeRole}`],
      ['GET', `/api/attendance/dashboard/${storeId}`, null, `Store att dashboard by ${probeRole}`],
      ['GET', '/api/attendance/dashboard/all', null, `ALL att dashboard by ${probeRole}`],
      ['PUT', '/api/attendance/999/edit', { checkInTime: '08:00' }, `Edit attendance by ${probeRole}`],
      ['POST', '/api/attendance/manual?userId=1', { storeId }, `Manual attendance by ${probeRole}`],
      ['GET', `/api/attendance/user/1?storeId=${storeId}`, null, `User att history by ${probeRole}`],
      
      // ShiftController - NO @PreAuthorize
      ['GET', '/api/shifts', null, `List all shifts by ${probeRole}`],
      ['POST', '/api/shifts', { name: 'Probe', startTime: '08:00', endTime: '16:00' }, `Create shift by ${probeRole}`],
      ['POST', '/api/shifts/assign', { shiftIds: [1], userId: 1, dates: ['2026-03-25'] }, `Assign shift by ${probeRole}`],
      ['POST', '/api/shifts/auto-assign', { storeId, from: '2026-03-25', to: '2026-03-31', createdBy: 1 }, `Auto-assign by ${probeRole}`],
      ['POST', '/api/shifts/confirm-drafts', { storeId, from: '2026-03-25', to: '2026-03-31', confirmedBy: 1 }, `Confirm drafts by ${probeRole}`],
      ['GET', `/api/shifts/store/${storeId}`, null, `Shifts by store by ${probeRole}`],
      ['GET', '/api/shifts/templates', null, `Shift templates by ${probeRole}`],
      [`POST`, `/api/shifts/store/${storeId}/import-templates`, [1], `Import templates by ${probeRole}`],
      
      // StaffQuotaController - NO @PreAuthorize
      ['GET', `/api/staff-quotas?storeId=${storeId}`, null, `Staff quotas by ${probeRole}`],
      ['PUT', '/api/staff-quotas', [{ userId: 1, storeId, minShiftsPerWeek: 1, maxShiftsPerWeek: 7 }], `Upsert quotas by ${probeRole}`],
      
      // StoreController#getStoreStaffList - NO @PreAuthorize
      ['GET', `/api/stores/${storeId}/staff-list`, null, `Store staff list by ${probeRole}`],
      
      // ProductController#createProductVariants - NO @PreAuthorize
      ['POST', '/api/product/1/variants', { options: [{ name: 'Probe', values: ['X'] }] }, `Create variants by ${probeRole}`],
      
      // WarehouseController#getCentralWarehouse - NO @PreAuthorize
      ['GET', '/api/warehouse/central', null, `Central warehouse by ${probeRole}`],
    ];

    for (const [m, p, b, n] of secTests) {
      const r = await apiCall(m, p, b, PROBE);
      const isBlocked = r.status === 403;
      logTest('SEC_P0', `${m} ${p.substring(0, 50)} -> ${n}`,
        '403 (should block)', r.status, isBlocked,
        !isBlocked ? `🔴 VULNERABILITY CONFIRMED! Returns ${r.status}` : '✅ Properly restricted');
    }
  } else if (!PROBE) {
    console.log('⚠️  No staff/manager token available for security probing');
  }

  // ──── Unauthenticated tests ────
  console.log('\n--- Unauthenticated Access Tests ---');
  const noAuthPaths = [
    '/api/stores', '/api/user', '/api/roles', '/api/warehouse',
    '/api/product', '/api/shifts', '/api/attendance/dashboard/all',
    '/api/staff-quotas?storeId=1', '/api/supplier',
    '/api/stock-request/pending',
  ];
  for (const p of noAuthPaths) {
    const r = await apiCall('GET', p);
    logTest('NO_AUTH', `GET ${p}`, '401/403', r.status,
      r.status === 401 || r.status === 403,
      (r.status !== 401 && r.status !== 403) ? `🔴 OPEN without auth!` : 'Blocked');
  }

  // ════════════════ FINAL REPORT ════════════════
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║                    FINAL REPORT                          ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
  console.log(`Total: ${results.passed + results.failed} | ✅ Passed: ${results.passed} | ❌ Failed: ${results.failed}`);
  
  if (results.errors.length > 0) {
    console.log('\n── FAILED TESTS ──');
    for (const e of results.errors) {
      console.log(`  ❌ [${e.category}] ${e.testName} | exp=${e.expected} got=${e.actual} ${e.detail}`);
    }
  }

  // Categorize failures
  const secFails = results.errors.filter(e => e.category === 'SEC_P0');
  const noAuthFails = results.errors.filter(e => e.category === 'NO_AUTH');
  const setupFails = results.errors.filter(e => e.category === 'SETUP' || e.category === 'AUTH');
  const funcFails = results.errors.filter(e => !['SEC_P0', 'NO_AUTH', 'SETUP', 'AUTH'].includes(e.category));

  if (secFails.length > 0) {
    console.log(`\n🔴 SECURITY VULNERABILITIES: ${secFails.length}`);
    for (const s of secFails) console.log(`  🔴 ${s.testName}`);
  } else {
    console.log('\n✅ No P0 security vulnerabilities detected via API');
  }

  if (noAuthFails.length > 0) {
    console.log(`\n🔴 UNAUTHENTICATED ACCESS: ${noAuthFails.length}`);
    for (const s of noAuthFails) console.log(`  🔴 ${s.testName}`);
  }

  console.log('\n═══ DONE ═══');
})();
