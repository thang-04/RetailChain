import { useState, useCallback, useEffect, useMemo } from "react";
import * as XLSX from "xlsx";
import { Upload, FileSpreadsheet, Check, AlertCircle, Plus, X, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import inventoryService from "@/services/inventory.service";

const SIZES = ["S", "M", "L", "XL", "26", "28", "30", "32", "34", "38", "39", "40", "41", "42", "43", "UNI"];

const COLORS = ["Đen", "Trắng", "Xám", "Xanh Navy", "Xanh", "Hoa", "Nâu", "Be", "Vàng"];

const EXCEL_COLUMNS = [
  { key: "sku", label: "SKU", required: true },
  { key: "productName", label: "Tên sản phẩm", required: true },
  { key: "quantity", label: "Số lượng", required: true },
  { key: "unitPrice", label: "Đơn giá", required: true },
  { key: "supplierName", label: "Nhà cung cấp", required: false },
  { key: "note", label: "Ghi chú", required: false },
];

const fuzzyMatch = (excelValue, dbList, dbField = 'name') => {
  if (!excelValue) return null;
  
  const trimmed = excelValue.trim().toLowerCase();
  if (!trimmed) return null;

  // Tier 1: Exact match (case-insensitive)
  const exact = dbList.find(item => 
    item[dbField]?.toLowerCase() === trimmed
  );
  if (exact) return exact;

  // Tier 2: DB contains Excel (partial - DB name contains Excel value)
  const dbContainsExcel = dbList.find(item => 
    item[dbField]?.toLowerCase().includes(trimmed)
  );
  if (dbContainsExcel) return dbContainsExcel;

  // Tier 3: Excel contains DB (partial - Excel value contains DB name)
  const excelContainsDb = dbList.find(item => 
    trimmed.includes(item[dbField]?.toLowerCase())
  );
  return excelContainsDb;
};

const fuzzyMatchSimple = (excelValue, dbList) => {
  if (!excelValue) return null;
  
  const trimmed = excelValue.trim().toLowerCase();
  if (!trimmed) return null;

  // Tier 1: Exact match
  if (dbList.includes(trimmed)) return trimmed;

  // Tier 2: DB contains Excel
  const dbContainsExcel = dbList.find(item => item.toLowerCase().includes(trimmed));
  if (dbContainsExcel) return dbContainsExcel;

  // Tier 3: Excel contains DB
  const excelContainsDb = dbList.find(item => trimmed.includes(item.toLowerCase()));
  return excelContainsDb || null;
};

export function ExcelPreviewModal({ open, onOpenChange, onImport }) {
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState([]);
  const [rowStates, setRowStates] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // New state for dropdowns
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [isLoadingDropdown, setIsLoadingDropdown] = useState(false);

  // Load categories and suppliers when modal opens
  useEffect(() => {
    if (open) {
      loadDropdownData();
    }
  }, [open]);

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

  // Re-map categoryId after categories are loaded
  useEffect(() => {
    if (categories.length > 0 && parsedData.length > 0) {
      const needsRemap = parsedData.some(row => row.categoryName && !row.categoryId);
      if (needsRemap) {
        const remappedData = parsedData.map(row => {
          if (row.categoryName && !row.categoryId) {
            const foundCat = fuzzyMatch(row.categoryName, categories, 'name');
            return { ...row, categoryId: foundCat ? foundCat.id : null };
          }
          return row;
        });
        setParsedData(remappedData);
        
        // Re-validate rows
        const newStates = {};
        remappedData.forEach((row, index) => {
          const validation = validateRow(row, index);
          newStates[index] = {
            ...rowStates[index],
            ...validation,
            selected: validation.isValid && (rowStates[index]?.selected || false),
          };
        });
        setRowStates(newStates);
      }
    }
  }, [categories, parsedData, rowStates, validateRow]);

  // Re-map supplierId after suppliers are loaded
  useEffect(() => {
    if (suppliers.length > 0 && parsedData.length > 0) {
      const needsRemap = parsedData.some(row => row.supplierName && !row.supplierId);
      if (needsRemap) {
        const remappedData = parsedData.map(row => {
          if (row.supplierName && !row.supplierId) {
            const foundSupplier = fuzzyMatch(row.supplierName, suppliers, 'supplierName');
            if (!foundSupplier) {
              return { ...row, supplierId: null };
            }
            return { ...row, supplierId: foundSupplier.supplierId || foundSupplier.id };
          }
          return row;
        });
        setParsedData(remappedData);
        const newStates = {};
        remappedData.forEach((row, index) => {
          const validation = validateRow(row, index);
          newStates[index] = {
            ...rowStates[index],
            ...validation,
            selected: validation.isValid && (rowStates[index]?.selected || false),
          };
        });
        setRowStates(newStates);
      }
    }
  }, [suppliers, parsedData, rowStates, validateRow]);

  const loadDropdownData = async () => {
    setIsLoadingDropdown(true);
    try {
      const [catRes, supRes] = await Promise.all([
        inventoryService.getAllCategories(),
        inventoryService.getAllSuppliers(),
      ]);
      
      // Handle both array response and wrapped response
      const cats = Array.isArray(catRes) ? catRes : (catRes.data || []);
      const sups = Array.isArray(supRes) ? supRes : (supRes.data || []);
      
      setCategories(cats);
      setSuppliers(sups);
      
      // Return categories for immediate use
      return cats;
    } catch (err) {
      console.error("Error loading dropdown data:", err);
      return [];
    } finally {
      setIsLoadingDropdown(false);
    }
  };

  const handleFileSelect = async (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setIsLoading(true);
    setError(null);

    try {
      // Ensure categories are loaded before parsing Excel - use returned value directly
      let loadedCategories = categories;
      if (loadedCategories.length === 0) {
        loadedCategories = await loadDropdownData();
      }

      const validExtensions = [".xlsx", ".xls"];
      const fileExtension = selectedFile.name.toLowerCase().slice(selectedFile.name.lastIndexOf("."));

      if (!validExtensions.includes(fileExtension)) {
        setError("File không hợp lệ. Vui lòng chọn file .xlsx hoặc .xls");
        return;
      }

      const data = await selectedFile.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      if (!jsonData || jsonData.length === 0) {
        setError("File Excel không có dữ liệu");
        return;
      }

      const normalizedData = jsonData.map((row, index) => {
        // Map category name to categoryId using fuzzy matching
        const categoryNameFromExcel = row["Danh mục"] || row.Category || row.CategoryName || row["Loại"] || row.category || null;
        let categoryId = null;
        if (categoryNameFromExcel && loadedCategories.length > 0) {
          const foundCat = fuzzyMatch(categoryNameFromExcel, loadedCategories, 'name');
          categoryId = foundCat ? foundCat.id : null;
        }

        // Map size from Excel using fuzzy matching
        const sizeFromExcelRaw = row.Size || row.size || row["Kích thước"] || row.KichThuoc || null;
        const sizeFromExcel = sizeFromExcelRaw ? fuzzyMatchSimple(sizeFromExcelRaw, SIZES) : null;

        // Map color from Excel using fuzzy matching
        const colorFromExcelRaw = row.Màu || row.Color || row["Màu sắc"] || row.MauSac || row.mau || null;
        const colorFromExcel = colorFromExcelRaw ? fuzzyMatchSimple(colorFromExcelRaw, COLORS) : null;

        // Map supplier name from Excel
        const supplierNameFromExcel = row["Nhà cung cấp"] || row.Supplier || row.SupplierName || row.NCC || row.ncc || null;
        const supplierNameRaw = supplierNameFromExcel;
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
          supplierName: supplierNameRaw,
          supplierId: supplierId,
        };
      });

      const finalStates = {};
      for (let i = 0; i < normalizedData.length; i++) {
        const validation = validateRow(normalizedData[i], i);
        finalStates[i] = {
          ...validation,
          selected: validation.isValid,
          skuExists: null,
          isChecking: validation.isValid && normalizedData[i].sku ? true : false,
        };

        if (validation.isValid && normalizedData[i].sku) {
          try {
            const skuResult = await inventoryService.checkSkuExists(normalizedData[i].sku);
            finalStates[i].skuExists = skuResult.exists;
          } catch (_err) {
            finalStates[i].skuExists = null;
          }
          finalStates[i].isChecking = false;
        }
      }

      setFile(selectedFile);
      setParsedData(normalizedData);
      setRowStates(finalStates);

    } catch (err) {
      console.error("Parse error:", err);
      setError("Lỗi khi đọc file Excel: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRowToggle = (index) => {
    setRowStates((prev) => ({
      ...prev,
      [index]: {
        ...prev[index],
        selected: !prev[index]?.selected,
      },
    }));
  };

  const handleSelectAll = (select) => {
    const newStates = {};
    Object.keys(rowStates).forEach((key) => {
      newStates[key] = {
        ...rowStates[key],
        selected: select && rowStates[key].isValid,
      };
    });
    setRowStates(newStates);
  };

  const handleFieldChange = useCallback((index, field, value) => {
    const updatedData = [...parsedData];
    updatedData[index] = { ...updatedData[index], [field]: value };
    setParsedData(updatedData);
    
    const validation = validateRow(updatedData[index], index);
    setRowStates((prev) => ({
      ...prev,
      [index]: {
        ...prev[index],
        ...validation,
        selected: validation.isValid && prev[index]?.selected,
      },
    }));
  }, [parsedData, validateRow]);

  const handleCategoryChange = (index, value) => handleFieldChange(index, 'categoryId', Number(value));
  const handleSizeChange = (index, value) => handleFieldChange(index, 'size', value);
  const handleColorChange = (index, value) => handleFieldChange(index, 'color', value);

  const handleImport = () => {
    const invalidSupplierRows = parsedData.filter(
      (_, index) => rowStates[index]?.selected && rowStates[index]?.errors?.some(e => e.includes("Không tìm thấy NCC"))
    );

    if (invalidSupplierRows.length > 0) {
      toast.warning(`${invalidSupplierRows.length} dòng có NCC không hợp lệ và sẽ bị bỏ qua`);
    }

    const selectedRows = parsedData
      .filter((_, index) => {
        const isSelected = rowStates[index]?.selected;
        const hasSupplierError = rowStates[index]?.errors?.some(e => e.includes("Không tìm thấy NCC"));
        return isSelected && !hasSupplierError;
      })
      .map((row) => ({
        sku: row.sku,
        productName: row.productName,
        categoryId: row.categoryId,
        size: row.size,
        color: row.color,
        quantity: parseInt(row.quantity, 10),
        unitPrice: parseFloat(row.unitPrice),
        note: row.note,
        supplierId: row.supplierId || (selectedSupplier ? Number(selectedSupplier) : null),
      }));

    if (selectedRows.length === 0) {
      setError("Không có dòng nào hợp lệ để import");
      return;
    }

    onImport(selectedRows);
    handleClose();
  };

  const handleClose = () => {
    setFile(null);
    setParsedData([]);
    setRowStates({});
    setError(null);
    setSelectedSupplier(null);
    onOpenChange(false);
  };

  const stats = useMemo(() => ({
    total: parsedData.length,
    valid: Object.values(rowStates).filter((s) => s?.isValid).length,
    invalid: Object.values(rowStates).filter((s) => s && !s.isValid).length,
    newProduct: Object.values(rowStates).filter((s) => s?.skuExists === false).length,
    selected: Object.values(rowStates).filter((s) => s?.selected).length,
  }), [parsedData, rowStates]);

  const hasSelectedSupplier = selectedSupplier || parsedData.some(row => row.supplierId);
  const canImport = file && stats.selected > 0 && !isLoading && hasSelectedSupplier;
  const importButtonText = !hasSelectedSupplier 
    ? "Chưa chọn nhà cung cấp" 
    : stats.invalid > 0 
      ? `Nhập (${stats.selected} dòng, ${stats.invalid} lỗi)` 
      : `Nhập (${stats.selected} dòng)`;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-green-600" />
            Nhập Excel - Xem trước dữ liệu
          </DialogTitle>
          <DialogDescription>
            Xem trước dữ liệu từ file Excel trước khi nhập vào hệ thống
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto">
          {!file ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Upload className="w-16 h-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">Chọn file Excel để tải lên</p>
              <Input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileSelect}
                className="max-w-xs"
              />
              {isLoading && (
                <p className="text-sm text-muted-foreground mt-4">Đang đọc file...</p>
              )}
              {error && (
                <p className="text-sm text-red-500 mt-4">{error}</p>
              )}
              <div className="mt-6 text-xs text-muted-foreground">
                <p className="font-medium mb-2">Cột trong file Excel:</p>
                <div className="space-y-1">
                  {EXCEL_COLUMNS.map((col) => (
                    <p key={col.key}>
                      {col.label} {col.required && <span className="text-red-500">*</span>}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-muted/50 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-green-600" />
                  <span className="font-medium">{file.name}</span>
                </div>
                <Button variant="outline" size="sm" onClick={() => setFile(null)}>
                  <X className="w-4 h-4 mr-1" />
                  Chọn file khác
                </Button>
              </div>

              <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-700">Nhà cung cấp:</span>
                </div>
                <Select
                  value={selectedSupplier || ""}
                  onValueChange={(value) => setSelectedSupplier(value)}
                  disabled={isLoadingDropdown}
                >
                  <SelectTrigger className="w-[250px] bg-white">
                    <SelectValue placeholder={isLoadingDropdown ? "Đang tải..." : "Chọn nhà cung cấp"} />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((supplier) => (
                      <SelectItem key={supplier.supplierId || supplier.id} value={String(supplier.supplierId || supplier.id)}>
                        {supplier.supplierName || supplier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {!selectedSupplier && !parsedData.some(row => row.supplierId) && (
                  <span className="text-sm text-muted-foreground">(Nếu Excel không có NCC)</span>
                )}
              </div>

              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <span className="font-medium">Tổng:</span>
                  <span>{stats.total} dòng</span>
                </div>
                <div className="flex items-center gap-1 text-green-600">
                  <Check className="w-4 h-4" />
                  <span>Hợp lệ: {stats.valid}</span>
                </div>
                <div className="flex items-center gap-1 text-red-500">
                  <AlertCircle className="w-4 h-4" />
                  <span>Lỗi: {stats.invalid}</span>
                </div>
                <div className="flex items-center gap-1 text-yellow-600">
                  <Plus className="w-4 h-4" />
                  <span>Sẽ tạo mới: {stats.newProduct}</span>
                </div>
              </div>

              <div className="border rounded-lg overflow-auto max-h-[400px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10">
                        <input
                          type="checkbox"
                          checked={stats.selected === stats.valid && stats.valid > 0}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          className="w-4 h-4"
                        />
                      </TableHead>
                      <TableHead>STT</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Tên sản phẩm</TableHead>
                      <TableHead>Nhà cung cấp</TableHead>
                      <TableHead>Danh mục</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Màu</TableHead>
                      <TableHead>Số lượng</TableHead>
                      <TableHead>Đơn giá</TableHead>
                      <TableHead>Trạng thái</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parsedData.map((row, index) => {
                      const state = rowStates[index];
                      const isValid = state?.isValid;
                      const isSelected = state?.selected;
                      const skuExists = state?.skuExists;
                      const isChecking = state?.isChecking;

                      return (
                        <TableRow
                          key={index}
                          className={cn(
                            !isValid && "bg-red-50",
                            isValid && !isSelected && "opacity-50"
                          )}
                        >
                          <TableCell>
                            <input
                              type="checkbox"
                              checked={isSelected || false}
                              disabled={!isValid}
                              onChange={() => handleRowToggle(index)}
                              className="w-4 h-4"
                            />
                          </TableCell>
                          <TableCell>{row.stt}</TableCell>
                          <TableCell className="font-mono text-xs">{row.sku}</TableCell>
                          <TableCell>{row.productName}</TableCell>
                          <TableCell>
                            {row.supplierName ? (
                              row.supplierId ? (
                                <span className="text-green-600">{row.supplierName}</span>
                              ) : (
                                <span className="text-red-500">{row.supplierName} (không tìm thấy)</span>
                              )
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Select
                              value={String(row.categoryId) || ""}
                              onValueChange={(value) => handleCategoryChange(index, Number(value))}
                            >
                              <SelectTrigger className="w-[140px] h-8 text-xs">
                                <SelectValue placeholder="Chọn..." />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.map((cat) => (
                                  <SelectItem key={cat.categoryId || cat.id} value={String(cat.categoryId || cat.id)}>
                                    {cat.categoryName || cat.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={row.size || ""}
                              onValueChange={(value) => handleSizeChange(index, value)}
                            >
                              <SelectTrigger className="w-[80px] h-8 text-xs">
                                <SelectValue placeholder="Size" />
                              </SelectTrigger>
                              <SelectContent>
                                {SIZES.map((size) => (
                                  <SelectItem key={size} value={size}>
                                    {size}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={row.color || ""}
                              onValueChange={(value) => handleColorChange(index, value)}
                            >
                              <SelectTrigger className="w-[100px] h-8 text-xs">
                                <SelectValue placeholder="Màu" />
                              </SelectTrigger>
                              <SelectContent>
                                {COLORS.map((color) => (
                                  <SelectItem key={color} value={color}>
                                    {color}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>{row.quantity}</TableCell>
                          <TableCell>
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(row.unitPrice)}
                          </TableCell>
                          <TableCell>
                            {isChecking ? (
                              <span className="text-muted-foreground text-xs">Đang kiểm tra...</span>
                            ) : !isValid ? (
                              <div className="flex items-center gap-1 text-red-500 text-xs">
                                <AlertCircle className="w-3 h-3" />
                                <span>{state?.errors?.[0] || "Lỗi"}</span>
                              </div>
                            ) : skuExists === false ? (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs">
                                <Plus className="w-3 h-3" />
                                Sẽ tạo mới
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs">
                                <Check className="w-3 h-3" />
                                Tồn tại
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Hủy
          </Button>
          <Button
            onClick={handleImport}
            disabled={!canImport}
          >
            {importButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
