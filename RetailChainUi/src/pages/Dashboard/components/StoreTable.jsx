import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const StoreTable = ({ data }) => {
    const rows = Array.isArray(data) ? data : [];
    const formatNumber = (n) => (typeof n === "number" ? new Intl.NumberFormat("vi-VN").format(n) : "---");

    const getStatusLabel = (status) => (status === 1 ? "Đang hoạt động" : "Ngưng hoạt động");
    const getStatusClass = (status) =>
      status === 1
        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-100"
        : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-100";

    return (
      <Card className="shadow-soft border-gray-200 dark:border-gray-700 bg-surface-light dark:bg-surface-dark overflow-hidden">
        <CardHeader className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base font-medium text-text-main dark:text-white tracking-wide">Hiệu suất cửa hàng</CardTitle>
          <Link to="/store" className="text-sm text-primary font-bold hover:underline cursor-pointer">Xem tất cả</Link>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50 dark:bg-gray-800">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="px-6 py-4 text-xs uppercase text-text-muted font-semibold tracking-wider">Cửa hàng</TableHead>
                <TableHead className="px-6 py-4 text-xs uppercase text-text-muted font-semibold tracking-wider">Địa chỉ</TableHead>
                <TableHead className="px-6 py-4 text-xs uppercase text-text-muted font-semibold tracking-wider text-right">Tồn kho</TableHead>
                <TableHead className="px-6 py-4 text-xs uppercase text-text-muted font-semibold tracking-wider text-right">Sắp hết</TableHead>
                <TableHead className="px-6 py-4 text-xs uppercase text-text-muted font-semibold tracking-wider text-center">Trạng thái</TableHead>
                <TableHead className="px-6 py-4 text-xs uppercase text-text-muted font-semibold tracking-wider text-center">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-sm">
              {rows.slice(0, 8).map((r) => (
                <TableRow key={r.storeId} className="hover:bg-primary/5 transition-colors border-gray-100 dark:border-gray-700">
                  <TableCell className="px-6 py-4 font-semibold text-text-main dark:text-white">
                    {r.storeName} <span className="text-text-muted font-normal">({r.storeCode})</span>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-text-muted">{r.address || "N/A"}</TableCell>
                  <TableCell className="px-6 py-4 text-right font-medium text-text-main dark:text-white">
                    {formatNumber(r.stockQuantity)}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    <span className={`font-bold ${r.lowStockCount > 0 ? "text-orange-600" : "text-green-600"}`}>
                      {formatNumber(r.lowStockCount)}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-center">
                    <Badge variant="secondary" className={`${getStatusClass(r.status)} border-none shadow-none`}>
                      {getStatusLabel(r.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-center">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-text-muted hover:text-primary" asChild>
                      <Link to={`/store/${r.storeCode}`}>
                        <span className="material-symbols-outlined text-[20px]">open_in_new</span>
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  };
  
  export default StoreTable;
