## ADDED Requirements

### Requirement: Auto-save draft vào localStorage
Hệ thống PHẢI tự động lưu draft vào localStorage khi người dùng thay đổi dữ liệu.

#### Scenario: Auto-save khi thay đổi
- **WHEN** người dùng thay đổi bất kỳ dữ liệu nào
- **THEN** hệ thống tự động lưu vào localStorage

#### Scenario: Thời hạn draft
- **WHEN** draft được lưu
- **THEN** hệ thống lưu với timestamp và chỉ giữ trong 24 giờ

#### Scenario: Restore draft khi mở lại
- **WHEN** người dùng mở wizard và có draft còn hiệu lực
- **THEN** hệ thống hỏi có khôi phục draft không

#### Scenario: Xóa draft sau khi import thành công
- **WHEN** người dùng import thành công
- **THEN** hệ thống xóa draft khỏi localStorage

### Requirement: Quản lý draft
Hệ thống PHẢI cho phép người dùng quản lý draft.

#### Scenario: Hỏi trước khi đóng
- **WHEN** người dùng đóng wizard có dữ liệu
- **THEN** hệ thống hỏi có lưu draft không

#### Scenario: Xóa draft thủ công
- **WHEN** người dùng nhấn "Xóa draft"
- **THEN** hệ thống xóa draft khỏi localStorage

#### Scenario: Draft hết hạn
- **WHEN** người dùng mở wizard và draft đã quá 24 giờ
- **THEN** hệ thống bỏ qua draft và bắt đầu mới
