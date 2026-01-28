// src/pages/Warehouse/WarehouseDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { ArrowLeft, Package, AlertTriangle, Truck, History, Search, Filter } from 'lucide-react';
import inventoryService from '../../services/inventory.service';

const WarehouseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [warehouseInfo, setWarehouseInfo] = useState(null);
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        try {
            setLoading(true);
            
            // Fetch Warehouse Info (Client-side filter since no detail API yet)
            const whRes = await inventoryService.getAllWarehouses();
            const foundWh = whRes.data ? whRes.data.find(w => String(w.id) === id) : null;
            
            if (foundWh) {
                setWarehouseInfo({
                    ...foundWh,
                    manager: "N/A", // Mock field
                    metrics: {
                        totalItems: 0, // Will be calculated from stock
                        inboundDaily: "N/A"
                    }
                });

                // Fetch Stock
                const stockRes = await inventoryService.getStockByWarehouse(id);
                if (stockRes.data) {
                    setInventoryData(stockRes.data);
                    // Update metrics based on real stock data
                    setWarehouseInfo(prev => ({
                        ...prev,
                        metrics: {
                            ...prev.metrics,
                            totalItems: stockRes.data.reduce((sum, item) => sum + item.quantity, 0)
                        }
                    }));
                }
            }
        } catch (error) {
            console.error("Failed to fetch warehouse details:", error);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, [id]);

  const getStockStatusBadge = (stock) => {
    // Determine status based on stock level logic (simplified)
    if (stock <= 0) return <Badge variant="destructive">Out of Stock</Badge>;
    if (stock < 50) return <Badge className="bg-orange-500 hover:bg-orange-600">Low Stock</Badge>;
    if (stock > 2000) return <Badge variant="secondary">Overstock</Badge>;
    return <Badge className="bg-green-600 hover:bg-green-700">In Stock</Badge>;
  };

  if (loading) return <div className="p-10 text-center">Loading warehouse details...</div>;
  if (!warehouseInfo) return <div className="p-10 text-center">Warehouse not found</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/warehouse')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{warehouseInfo.name}</h1>
          <p className="text-muted-foreground flex items-center gap-2">
            Code: {warehouseInfo.code} • Type: {warehouseInfo.warehouseType === 1 ? 'Main' : 'Store'}
          </p>
        </div>
        <div className="ml-auto flex gap-2">
            <Button variant="outline">Export Report</Button>
            <Button onClick={() => navigate('/transfers')}>Create Transfer</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Items</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{warehouseInfo.metrics?.totalItems || 0}</div>
            </CardContent>
        </Card>
        {/* ... Other cards kept static for now ... */}
         <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Occupancy</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">---%</div>
            </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="inventory" className="w-full">
        <TabsList>
          <TabsTrigger value="inventory">Inventory List</TabsTrigger>
          <TabsTrigger value="inbound">Inbound History</TabsTrigger>
          <TabsTrigger value="outbound">Outbound History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="inventory" className="space-y-4">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Current Inventory</CardTitle>
                        <div className="flex gap-2">
                            <div className="relative w-64">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input 
                                    placeholder="Search SKU..." 
                                    className="pl-8"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Variant ID</TableHead>
                                <TableHead>Product Name (Mock)</TableHead>
                                <TableHead className="text-right">Quantity</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Last Updated</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {inventoryData.filter(item => 
                                !searchTerm || String(item.variantId).includes(searchTerm)
                            ).map((item) => (
                                <TableRow key={item.variantId}>
                                    <TableCell className="font-medium">{item.variantId}</TableCell>
                                    <TableCell>Product Variant #{item.variantId}</TableCell>
                                    <TableCell className="text-right font-bold">{item.quantity.toLocaleString()}</TableCell>
                                    <TableCell>{getStockStatusBadge(item.quantity)}</TableCell>
                                    <TableCell className="text-right">
                                        {new Date(item.updatedAt).toLocaleDateString()}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {inventoryData.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-4">No inventory found in this warehouse.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>
        
        {/* Inbound/Outbound tabs kept as mocks since no API for history yet */}
        <TabsContent value="inbound">
            <div className="p-4 text-center text-muted-foreground">Inbound history not available yet (API Pending)</div>
        </TabsContent>
        <TabsContent value="outbound">
            <div className="p-4 text-center text-muted-foreground">Outbound history not available yet (API Pending)</div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WarehouseDetail;

