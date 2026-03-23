# Design: Add GPS to Store Creation

## 1. Architecture

### Data Flow
```
┌──────────────┐    ┌─────────────────┐    ┌──────────────┐    ┌─────────────┐
│   Frontend   │───▶│   Backend API   │───▶│   Service    │───▶│  Database   │
│  AddStore    │    │ CreateStore    │    │ StoreService│    │   stores   │
│    Modal     │    │                 │    │             │    │             │
└──────────────┘    └─────────────────┘    └──────────────┘    └─────────────┘
       │                   │                     │                    │
       │ name, address,    │ name, address,      │                    │
       │ lat, lng, radius  │ lat, lng, radius    │                    │
       └──────────────────▶│────────────────────▶│───────────────────▶│
```

## 2. Backend Changes

### 2.1 CreateStoreRequest DTO
```java
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreateStoreRequest {
    private String code;
    private String name;
    private String address;
    private Double latitude;      // NEW
    private Double longitude;    // NEW  
    private Integer radiusMeters; // NEW (default 50)
}
```

### 2.2 UpdateStoreRequest DTO
```java
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UpdateStoreRequest {
    private String name;
    private String address;
    private Double latitude;      // NEW
    private Double longitude;     // NEW
    private Integer radiusMeters; // NEW
    private Integer status;
}
```

### 2.3 StoreService
```java
public Store createStore(CreateStoreRequest request) {
    // Add default radius if not provided
    if (request.getRadiusMeters() == null) {
        request.setRadiusMeters(50); // Default 50m
    }
    // ... existing logic
}
```

## 3. Frontend Changes

### 3.1 AddStoreModal.jsx
```javascript
const handleSubmit = async () => {
    const newStore = await storeService.createStore({
        name: formData.name,
        address: address,
        latitude: mapPosition?.lat,     // ADD
        longitude: mapPosition?.lng,    // ADD
        radiusMeters: 50               // ADD (default)
    });
};
```

### 3.2 Store Service
```javascript
createStore: async (data) => {
    return await axiosPrivate.post('/stores', {
        name: data.name,
        address: data.address,
        latitude: data.latitude,
        longitude: data.longitude,
        radiusMeters: data.radiusMeters || 50
    });
}
```

## 4. API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/stores` | Create store with GPS |
| PUT | `/api/stores/{id}` | Update store GPS |

## 5. Validation

- Latitude: -90 to 90
- Longitude: -180 to 180
- Radius: 10 to 500 meters (default: 50)

## 6. Existing Code Reference

See files:
- `RetailChainService/src/main/java/com/sba301/retailmanagement/dto/request/CreateStoreRequest.java`
- `RetailChainService/src/main/java/com/sba301/retailmanagement/entity/Store.java`
- `RetailChainUi/src/pages/Store/components/AddStoreModal.jsx`
- `RetailChainUi/src/services/store.service.js`
