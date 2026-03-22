# Tasks: Add GPS to Store Creation

## Phase 1: Backend

### 1.1 Update DTOs
- [x] Update `CreateStoreRequest.java` - add latitude, longitude, radiusMeters fields
- [x] Update `UpdateStoreRequest.java` - add latitude, longitude, radiusMeters fields
- [x] Update `StoreResponse.java` - add latitude, longitude, radiusMeters fields
- [x] Update `StoreDetailResponse.java` - add latitude, longitude, radiusMeters fields

### 1.2 Update StoreService
- [x] Add default radius validation in `createStore()` method
- [x] Update `updateStore()` method to handle GPS fields
- [x] Update `StoreMapper.java` - add GPS fields mapping

## Phase 2: Frontend

### 2.1 Update Store Service
- [x] Update `store.service.js` - add GPS fields to createStore method
- [x] Add GPS fields to updateStore method

### 2.2 Update AddStoreModal
- [x] Pass mapPosition.lat/lng to createStore API call
- [x] Add radiusMeters field (default 50)

### 2.3 Update Edit Store (Optional)
- [ ] If there's an edit store modal, update to include GPS fields

## Phase 3: Testing

### 3.1 Backend
- [ ] Test create store with GPS coordinates
- [ ] Test create store without GPS (should work, default null)
- [ ] Test validation (invalid lat/lng)

### 3.2 Frontend
- [ ] Test create store via UI
- [ ] Verify GPS saved to database

## Phase 4: Fix Existing Data

### 4.1 Update Store 156 (Optional)
- [ ] Add GPS coordinates to existing stores that need attendance
