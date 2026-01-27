import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import inventoryService from '@/services/inventory.service';
import { Plus, Eye, ArrowRightLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const TransferList = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await inventoryService.getTransferRecords();
                setRecords(data);
            } catch (error) {
                console.error("Failed to fetch transfer records:", error);
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
                    <h2 className="text-3xl font-bold tracking-tight">Điều Chuyển Kho</h2>
                    <p className="text-muted-foreground">Quản lý lịch sử và phiếu điều chuyển hàng hóa giữa các kho.</p>
                </div>
                <Link to="/transfers/create">
                    <Button className="gap-2">
                        <Plus className="w-4 h-4" />
                        Tạo Lệnh Điều Chuyển
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Lịch Sử Điều Chuyển</CardTitle>
                        <Input className="max-w-xs" placeholder="Tìm theo Mã phiếu..." />
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? <div className="text-center py-10">Đang tải dữ liệu...</div> : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Mã Phiếu</TableHead>
                                    <TableHead>Ngày Tạo</TableHead>
                                    <TableHead>Từ Kho</TableHead>
                                    <TableHead></TableHead>
                                    <TableHead>Đến Kho</TableHead>
                                    <TableHead className="text-right">Tổng Items</TableHead>
                                    <TableHead>Người Tạo</TableHead>
                                    <TableHead>Trạng Thái</TableHead>
                                    <TableHead className="text-right">Hành Động</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {records.map((record) => (
                                    <TableRow key={record.id}>
                                        <TableCell className="font-medium">{record.id}</TableCell>
                                        <TableCell>{record.date}</TableCell>
                                        <TableCell>{record.from}</TableCell>
                                        <TableCell><ArrowRightLeft className="w-4 h-4 text-muted-foreground" /></TableCell>
                                        <TableCell>{record.to}</TableCell>
                                        <TableCell className="text-right">{record.totalItems}</TableCell>
                                        <TableCell>{record.createdBy}</TableCell>
                                        <TableCell>
                                            <Badge variant={
                                                record.status === 'Completed' ? 'default' : 
                                                record.status === 'Pending' ? 'secondary' : 'outline'
                                            }>
                                                {record.status === 'Completed' ? 'Hoàn thành' : 
                                                 record.status === 'Pending' ? 'Chờ duyệt' : 
                                                 record.status === 'In Transit' ? 'Đang vận chuyển' : record.status}
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

export default TransferList;
