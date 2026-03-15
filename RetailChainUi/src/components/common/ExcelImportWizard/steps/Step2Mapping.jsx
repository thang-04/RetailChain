import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";

const FIELD_OPTIONS = [
  { value: "sku", label: "SKU" },
  { value: "productName", label: "Tên sản phẩm" },
  { value: "quantity", label: "Số lượng" },
  { value: "unitPrice", label: "Đơn giá" },
  { value: "supplierName", label: "Nhà cung cấp" },
  { value: "categoryName", label: "Danh mục" },
  { value: "size", label: "Size" },
  { value: "color", label: "Màu" },
  { value: "note", label: "Ghi chú" },
  { value: "ignore", label: "Bỏ qua" },
];

const Step2Mapping = ({ headers, detectedMapping, onMappingConfirm, onBack }) => {
  const [mapping, setMapping] = useState(detectedMapping || {});
  const [previewData, setPreviewData] = useState([]);

  useEffect(() => {
    if (detectedMapping) {
      setMapping(detectedMapping);
    }
  }, [detectedMapping]);

  useEffect(() => {
    if (headers && headers.length > 0) {
      const sampleData = headers.slice(0, 5).map((header, idx) => ({
        stt: idx + 1,
        original: header,
        mapped: Object.entries(mapping).find(([, colIndex]) => colIndex === idx)?.[0] || "",
      }));
      setPreviewData(sampleData);
    }
  }, [headers, mapping]);

  const handleMappingChange = (headerIndex, field) => {
    setMapping((prev) => ({
      ...prev,
      [field]: headerIndex,
    }));
  };

  const handleConfirm = () => {
    onMappingConfirm(mapping);
  };

  const getMappedField = (headerIndex) => {
    return Object.entries(mapping).find(([, idx]) => idx === headerIndex)?.[0] || "";
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Map cột Excel với trường dữ liệu</h3>
        <p className="text-sm text-muted-foreground">
          Hệ thống đã tự động phát hiện mapping. Bạn có thể điều chỉnh nếu cần.
        </p>
      </div>

      <div className="border rounded-lg overflow-auto max-h-[300px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cột trong Excel</TableHead>
              <TableHead>Map với trường</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {headers?.map((header, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{header}</TableCell>
                <TableCell>
                  <Select
                    value={getMappedField(index)}
                    onValueChange={(value) => handleMappingChange(index, value)}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Chọn trường..." />
                    </SelectTrigger>
                    <SelectContent>
                      {FIELD_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>
        <Button onClick={handleConfirm}>
          Tiếp tục
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default Step2Mapping;
