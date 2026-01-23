// src/pages/Warehouse/WarehouseList.jsx
import { useState } from 'react';
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

const WarehouseList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Dummy data
  const warehouses = [
    {
      id: 'WH-001',
      name: 'Central Hub North',
      address: '123 Industrial Blvd, North District',
      capacity: 50000,
      currentStock: 42150,
      utilization: 84.3,
      status: 'Active',
      manager: 'Nguyen Van A'
    },
    {
      id: 'WH-002',
      name: 'South Distribution Center',
      address: '456 Logistics Way, South Zone',
      capacity: 30000,
      currentStock: 12500,
      utilization: 41.6,
      status: 'Active',
      manager: 'Tran Thi B'
    },
    {
      id: 'WH-003',
      name: 'East Coast Storage',
      address: '789 Harbor Rd, East Port',
      capacity: 40000,
      currentStock: 38900,
      utilization: 97.2,
      status: 'Warning',
      manager: 'Le Van C'
    },
    {
      id: 'WH-004',
      name: 'West Overflow Unit',
      address: '321 Backup Ln, West Side',
      capacity: 15000,
      currentStock: 2000,
      utilization: 13.3,
      status: 'Maintenance',
      manager: 'Pham Thi D'
    }
  ];

  const filteredWarehouses = warehouses.filter(wh => 
    wh.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    wh.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status, utilization) => {
    if (status === 'Maintenance') return <Badge variant="secondary">Maintenance</Badge>;
    if (utilization > 90) return <Badge variant="destructive">Overload</Badge>;
    if (utilization > 70) return <Badge className="bg-orange-500 hover:bg-orange-600">High Usage</Badge>;
    return <Badge className="bg-green-600 hover:bg-green-700">Optimal</Badge>;
  };

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
            <CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">135,000</div>
            <p className="text-xs text-muted-foreground">Units across all warehouses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Utilization</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">70.8%</div>
            <p className="text-xs text-muted-foreground">+2.1% from last month</p>
          </CardContent>
        </Card>
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
                <TableHead>ID</TableHead>
                <TableHead>Name / Address</TableHead>
                <TableHead>Manager</TableHead>
                <TableHead>Capacity Status</TableHead>
                <TableHead>Utilization</TableHead>
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
                  <TableCell className="font-medium">{wh.id}</TableCell>
                  <TableCell>
                    <div className="font-semibold">{wh.name}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin size={12} /> {wh.address}
                    </div>
                  </TableCell>
                  <TableCell>{wh.manager}</TableCell>
                  <TableCell>
                    {getStatusBadge(wh.status, wh.utilization)}
                  </TableCell>
                  <TableCell className="w-[200px]">
                    <div className="flex items-center gap-2">
                      <Progress value={wh.utilization} className="h-2" />
                      <span className="text-sm font-medium w-12">{wh.utilization}%</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {wh.currentStock.toLocaleString()} / {wh.capacity.toLocaleString()} units
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={(e) => {
                        e.stopPropagation();
                        // Edit logic
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
