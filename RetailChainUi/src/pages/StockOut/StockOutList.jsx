import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import inventoryService from '@/services/inventory.service';
import { Upload, Plus, Eye, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

const StockOutList = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await inventoryService.getStockOutRecords();
                setRecords(data);
            } catch (error) {
                console.error("Failed to fetch stock out records:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Xuất Kho</h2>
                    <p className="text-muted-foreground">Quản lý các phiếu xuất kho và lịch sử xuất hàng.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                        <Download className="w-4 h-4" />
                        Xuất Excel
                    </Button>
                    <Link to="/stock-out/create">
                        <Button className="gap-2">
                            <Plus className="w-4 h-4" />
                            Tạo Phiếu Xuất
                        </Button>
                    </Link>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Danh Sách Phiếu Xuất</CardTitle>
                        <Input className="max-w-xs" placeholder="Tìm theo Mã phiếu hoặc Lý do..." />
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? <div className="text-center py-10">Đang tải dữ liệu...</div> : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Mã Phiếu</TableHead>
                                    <TableHead>Ngày Xuất</TableHead>
                                    <TableHead>Lý Do</TableHead>
                                    <TableHead>Kho Xuất</TableHead>
                                    <TableHead className="text-right">Số Lượng</TableHead>
                                    <TableHead className="text-right">Tổng Giá Trị</TableHead>
                                    <TableHead>Trạng Thái</TableHead>
                                    <TableHead className="text-right">Hành Động</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {records.map((record) => (
                                    <TableRow key={record.id}>
                                        <TableCell className="font-medium">{record.documentCode}</TableCell>
                                        <TableCell>{record.createdAt ? new Date(record.createdAt).toLocaleDateString('vi-VN') : '-'}</TableCell>
                                        <TableCell>{record.note || 'Xuất Bán Hàng'}</TableCell>
                                        <TableCell>{record.sourceWarehouseName}</TableCell>
                                        <TableCell className="text-right">{record.totalItems}</TableCell>
                                        <TableCell className="text-right">{record.totalValue > 0 ? record.totalValue.toLocaleString() : '-'} VND</TableCell>
                                        <TableCell>
                                            <Badge variant={
                                                record.status === 'Completed' ? 'default' :
                                                    record.status === 'Pending' ? 'secondary' : 'outline'
                                            }>
                                                {record.status === 'Completed' ? 'Hoàn thành' :
                                                    record.status === 'Pending' ? 'Chờ duyệt' : record.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon">
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                        </TableCell>
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

export default StockOutList;
