import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  useExcelParser,
  useValidation,
  useUndoRedo,
  useDraftManager,
  fuzzyMatch,
} from "@/hooks";
import inventoryService from "@/services/inventory.service";
import Step1Upload from "./steps/Step1Upload";
import Step2Mapping from "./steps/Step2Mapping";
import Step3Review from "./steps/Step3Review";

const STEPS = [
  { id: 1, label: "Upload", icon: "📤" },
  { id: 2, label: "Map", icon: "🔗" },
  { id: 3, label: "Review", icon: "👁️" },
];

const ExcelImportWizard = ({ open, onOpenChange, onImport }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState([]);
  const [rowStates, setRowStates] = useState({});
  const [headers, setHeaders] = useState([]);
  const [mapping, setMapping] = useState({});

  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [isLoadingDropdown, setIsLoadingDropdown] = useState(false);

  const { parseFile, detectColumnMapping, isLoading: isParsing, error: parseError } = useExcelParser();
  const { validateRow, validateAllRows, getStats } = useValidation();
  const { state: undoState, setState: pushUndoState, undo, redo, canUndo, canRedo, reset: resetUndo } = useUndoRedo(null);
  const { hasDraft, draftData, saveDraft, loadDraft, clearDraft } = useDraftManager();

  const stats = getStats(parsedData, rowStates);

  const loadDropdownData = async () => {
    setIsLoadingDropdown(true);
    try {
      const [catRes, supRes] = await Promise.all([
        inventoryService.getAllCategories(),
        inventoryService.getAllSuppliers(),
      ]);

      const cats = Array.isArray(catRes) ? catRes : (catRes.data || []);
      const sups = Array.isArray(supRes) ? supRes : (supRes.data || []);

      setCategories(cats);
      setSuppliers(sups);

      return { cats, sups };
    } catch (err) {
      console.error("Error loading dropdown data:", err);
      return { cats: [], sups: [] };
    } finally {
      setIsLoadingDropdown(false);
    }
  };

  useEffect(() => {
    if (open) {
      setCurrentStep(1);
      setFile(null);
      setParsedData([]);
      setRowStates({});
      setHeaders([]);
      setMapping({});
      resetUndo(null);
      loadDropdownData();
    }
  }, [open]);

  useEffect(() => {
    if (hasDraft && draftData && open) {
      const shouldRestore = window.confirm("Bạn có draft chưa lưu. Có muốn khôi phục không?");
      if (shouldRestore) {
        setFile(draftData.file);
        setParsedData(draftData.parsedData);
        setRowStates(draftData.rowStates);
        setCurrentStep(3);
      } else {
        clearDraft();
      }
    }
  }, [open]);

  useEffect(() => {
    if (parsedData.length > 0 && open) {
      saveDraft({ file, parsedData, rowStates });
    }
  }, [parsedData, rowStates, open]);

  // Re-map categoryId and supplierId after categories/suppliers are loaded
  useEffect(() => {
    if (categories.length > 0 && parsedData.length > 0) {
      const needsRemap = parsedData.some(row => (row.categoryName || row.supplierName) && (!row.categoryId || !row.supplierId));
      
      if (needsRemap) {
        const remappedData = parsedData.map(row => {
          let newRow = { ...row };
          
          // Remap category
          if (row.categoryName && !row.categoryId) {
            const foundCat = fuzzyMatch(row.categoryName, categories, 'name');
            newRow.categoryId = foundCat ? foundCat.id : null;
          }
          
          // Remap supplier - DB field is 'name', not 'supplierName'
          if (row.supplierName && !row.supplierId) {
            const foundSupplier = fuzzyMatch(row.supplierName, suppliers, 'name');
            newRow.supplierId = foundSupplier ? (foundSupplier.supplierId || foundSupplier.id) : null;
          }
          
          return newRow;
        });

        // Re-validate all rows
        const newStates = {};
        remappedData.forEach((row, index) => {
          const validation = validateRow(row, index);
          newStates[index] = {
            ...validation,
            selected: validation.isValid,
            skuExists: rowStates[index]?.skuExists ?? null,
            isChecking: false,
          };
        });

        setParsedData(remappedData);
        setRowStates(newStates);
      }
    }
  }, [categories, suppliers]);

  const handleFileSelect = async (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    try {
      const data = await parseFile(selectedFile, categories, suppliers);

      const firstRow = data[0] || {};
      const detectedHeaders = Object.keys(firstRow).filter((k) => k !== "stt");
      setHeaders(detectedHeaders);

      const detectedMapping = detectColumnMapping(detectedHeaders);
      setMapping(detectedMapping);

      setFile(selectedFile);
      setParsedData(data);

      const states = {};
      for (let i = 0; i < data.length; i++) {
        const validation = validateRow(data[i], i);
        states[i] = {
          ...validation,
          selected: validation.isValid,
          skuExists: null,
          isChecking: validation.isValid && data[i].sku ? true : false,
        };

        if (validation.isValid && data[i].sku) {
          try {
            const skuResult = await inventoryService.checkSkuExists(data[i].sku);
            states[i].skuExists = skuResult.exists;
          } catch (_err) {
            states[i].skuExists = null;
          }
          states[i].isChecking = false;
        }
      }

      setRowStates(states);
      pushUndoState({ parsedData: data, rowStates: states });
      toast.success(`Đã đọc ${data.length} dòng`);
      
      // Chuyển sang bước 2 (Map) sau khi upload thành công
      setCurrentStep(2);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleMappingConfirm = (confirmedMapping) => {
    setMapping(confirmedMapping);
    setCurrentStep(3);
  };

  const handleRowToggle = useCallback(
    (index) => {
      const newStates = {
        ...rowStates,
        [index]: {
          ...rowStates[index],
          selected: !rowStates[index]?.selected,
        },
      };
      setRowStates(newStates);
      pushUndoState({ parsedData, rowStates: newStates });
    },
    [rowStates, parsedData, pushUndoState]
  );

  const handleSelectAll = useCallback(
    (select) => {
      const newStates = {};
      Object.keys(rowStates).forEach((key) => {
        newStates[key] = {
          ...rowStates[key],
          selected: select && rowStates[key].isValid,
        };
      });
      setRowStates(newStates);
      pushUndoState({ parsedData, rowStates: newStates });
    },
    [rowStates, parsedData, pushUndoState]
  );

  const handleRowEdit = useCallback(
    (index, updatedRow) => {
      const newData = [...parsedData];
      newData[index] = updatedRow;

      const validation = validateRow(updatedRow, index);
      const newStates = {
        ...rowStates,
        [index]: {
          ...validation,
          selected: validation.isValid && rowStates[index]?.selected,
        },
      };

      setParsedData(newData);
      setRowStates(newStates);
      pushUndoState({ parsedData: newData, rowStates: newStates });
    },
    [parsedData, rowStates, validateRow, pushUndoState]
  );

  const handleBulkSupplierChange = useCallback(
    (supplierId) => {
      if (!supplierId) return;

      const supplier = suppliers.find((s) => String(s.supplierId || s.id) === String(supplierId));
      const supplierName = supplier ? supplier.supplierName || supplier.name : "";

      const newData = parsedData.map((row) => ({
        ...row,
        supplierId: Number(supplierId),
        supplierName: supplierName || row.supplierName,
      }));

      const newStates = {};
      newData.forEach((row, index) => {
        const validation = validateRow(row, index);
        newStates[index] = {
          ...validation,
          selected: validation.isValid,
        };
      });

      setParsedData(newData);
      setRowStates(newStates);
      pushUndoState({ parsedData: newData, rowStates: newStates });
      toast.success("Đã áp dụng NCC cho tất cả dòng");
    },
    [parsedData, suppliers, validateRow, pushUndoState]
  );

  const handleBulkCategoryChange = useCallback(
    (categoryId) => {
      if (!categoryId) return;

      const category = categories.find((c) => String(c.categoryId || c.id) === String(categoryId));
      const categoryName = category ? category.categoryName || category.name : "";

      const newData = parsedData.map((row) => ({
        ...row,
        categoryId: Number(categoryId),
        categoryName: categoryName || row.categoryName,
      }));

      const newStates = {};
      newData.forEach((row, index) => {
        const validation = validateRow(row, index);
        newStates[index] = {
          ...validation,
          selected: validation.isValid,
        };
      });

      setParsedData(newData);
      setRowStates(newStates);
      pushUndoState({ parsedData: newData, rowStates: newStates });
      toast.success("Đã áp dụng Danh mục cho tất cả dòng");
    },
    [parsedData, categories, validateRow, pushUndoState]
  );

  const handleImport = () => {
    const selectedRows = parsedData
      .filter((_, index) => rowStates[index]?.selected)
      .map((row) => ({
        sku: row.sku,
        productName: row.productName,
        categoryId: row.categoryId,
        size: row.size,
        color: row.color,
        quantity: parseInt(row.quantity, 10),
        unitPrice: parseFloat(row.unitPrice),
        note: row.note,
        supplierId: row.supplierId,
      }));

    if (selectedRows.length === 0) {
      toast.error("Không có dòng nào hợp lệ để import");
      return;
    }

    onImport(selectedRows);
    clearDraft();
    handleClose();
  };

  const handleClose = () => {
    setFile(null);
    setParsedData([]);
    setRowStates({});
    setCurrentStep(1);
    clearDraft();
    onOpenChange(false);
  };

  const hasSelectedSupplier = parsedData.some((row) => row.supplierId);
  const canImport = file && stats.selected > 0 && hasSelectedSupplier && !isLoadingDropdown;
  const importButtonText = !hasSelectedSupplier
    ? "Chưa chọn nhà cung cấp"
    : stats.invalid > 0
    ? `Nhập (${stats.selected} dòng, ${stats.invalid} lỗi)`
    : `Nhập (${stats.selected} dòng)`;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            📥 Nhập Excel
          </DialogTitle>
          <DialogDescription>
            Nhập dữ liệu sản phẩm từ file Excel
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2 py-2 border-b">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`flex items-center gap-2 px-3 py-1 rounded-md ${
                  currentStep === step.id
                    ? "bg-primary text-primary-foreground"
                    : currentStep > step.id
                    ? "bg-green-100 text-green-700"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <span>{step.icon}</span>
                <span className="text-sm font-medium">{step.label}</span>
              </div>
              {index < STEPS.length - 1 && (
                <div className={`w-8 h-0.5 mx-1 ${currentStep > step.id ? "bg-green-500" : "bg-muted"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="flex-1 overflow-auto">
          {currentStep === 1 && (
            <Step1Upload
              onFileSelect={handleFileSelect}
              isLoading={isParsing}
              error={parseError}
              file={file}
            />
          )}

          {currentStep === 2 && (
            <Step2Mapping
              headers={headers}
              detectedMapping={mapping}
              onMappingConfirm={handleMappingConfirm}
              onBack={() => setCurrentStep(1)}
            />
          )}

          {currentStep === 3 && (
            <Step3Review
              file={file}
              data={parsedData}
              rowStates={rowStates}
              stats={stats}
              suppliers={suppliers}
              categories={categories}
              onRowToggle={handleRowToggle}
              onSelectAll={handleSelectAll}
              onRowEdit={handleRowEdit}
              onBulkSupplierChange={handleBulkSupplierChange}
              onBulkCategoryChange={handleBulkCategoryChange}
              onChangeFile={() => {
                setFile(null);
                setParsedData([]);
                setRowStates({});
                setCurrentStep(1);
              }}
              onImport={handleImport}
              onUndo={undo}
              onRedo={redo}
              canUndo={canUndo}
              canRedo={canRedo}
              canImport={canImport}
              importButtonText={importButtonText}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExcelImportWizard;
