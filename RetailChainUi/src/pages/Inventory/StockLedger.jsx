import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import inventoryService from '@/services/inventory.service';

const StockLedger = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

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
                <h2 className="text-3xl font-bold tracking-tight">Stock Ledger & Traceability</h2>
                <p className="text-muted-foreground">Track every stock movement across the chain.</p>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row gap-4 justify-between">
                        <CardTitle className="pt-2">Transaction History</CardTitle>
                        <div className="flex gap-2">
                            <Input placeholder="Filter by Product..." className="w-[200px]" />
                            <Select defaultValue="all">
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Transaction Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="in">Stock In</SelectItem>
                                    <SelectItem value="out">Stock Out</SelectItem>
                                    <SelectItem value="transfer">Transfer</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-10">Loading ledger...</div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Time</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Product</TableHead>
                                    <TableHead className="text-right">Quantity</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Reference</TableHead>
                                    <TableHead>User</TableHead>
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
                                                {trx.type}
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
