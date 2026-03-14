const XLSX = require('xlsx');

const data = [
  {
    SKU: 'TSHIRT-TEST-001',
    'Tên sản phẩm': 'Áo Thun Test 1',
    'Danh mục': 'Áo Thun',
    Size: 'M',
    Màu: 'Trắng',
    'Số lượng': 10,
    'Đơn giá': 199000,
    'Ghi chú': 'Test import 1'
  },
  {
    SKU: 'TSHIRT-TEST-002',
    'Tên sản phẩm': 'Áo Thun Test 2',
    'Danh mục': 'Áo Thun',
    Size: 'L',
    Màu: 'Đen',
    'Số lượng': 5,
    'Đơn giá': 199000,
    'Ghi chú': 'Test import 2'
  },
  {
    SKU: 'PANTS-TEST-001',
    'Tên sản phẩm': 'Quần Jeans Test',
    'Danh mục': 'Quần',
    Size: '32',
    Màu: 'Xanh Navy',
    'Số lượng': 3,
    'Đơn giá': 399000,
    'Ghi chú': 'Test import 3'
  }
];

const worksheet = XLSX.utils.json_to_sheet(data);
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, 'Import');

XLSX.writeFile(workbook, 'test-import.xlsx');
console.log('Created test-import.xlsx');
