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

const LowInventoryTable = ({ items }) => {
  const lowStockItems = items || [
    { name: "Premium Cotton Tee", sku: "CT-884", stock: 3, status: "Critical" },
    { name: "Denim Jacket (M)", sku: "DJ-002", stock: 5, status: "Ordered" },
    { name: "Leather Belt", sku: "LB-112", stock: 8, status: "Low" },
    { name: "Canvas Sneakers", sku: "CS-443", stock: 9, status: "Low" }
  ];

  return (
    <Card className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-sm overflow-hidden flex-1">
      <CardHeader className="flex flex-row items-center justify-between py-4 px-6 border-b border-border-light dark:border-border-dark space-y-0">
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">Low-Inventory Products</CardTitle>
          <Badge variant="secondary" className="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs font-bold px-2 py-0.5 rounded-full border-none shadow-none">
            {lowStockItems.length} Items
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
            <TableRow className="hover:bg-transparent border-b border-border-light dark:border-border-dark">
              <TableHead className="px-4 py-3 text-xs uppercase text-slate-500 font-semibold tracking-wider">Product Name</TableHead>
              <TableHead className="px-4 py-3 text-xs uppercase text-slate-500 font-semibold tracking-wider text-right">Stock</TableHead>
              <TableHead className="px-4 py-3 text-xs uppercase text-slate-500 font-semibold tracking-wider text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-border-light dark:divide-border-dark">
            {lowStockItems.map((item, index) => (
              <TableRow key={index} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-none">
                <TableCell className="px-4 py-3">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{item.name}</span>
                    <span className="text-xs text-slate-500">SKU: {item.sku || item.id}</span>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3 text-right">
                  <span className={`text-sm font-bold ${item.stock < 5 ? 'text-red-600 dark:text-red-400' : 'text-orange-600 dark:text-orange-400'}`}>
                    {item.stock}
                  </span>
                  <span className="text-xs text-slate-400 block">left</span>
                </TableCell>
                <TableCell className="px-4 py-3 text-right">
                  {item.status === 'Ordered' ? (
                     <span className="text-xs text-slate-400 italic">Ordered</span>
                  ) : (
                    <Button variant="outline" size="sm" className="h-7 text-xs font-medium text-primary hover:text-primary-dark border-primary/30 hover:bg-primary/5">Reorder</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default LowInventoryTable;

