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
import warehouseService from '../../services/warehouse.service';

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
            const wh = await warehouseService.getWarehouseById(id || 'WH001');
            const inv = await warehouseService.getWarehouseInventory(id || 'WH001');
            setWarehouseInfo(wh);
            setInventoryData(inv);
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
            ID: {warehouseInfo.id} • Manager: {warehouseInfo.info?.manager || warehouseInfo.manager}
          </p>
        </div>
        <div className="ml-auto flex gap-2">
            <Button variant="outline">Export Report</Button>
            <Button>Create Transfer</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Items</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{warehouseInfo.metrics?.totalItems || "---"}</div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Low Stock Alerts</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-orange-600 flex items-center gap-2">
                    12 <AlertTriangle size={18} />
                </div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Pending Inbound</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold flex items-center gap-2">
                    {warehouseInfo.metrics?.inboundDaily || "3 Orders"} <Truck size={18} className="text-muted-foreground"/>
                </div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Occupancy</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{warehouseInfo.utilization || "84.3"}%</div>
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
                                    placeholder="Search SKU, Product Name..." 
                                    className="pl-8"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>SKU</TableHead>
                                <TableHead>Product Name</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead className="text-right">Quantity</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {inventoryData.map((item) => (
                                <TableRow key={item.id || item.sku}>
                                    <TableCell className="font-medium">{item.id || item.sku}</TableCell>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.category || "General"}</TableCell>
                                    <TableCell className="text-right font-bold">{item.stock.toLocaleString()}</TableCell>
                                    <TableCell>{getStockStatusBadge(item.stock)}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm">History</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>
        
        <TabsContent value="inbound">
            <Card>
                <CardHeader>
                    <CardTitle>Inbound Shipments</CardTitle>
                    <CardDescription>Recent stock arrivals from suppliers or returns.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Inbound ID</TableHead>
                                <TableHead>Source</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Items Count</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {/* Mock inbound data inside component for now as service doesn't have it explicitly separate for detail view yet */}
                            {[
                                { id: 'IB-2023-001', source: 'Supplier ABC Corp', date: '2023-10-25', items: 500, status: 'Completed' },
                                { id: 'IB-2023-002', source: 'Factory Direct', date: '2023-10-26', items: 1200, status: 'Processing' },
                                { id: 'IB-2023-003', source: 'Store Return (HCM-01)', date: '2023-10-27', items: 50, status: 'Pending' },
                            ].map((ib) => (
                                <TableRow key={ib.id}>
                                    <TableCell className="font-medium">{ib.id}</TableCell>
                                    <TableCell>{ib.source}</TableCell>
                                    <TableCell>{ib.date}</TableCell>
                                    <TableCell>{ib.items}</TableCell>
                                    <TableCell>
                                        <Badge variant={ib.status === 'Completed' ? 'default' : 'secondary'}>{ib.status}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm">View</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>
        
        <TabsContent value="outbound">
            <Card>
                <CardHeader>
                    <CardTitle>Outbound Shipments</CardTitle>
                    <CardDescription>Stock dispatched to stores or distribution centers.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Outbound ID</TableHead>
                                <TableHead>Destination</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Items Count</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                             {/* Mock outbound data */}
                            {[
                                { id: 'OB-2023-882', dest: 'Store HCM-01 (Nguyen Hue)', date: '2023-10-24', items: 200, status: 'Shipped' },
                                { id: 'OB-2023-883', dest: 'Store HN-05 (Cau Giay)', date: '2023-10-25', items: 150, status: 'Delivered' },
                                { id: 'OB-2023-884', dest: 'Store DN-02 (Dragon Bridge)', date: '2023-10-26', items: 300, status: 'Packing' },
                            ].map((ob) => (
                                <TableRow key={ob.id}>
                                    <TableCell className="font-medium">{ob.id}</TableCell>
                                    <TableCell>{ob.dest}</TableCell>
                                    <TableCell>{ob.date}</TableCell>
                                    <TableCell>{ob.items}</TableCell>
                                    <TableCell>
                                        <Badge variant={ob.status === 'Delivered' ? 'default' : 'outline'}>{ob.status}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm">Track</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WarehouseDetail;

