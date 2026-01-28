import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from 'react-router-dom';
import inventoryService from '@/services/inventory.service';
import { Upload, Plus, Eye } from 'lucide-react';

const StockInList = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await inventoryService.getStockInRecords();
                setRecords(data);
            } catch (error) {
                console.error("Failed to fetch stock in records:", error);
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
                    <h2 className="text-3xl font-bold tracking-tight">Stock In Records</h2>
                    <p className="text-muted-foreground">Manage incoming shipments and receipts.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                        <Upload className="w-4 h-4" />
                        Import Excel
                    </Button>
                    <Link to="/stock-in/create">
                        <Button className="gap-2">
                            <Plus className="w-4 h-4" />
                            Create Receipt
                        </Button>
                    </Link>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Recent Receipts</CardTitle>
                        <Input className="max-w-xs" placeholder="Search by ID or Supplier..." />
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? <div className="text-center py-10">Loading records...</div> : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Receipt ID</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Supplier</TableHead>
                                    <TableHead>Destination</TableHead>
                                    <TableHead className="text-right">Items</TableHead>
                                    <TableHead className="text-right">Total Value</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {records.map((record) => (
                                    <TableRow key={record.id}>
                                        <TableCell className="font-medium">{record.documentCode}</TableCell>
                                        <TableCell>{new Date(record.createdAt).toLocaleDateString('vi-VN')}</TableCell>
                                        <TableCell>{record.supplier || 'N/A'}</TableCell>
                                        <TableCell>{record.targetWarehouseName}</TableCell>
                                        <TableCell className="text-right">{record.totalItems}</TableCell>
                                        <TableCell className="text-right">{(record.totalValue || 0).toLocaleString()} VND</TableCell>
                                        <TableCell>
                                            <Badge variant={
                                                record.status === 'Completed' ? 'default' :
                                                    record.status === 'Pending' ? 'secondary' : 'outline'
                                            }>
                                                {record.status}
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

export default StockInList;

