import { useState, useCallback } from "react";
import * as XLSX from "xlsx";

export const SIZES = ["S", "M", "L", "XL", "26", "28", "30", "32", "34", "38", "39", "40", "41", "42", "43", "UNI"];

export const COLORS = ["Đen", "Trắng", "Xám", "Xanh Navy", "Xanh", "Hoa", "Nâu", "Be", "Vàng"];

export const EXCEL_COLUMNS = [
  { key: "sku", label: "SKU", required: true },
  { key: "productName", label: "Tên sản phẩm", required: true },
  { key: "quantity", label: "Số lượng", required: true },
  { key: "unitPrice", label: "Đơn giá", required: true },
  { key: "supplierName", label: "Nhà cung cấp", required: false },
  { key: "note", label: "Ghi chú", required: false },
];

export const fuzzyMatch = (excelValue, dbList, dbField = "name") => {
  if (!excelValue) return null;

  const trimmed = excelValue.trim().toLowerCase();
  if (!trimmed) return null;

  const exact = dbList.find((item) => item[dbField]?.toLowerCase() === trimmed);
  if (exact) return exact;

  const dbContainsExcel = dbList.find((item) => item[dbField]?.toLowerCase().includes(trimmed));
  if (dbContainsExcel) return dbContainsExcel;

  const excelContainsDb = dbList.find((item) => trimmed.includes(item[dbField]?.toLowerCase()));
  return excelContainsDb;
};

export const fuzzyMatchSimple = (excelValue, dbList) => {
  if (!excelValue) return null;

  const trimmed = excelValue.trim().toLowerCase();
  if (!trimmed) return null;

  if (dbList.includes(trimmed)) return trimmed;

  const dbContainsExcel = dbList.find((item) => item.toLowerCase().includes(trimmed));
  if (dbContainsExcel) return dbContainsExcel;

  const excelContainsDb = dbList.find((item) => trimmed.includes(item.toLowerCase()));
  return excelContainsDb || null;
};

const useExcelParser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const parseFile = useCallback(async (file, categories = [], suppliers = []) => {
    setIsLoading(true);
    setError(null);

    try {
      const validExtensions = [".xlsx", ".xls"];
      const fileExtension = file.name.toLowerCase().slice(file.name.lastIndexOf("."));

      if (!validExtensions.includes(fileExtension)) {
        throw new Error("File không hợp lệ. Vui lòng chọn file .xlsx hoặc .xls");
      }

      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      if (!jsonData || jsonData.length === 0) {
        throw new Error("File Excel không có dữ liệu");
      }

      const normalizedData = jsonData.map((row, index) => {
        const categoryNameFromExcel = row["Danh mục"] || row.Category || row.CategoryName || row["Loại"] || row.category || null;
        let categoryId = null;
        if (categoryNameFromExcel && categories.length > 0) {
          const foundCat = fuzzyMatch(categoryNameFromExcel, categories, "name");
          categoryId = foundCat ? foundCat.id : null;
        }

        const sizeFromExcelRaw = row.Size || row.size || row["Kích thước"] || row.KichThuoc || null;
        const sizeFromExcel = sizeFromExcelRaw ? fuzzyMatchSimple(sizeFromExcelRaw, SIZES) : null;

        const colorFromExcelRaw = row.Màu || row.Color || row["Màu sắc"] || row.MauSac || row.mau || null;
        const colorFromExcel = colorFromExcelRaw ? fuzzyMatchSimple(colorFromExcelRaw, COLORS) : null;

        const supplierNameFromExcel = row["Nhà cung cấp"] || row.Supplier || row.SupplierName || row.NCC || row.ncc || null;
        let supplierId = null;

        return {
          stt: index + 1,
          sku: row.SKU || row.sku || row.Mã || row.Mã_SP || "",
          productName: row["Tên sản phẩm"] || row.productName || row.Name || row.name || "",
          categoryId: categoryId,
          categoryName: categoryNameFromExcel,
          size: sizeFromExcel,
          color: colorFromExcel,
          sizeRaw: sizeFromExcelRaw,
          colorRaw: colorFromExcelRaw,
          quantity: row["Số lượng"] || row.quantity || row.Quantity || row.qty || 0,
          unitPrice: row["Đơn giá"] || row.unitPrice || row.Price || row.price || row["Giá"] || 0,
          note: row["Ghi chú"] || row.note || row.Note || "",
          supplierName: supplierNameFromExcel,
          supplierId: supplierId,
        };
      });

      return normalizedData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const detectColumnMapping = useCallback((headers) => {
    const mapping = {};
    const headerLower = headers.map((h) => h.toLowerCase());

    mapping.sku = headerLower.findIndex((h) => h.includes("sku") || h.includes("mã") || h.includes("ma"));
    mapping.productName = headerLower.findIndex((h) => h.includes("tên") || h.includes("name") || h.includes("sản"));
    mapping.quantity = headerLower.findIndex((h) => h.includes("số lượng") || h.includes("quantity") || h.includes("qty") || h.includes("sl"));
    mapping.unitPrice = headerLower.findIndex((h) => h.includes("đơn giá") || h.includes("price") || h.includes("gia"));
    mapping.supplierName = headerLower.findIndex((h) => h.includes("nhà cung cấp") || h.includes("supplier") || h.includes("ncc"));
    mapping.categoryName = headerLower.findIndex((h) => h.includes("danh mục") || h.includes("category") || h.includes("loại"));
    mapping.size = headerLower.findIndex((h) => h.includes("size") || h.includes("kích thước"));
    mapping.color = headerLower.findIndex((h) => h.includes("màu") || h.includes("color") || h.includes("mau"));
    mapping.note = headerLower.findIndex((h) => h.includes("ghi chú") || h.includes("note"));

    return mapping;
  }, []);

  return {
    parseFile,
    detectColumnMapping,
    isLoading,
    error,
  };
};

export default useExcelParser;
