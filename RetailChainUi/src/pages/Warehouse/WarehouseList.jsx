// src/pages/Warehouse/WarehouseList.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Progress } from "../../components/ui/progress";
import { Plus, Search, MapPin, Package } from 'lucide-react';
import inventoryService from "../../services/inventory.service";

const WarehouseList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const res = await inventoryService.getAllWarehouses();
        if (res.data) {
           // Transform backend data to UI format if needed, or use directly
           const transformed = res.data.map(wh => ({
             ...wh,
             // Mock missing fields for UI demo
             address: wh.warehouseType === 1 ? "Central Hub" : `Store ${wh.storeId || 'N/A'}`,
             manager: "N/A",
             utilization: Math.floor(Math.random() * 100), // Mock
             capacity: 10000,
             currentStock: Math.floor(Math.random() * 8000)
           }));
           setWarehouses(transformed);
        }
      } catch (error) {
        console.error("Failed to fetch warehouses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWarehouses();
  }, []);

  const filteredWarehouses = warehouses.filter(wh => 
    wh.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (wh.code && wh.code.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusBadge = (status, utilization) => {
    if (status !== 1) return <Badge variant="secondary">Inactive</Badge>;
    if (utilization > 90) return <Badge variant="destructive">Overload</Badge>;
    if (utilization > 70) return <Badge className="bg-orange-500 hover:bg-orange-600">High Usage</Badge>;
    return <Badge className="bg-green-600 hover:bg-green-700">Active</Badge>;
  };

  if (loading) {
    return <div className="p-6 text-center">Loading warehouses...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Warehouse Management</h1>
          <p className="text-muted-foreground mt-1">Manage central warehouses and distribution centers.</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus size={16} /> Add Warehouse
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Warehouses</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{warehouses.length}</div>
            <p className="text-xs text-muted-foreground">Active locations</p>
          </CardContent>
        </Card>
         {/* ... (Other metrics cards can be kept static or calculated) ... */}
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Warehouses List</CardTitle>
            <div className="relative w-72">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search warehouse..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Name / Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Utilization (Mock)</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWarehouses.map((wh) => (
                <TableRow 
                  key={wh.id} 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => navigate(`/warehouse/${wh.id}`)}
                >
                  <TableCell className="font-medium">{wh.code}</TableCell>
                  <TableCell>
                    <div className="font-semibold">{wh.name}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin size={12} /> {wh.warehouseType === 1 ? 'Main Warehouse' : 'Store Warehouse'}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(wh.status, wh.utilization)}
                  </TableCell>
                  <TableCell className="w-[200px]">
                    <div className="flex items-center gap-2">
                      <Progress value={wh.utilization} className="h-2" />
                      <span className="text-sm font-medium w-12">{wh.utilization}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={(e) => {
                        e.stopPropagation();
                    }}>Edit</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default WarehouseList;
