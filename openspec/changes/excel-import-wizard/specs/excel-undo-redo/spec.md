## ADDED Requirements

### Requirement: Undo/Redo cho các thay đổi
Hệ thống PHẢI cho phép người dùng undo/redo các thay đổi trong session.

#### Scenario: Undo với Ctrl+Z
- **WHEN** người dùng nhấn Ctrl+Z
- **THEN** hệ thống khôi phục trạng thái trước đó

#### Scenario: Redo với Ctrl+Y
- **WHEN** người dùng nhấn Ctrl+Y
- **THEN** hệ thống khôi phục trạng thái tiếp theo

#### Scenario: Undo khi không có gì để undo
- **WHEN** người dùng nhấn Ctrl+Z khi không còn gì để undo
- **THEN** hệ thống không làm gì

#### Scenario: Redo khi không có gì để redo
- **WHEN** người dùng nhấn Ctrl+Y khi không còn gì để redo
- **THEN** hệ thống không làm gì

#### Scenario: Thay đổi mới xóa redo stack
- **WHEN** người dùng thực hiện thay đổi mới sau khi undo
- **THEN** hệ thống xóa redo stack

### Requirement: Undo/Redo hoạt động với UI state
Hệ thống PHẢI chỉ undo/redo UI state, không undo API calls.

#### Scenario: Undo chỉ hoạt động với local state
- **WHEN** người dùng undo
- **THEN** hệ thống chỉ khôi phục local state (parsed data, row edits)
- **AND** KHÔNG gọi API để undo server-side changes
