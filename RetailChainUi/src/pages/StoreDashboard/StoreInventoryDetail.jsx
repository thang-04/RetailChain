import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import storeService from '@/services/store.service';

const StoreInventoryDetail = () => {
    const { id } = useParams();
    const [store, setStore] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStore = async () => {
            try {
                const data = await storeService.getStoreById(id);
                setStore(data);
            } catch (error) {
                console.error("Fetch store error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStore();
    }, [id]);

    if (loading) return <div className="p-10 text-center">Loading...</div>;
    if (!store) return <div className="p-10 text-center">Store not found</div>;

    const inventory = store.inventory || [];

    // Derived stats
    const totalItems = inventory.reduce((sum, item) => sum + (item.stock || 0), 0);
    const lowStockAlerts = inventory.filter(item => item.status === 'Low Stock' || item.stock < 10).length;

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Store Inventory: {store.name}</h2>
                    <p className="text-muted-foreground">Real-time stock levels at {store.address}</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">Request Stock</Button>
                    <Button variant="destructive">Report Loss</Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Items (Pieces)</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold">{totalItems}</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Low Stock Alerts</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold text-red-500">{lowStockAlerts}</div></CardContent>
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
                                <TableHead className="text-right">Price</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>SKU</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {inventory.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.name}</TableCell>
                                    <TableCell>{item.category}</TableCell>
                                    <TableCell className="text-right font-bold">{item.stock}</TableCell>
                                    <TableCell className="text-right text-muted-foreground">{item.price}</TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            item.status === 'In Stock' ? 'default' :
                                                item.status === 'Low Stock' ? 'destructive' : 'outline'
                                        }>
                                            {item.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{item.sku}</TableCell>
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
