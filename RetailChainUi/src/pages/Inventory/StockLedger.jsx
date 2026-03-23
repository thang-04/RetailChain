import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import inventoryService from '@/services/inventory.service';

const StockLedger = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    const getTransactionLabel = (type) => {
        const typeMap = {
            "Stock In": "Nhập kho",
            "Stock Out": "Xuất kho",
            "Transfer": "Chuyển kho",
            "Sales": "Bán hàng",
        };

        return typeMap[type] || type;
    };

    useEffect(() => {
        const fetch = async () => {
            try {
                setLoading(true);
                const data = await inventoryService.getStockLedger();
                setTransactions(data);
            } catch (error) {
                console.error("Failed to fetch stock ledger:", error);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    return (
        <div className="p-6 space-y-6">
             <div>
                <h2 className="text-3xl font-bold tracking-tight">Sổ kho và truy vết</h2>
                <p className="text-muted-foreground">Theo dõi mọi biến động tồn kho trên toàn chuỗi.</p>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row gap-4 justify-between">
                        <CardTitle className="pt-2">Lịch sử giao dịch kho</CardTitle>
                        <div className="flex gap-2">
                            <Input placeholder="Lọc theo sản phẩm..." className="w-[200px]" />
                            <Select defaultValue="all">
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Loại giao dịch" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả loại</SelectItem>
                                    <SelectItem value="in">Nhập kho</SelectItem>
                                    <SelectItem value="out">Xuất kho</SelectItem>
                                    <SelectItem value="transfer">Chuyển kho</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-10">Đang tải sổ kho...</div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Thời gian</TableHead>
                                    <TableHead>Loại</TableHead>
                                    <TableHead>Sản phẩm</TableHead>
                                    <TableHead className="text-right">Số lượng</TableHead>
                                    <TableHead>Vị trí</TableHead>
                                    <TableHead>Tham chiếu</TableHead>
                                    <TableHead>Người thao tác</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactions.map((trx) => (
                                    <TableRow key={trx.id}>
                                        <TableCell>{trx.date}</TableCell>
                                        <TableCell>
                                            <span className={`font-semibold ${
                                                trx.type === 'Stock In' ? 'text-green-600' :
                                                trx.type === 'Sales' ? 'text-blue-600' : 'text-orange-600'
                                            }`}>
                                                {getTransactionLabel(trx.type)}
                                            </span>
                                        </TableCell>
                                        <TableCell>{trx.product}</TableCell>
                                        <TableCell className="text-right font-mono">
                                            {trx.quantity > 0 ? `+${trx.quantity}` : trx.quantity}
                                        </TableCell>
                                        <TableCell>{trx.location}</TableCell>
                                        <TableCell className="text-xs text-muted-foreground">{trx.ref}</TableCell>
                                        <TableCell>{trx.user}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default StockLedger;
