import { Upload, FileSpreadsheet, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EXCEL_COLUMNS } from "@/hooks/useExcelParser";

const Step1Upload = ({ onFileSelect, isLoading, error, file }) => {
  const handleDownloadTemplate = () => {
    const headers = EXCEL_COLUMNS.map((col) => col.label);
    const templateData = [headers];
    const csvContent = templateData.map((row) => row.join(",")).join("\n");

    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "template_import_san_pham.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-6">
      <Upload className="w-16 h-16 text-muted-foreground" />
      <p className="text-muted-foreground">Chọn file Excel để tải lên</p>

      <Input
        type="file"
        accept=".xlsx,.xls"
        onChange={onFileSelect}
        className="max-w-xs"
        disabled={isLoading}
      />

      {isLoading && <p className="text-sm text-muted-foreground">Đang đọc file...</p>}

      {error && <p className="text-sm text-red-500">{error}</p>}

      {file && (
        <div className="flex items-center gap-2 bg-muted/50 p-3 rounded-lg">
          <FileSpreadsheet className="w-5 h-5 text-green-600" />
          <span className="font-medium">{file.name}</span>
        </div>
      )}

      <div className="text-xs text-muted-foreground">
        <p className="font-medium mb-2">Cột trong file Excel:</p>
        <div className="space-y-1">
          {EXCEL_COLUMNS.map((col) => (
            <p key={col.key}>
              {col.label} {col.required && <span className="text-red-500">*</span>}
            </p>
          ))}
        </div>
      </div>

      <Button variant="outline" onClick={handleDownloadTemplate}>
        <Download className="w-4 h-4 mr-2" />
        Tải template
      </Button>
    </div>
  );
};

export default Step1Upload;
