import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import inventoryService from '@/services/inventory.service';

const StockInList = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const data = await inventoryService.getStockInRecords();
            setRecords(data);
            setLoading(false);
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
                    <Button variant="outline">
                        <span className="material-symbols-outlined mr-2">upload_file</span>
                        Import Excel
                    </Button>
                    <Button>
                        <span className="material-symbols-outlined mr-2">add</span>
                        Create Receipt
                    </Button>
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
                    {loading ? <div>Loading...</div> : (
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
                                        <TableCell className="font-medium">{record.id}</TableCell>
                                        <TableCell>{record.date}</TableCell>
                                        <TableCell>{record.supplier}</TableCell>
                                        <TableCell>{record.warehouse}</TableCell>
                                        <TableCell className="text-right">{record.totalItems}</TableCell>
                                        <TableCell className="text-right">{record.totalValue.toLocaleString()} VND</TableCell>
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
                                                <span className="material-symbols-outlined">visibility</span>
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
