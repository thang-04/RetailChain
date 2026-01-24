import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import inventoryService from '@/services/inventory.service';

const StoreInventoryDetail = () => {
    // In real app, get storeId from params
    const [inventory, setInventory] = useState([]);

    useEffect(() => {
        const fetch = async () => {
            const data = await inventoryService.getStoreInventory("S001");
            setInventory(data);
        };
        fetch();
    }, []);

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Store Inventory: Store A</h2>
                    <p className="text-muted-foreground">Real-time stock levels at District 1 branch.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">Request Stock</Button>
                    <Button variant="destructive">Report Loss</Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Items</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold">1,245</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Low Stock Alerts</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold text-red-500">8</div></CardContent>
                </Card>
                 <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Last Audit</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold">2 days ago</div></CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader><CardTitle>Stock List</CardTitle></CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Product Name</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead className="text-right">Current Stock</TableHead>
                                <TableHead className="text-right">Min Stock</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Last Updated</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {inventory.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.name}</TableCell>
                                    <TableCell>{item.category}</TableCell>
                                    <TableCell className="text-right font-bold">{item.stock}</TableCell>
                                    <TableCell className="text-right text-muted-foreground">{item.minStock}</TableCell>
                                    <TableCell>
                                         <Badge variant={
                                            item.status === 'Good' ? 'default' : 
                                            item.status === 'Low Stock' ? 'destructive' : 'outline'
                                        }>
                                            {item.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{item.lastUpdated}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default StoreInventoryDetail;
