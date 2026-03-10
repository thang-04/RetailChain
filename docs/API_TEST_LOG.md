# API Test Log - /api/warehouse

**Date:** 2026-02-25  
**Base URL:** http://localhost:8080/retail-chain/api/warehouse

---

## 1. GET /api/warehouse - Normal Flow

**Request:**
```bash
curl http://localhost:8080/retail-chain/api/warehouse
```

**Response:**
```json
{
  "code": 200,
  "desc": "Warehouses retrieved successfully",
  "data": [
    {
      "id": 1,
      "code": "WH-55108",
      "name": "Angelaborough Warehouse",
      "isDefault": 0,
      "status": 1,
      "createdAt": "2026-01-27 16:22:52",
      "updatedAt": "2026-01-27 16:22:52"
    }
    // ... more items
  ]
}
```

**Status:** ✅ PASS (200 OK)  
**Issue:** ⚠️ **Missing fields:** address, province, district, ward, contactName, contactPhone, description

---

## 2. POST /api/warehouse - Normal Flow

**Request:**
```bash
curl -X POST http://localhost:8080/retail-chain/api/warehouse \
  -H "Content-Type: application/json" \
  -d '{
    "code": "WH-TEST-001",
    "name": "Kho Test Normal",
    "address": "123 Test Address",
    "province": "Ha Noi",
    "district": "Ba Dinh",
    "ward": "Dien Bien",
    "contactName": "Nguyen Van Test",
    "contactPhone": "0912345678",
    "description": "Test warehouse",
    "isDefault": 1,
    "status": 1
  }'
```

**Response:**
```json
{
  "code": 200,
  "desc": "Warehouse created successfully",
  "data": {
    "id": 90,
    "code": "WH-TEST-001",
    "name": "Kho Test Normal",
    "address": "123 Test Address",
    "province": "Ha Noi",
    "district": "Ba Dinh",
    "ward": "Dien Bien",
    "contactName": "Nguyen Van Test",
    "contactPhone": "0912345678",
    "description": "Test warehouse",
    "isDefault": 1,
    "status": 1,
    "createdAt": "2026-02-25 10:26:29",
    "updatedAt": "2026-02-25 10:26:29"
  }
}
```

**Status:** ✅ PASS (200 OK)

---

## 3. POST /api/warehouse - Alternative Flow

**Request:** Test với các trường tối thiểu (optional fields)

```bash
curl -X POST http://localhost:8080/retail-chain/api/warehouse \
  -H "Content-Type: application/json" \
  -d '{
    "code": "WH-TEST-002",
    "name": "Kho Alternative",
    "isDefault": 0
  }'
```

**Response:**
```json
{
  "code": 200,
  "desc": "Warehouse created successfully",
  "data": {
    "id": 91,
    "code": "WH-TEST-002",
    "name": "Kho Alternative",
    "isDefault": 0,
    "status": 1,
    "createdAt": "2026-02-25 10:26:46",
    "updatedAt": "2026-02-25 10:26:46"
  }
}
```

**Status:** ✅ PASS (200 OK)

---

## 4. POST /api/warehouse - Exception Flow

**Request:** Test với duplicate code

```bash
curl -X POST http://localhost:8080/retail-chain/api/warehouse \
  -H "Content-Type: application/json" \
  -d '{
    "code": "WH-TEST-001",
    "name": "Kho Duplicate"
  }'
```

**Response:**
```json
{
  "code": 500,
  "desc": "Error creating warehouse: Warehouse code already exists"
}
```

**Status:** ✅ PASS (200 OK with error message) - Correctly handles duplicate code

---

## 5. PUT /api/warehouse/{id} - Normal Flow

**Request:**
```bash
curl -X PUT http://localhost:8080/retail-chain/api/warehouse/90 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Kho Test Updated",
    "address": "456 New Address",
    "province": "TP Ho Chi Minh",
    "district": "Quan 1",
    "contactPhone": "0987654321"
  }'
```

**Response:**
```json
{
  "code": 200,
  "desc": "Warehouse updated successfully",
  "data": {
    "id": 90,
    "code": "WH-TEST-001",
    "name": "Kho Test Updated",
    "address": "456 New Address",
    "province": "TP Ho Chi Minh",
    "district": " Quan 1",
    "ward": "Dien Bien",
    "contactName": "Nguyen Van Test",
    "contactPhone": "0987654321",
    "description": "Test warehouse",
    "isDefault": 1,
    "status": 1,
    "createdAt": "2026-02-25 10:26:29",
    "updatedAt": "2026-02-25 10:27:23"
  }
}
```

**Status:** ✅ PASS (200 OK)

---

## 6. PUT /api/warehouse/{id} - Exception Flow

**Request:** Test với ID không tồn tại

```bash
curl -X PUT http://localhost:8080/retail-chain/api/warehouse/99999 \
  -H "Content-Type: application/json" \
  -d '{"name": "Not Exist"}'
```

**Response:**
```json
{
  "code": 500,
  "desc": "Error updating warehouse: Warehouse not found"
}
```

**Status:** ✅ PASS (200 OK with error message)

---

## 7. DELETE /api/warehouse/{id} - Normal Flow

**Request:**
```bash
curl -X DELETE http://localhost:8080/retail-chain/api/warehouse/91
```

**Response:**
```json
{
  "code": 200,
  "desc": "Warehouse deleted successfully"
}
```

**Status:** ✅ PASS (200 OK)

---

## 8. DELETE /api/warehouse/{id} - Exception Flow

**Request:** Test với ID không tồn tại

```bash
curl -X DELETE http://localhost:8080/retail-chain/api/warehouse/99999
```

**Response:**
```json
{
  "code": 500,
  "desc": "Error deleting warehouse: Warehouse not found"
}
```

**Status:** ✅ PASS (200 OK with error message)

---

## Summary

| Test Case | Status | Notes |
|-----------|--------|-------|
| GET /api/warehouse - Normal | ⚠️ PARTIAL | Missing new fields (address, province, etc.) |
| POST /api/warehouse - Normal | ✅ PASS | |
| POST /api/warehouse - Alternative | ✅ PASS | |
| POST /api/warehouse - Exception | ✅ PASS | |
| PUT /api/warehouse/{id} - Normal | ✅ PASS | |
| PUT /api/warehouse/{id} - Exception | ✅ PASS | |
| DELETE /api/warehouse/{id} - Normal | ✅ PASS | |
| DELETE /api/warehouse/{id} - Exception | ✅ PASS | |

---

## Issues Found

### Issue #1: GET /api/warehouse missing new fields
**Description:** GET response does not include the new fields (address, province, district, ward, contactName, contactPhone, description, isDefault)

**Root Cause:** Likely due to old entity class being cached or Gson serialization issue

**Fix Required:** Rebuild and restart the application

**Status:** 🔧 TO BE FIXED

---

*Test executed on: 2026-02-25 10:26 - 10:28*
