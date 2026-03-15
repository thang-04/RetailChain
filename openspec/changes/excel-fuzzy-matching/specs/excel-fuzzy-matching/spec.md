## ADDED Requirements

### Requirement: Fuzzy matching cho Category
Hệ thống SHALL sử dụng fuzzy matching để map category từ Excel vào database.

#### Scenario: Exact match
- **WHEN** category trong Excel là "Áo Thun" và database có category "Áo Thun"
- **THEN** hệ thống tự động chọn category "Áo Thun"

#### Scenario: Partial match (Excel contains DB)
- **WHEN** category trong Excel là "Quần" và database có "Quần Jeans", "Quần Tây"
- **THEN** hệ thống chọn category đầu tiên chứa "Quần" (ưu tiên exact match hơn partial)

#### Scenario: Partial match (DB contains Excel)
- **WHEN** category trong Excel là "Jeans" và database có "Quần Jeans"
- **THEN** hệ thống chọn category "Quần Jeans"

#### Scenario: Whitespace handling
- **WHEN** category trong Excel là "  Áo Thun  " (có khoảng trắng)
- **THEN** hệ thống tự động trim và match với "Áo Thun"

#### Scenario: No match found
- **WHEN** category trong Excel là "Hàng không tồn tại" và không có category nào trong database khớp
- **THEN** hệ thống hiển thị giá trị gốc từ Excel trong dropdown để user chọn thủ công

### Requirement: Fuzzy matching cho Size
Hệ thống SHALL sử dụng fuzzy matching để map size từ Excel.

#### Scenario: Size exact match
- **WHEN** size trong Excel là "M" và danh sách có "M"
- **THEN** hệ thống tự động chọn "M"

### Requirement: Fuzzy matching cho Color
Hệ thống SHALL sử dụng fuzzy matching để map color từ Excel.

#### Scenario: Color exact match
- **WHEN** color trong Excel là "Trắng" và danh sách có "Trắng"
- **THEN** hệ thống tự động chọn "Trắng"

#### Scenario: Color partial match
- **WHEN** color trong Excel là "Navy" và danh sách có "Xanh Navy"
- **THEN** hệ thống chọn "Xanh Navy"
