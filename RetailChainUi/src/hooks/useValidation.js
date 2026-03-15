import { useCallback, useMemo } from "react";

const useValidation = () => {
  const validateRow = useCallback((row, _index) => {
    const errors = [];

    if (!row.sku || row.sku.toString().trim() === "") {
      errors.push("SKU không được để trống");
    }

    if (!row.productName || row.productName.toString().trim() === "") {
      errors.push("Tên sản phẩm không được để trống");
    }

    if (!row.categoryId) {
      errors.push("Chưa chọn danh mục");
    }

    if (!row.size) {
      errors.push("Chưa chọn size");
    }

    if (!row.color) {
      errors.push("Chưa chọn màu");
    }

    const quantity = parseInt(row.quantity, 10);
    if (isNaN(quantity) || quantity <= 0) {
      errors.push("Số lượng phải là số nguyên dương");
    }

    const unitPrice = parseFloat(row.unitPrice);
    if (isNaN(unitPrice) || unitPrice <= 0) {
      errors.push("Đơn giá phải lớn hơn 0");
    }

    if (row.supplierName && !row.supplierId) {
      errors.push("Không tìm thấy NCC: " + row.supplierName);
    }

    return {
      isValid: errors.length === 0,
      errors: errors,
    };
  }, []);

  const validateAllRows = useCallback(
    (data) => {
      const states = {};
      data.forEach((row, index) => {
        const validation = validateRow(row, index);
        states[index] = {
          ...validation,
          selected: validation.isValid,
        };
      });
      return states;
    },
    [validateRow]
  );

  const getStats = useCallback(
    (data, rowStates) => {
      if (!data || data.length === 0 || !rowStates || Object.keys(rowStates).length === 0) {
        return {
          total: 0,
          valid: 0,
          invalid: 0,
          newProduct: 0,
          selected: 0,
        };
      }

      return {
        total: data.length,
        valid: Object.values(rowStates).filter((s) => s?.isValid).length,
        invalid: Object.values(rowStates).filter((s) => s && !s.isValid).length,
        newProduct: Object.values(rowStates).filter((s) => s?.skuExists === false).length,
        selected: Object.values(rowStates).filter((s) => s?.selected).length,
      };
    },
    []
  );

  return {
    validateRow,
    validateAllRows,
    getStats,
  };
};

export default useValidation;
