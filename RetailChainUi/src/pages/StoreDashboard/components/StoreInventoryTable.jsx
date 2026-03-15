import React from "react";
import { Link, useParams } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Package, AlertTriangle, CheckCircle2 } from "lucide-react";

const INVENTORY_PREVIEW_LIMIT = 5;

const StoreInventoryTable = ({ inventory }) => {
    const { id } = useParams();
    // Use mock default if no inventory provided
    const inventoryList = inventory || [
        { id: 1, name: "Wireless Headphones", sku: "WH-001", category: "Electronics", stock: 124, price: "$124.50", status: "In Stock" },
        { id: 2, name: "Smart Watch Series 5", sku: "SW-005", category: "Electronics", stock: 8, price: "$299.00", status: "Low Stock" },
        { id: 3, name: "Cotton T-Shirt Basic", sku: "TS-102", category: "Apparel", stock: 450, price: "$24.90", status: "In Stock" },
        { id: 4, name: "Running Sneakers", sku: "RS-888", category: "Footwear", stock: 0, price: "$85.00", status: "Out of Stock" },
        { id: 5, name: "Coffee Maker Pro", sku: "CM-200", category: "Home", stock: 32, price: "$149.99", status: "In Stock" },
    ];

    const previewList = inventoryList.slice(0, INVENTORY_PREVIEW_LIMIT);
    const remainingCount = inventoryList.length - INVENTORY_PREVIEW_LIMIT;

    const getStatusColor = (status) => {
        switch (status) {
            case "In Stock":
                return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400";
            case "Low Stock":
                return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
            case "Out of Stock":
                return "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400";
            default:
                return "bg-slate-100 text-slate-800";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "In Stock": return <CheckCircle2 className="w-3 h-3 mr-1" />;
            case "Low Stock": return <AlertTriangle className="w-3 h-3 mr-1" />;
            case "Out of Stock": return <Package className="w-3 h-3 mr-1" />;
            default: return null;
        }
    };

    return (
        <Card className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-sm overflow-hidden flex-1 h-full">
            <CardHeader className="flex flex-row items-center justify-between py-4 px-6 border-b border-border-light dark:border-border-dark space-y-0">
                <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-primary" />
                    <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">Tồn kho cửa hàng</CardTitle>
                    <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold px-2 py-0.5 rounded-full border-none shadow-none">
                        {inventoryList.length}
                    </Badge>
                </div>
                <Link
                    to={`/store/${id}/inventory`}
                    className="text-sm text-primary font-semibold hover:text-primary-dark hover:underline cursor-pointer"
                >
                    View All
                </Link>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
                        <TableRow className="hover:bg-transparent border-b border-border-light dark:border-border-dark">
                            <TableHead className="px-6 py-3 text-xs uppercase text-slate-500 font-semibold tracking-wider">Sản phẩm</TableHead>
                            <TableHead className="px-6 py-3 text-xs uppercase text-slate-500 font-semibold tracking-wider text-right">Tồn kho</TableHead>
                            <TableHead className="px-6 py-3 text-xs uppercase text-slate-500 font-semibold tracking-wider">Trạng thái</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-border-light dark:divide-border-dark">
                        {previewList.map((item) => (
                            <TableRow key={item.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer border-none">
                                <TableCell className="px-6 py-3 text-sm font-medium text-slate-900 dark:text-white">
                                    {item.name}
                                </TableCell>
                                <TableCell className="px-6 py-3 text-sm font-semibold text-slate-900 dark:text-white text-right">{item.stock}</TableCell>
                                <TableCell className="px-6 py-3">
                                    <Badge variant="secondary" className={`border-none shadow-none text-xs flex w-fit items-center ${getStatusColor(item.status)}`}>
                                        {getStatusIcon(item.status)}
                                        {item.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>

        </Card>
    );
};

export default StoreInventoryTable;
