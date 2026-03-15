## ADDED Requirements

### Requirement: Store entity không được có duplicate column mapping
Store entity trong JPA phải không được có hai thuộc tính ánh xạ đến cùng một cột trong database.

#### Scenario: Spring Boot khởi động thành công
- **WHEN** Spring Boot application khởi động
- **THEN** không có exception liên quan đến duplicate column mapping

#### Scenario: Store entity có warehouseId và warehouse relationship
- **WHEN** Store entity được load
- **THEN** cả warehouseId (Long) và warehouse (Warehouse) đều có thể truy cập được, với warehouseId là read-only
