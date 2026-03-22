import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

const ResourceAssignment = () => {
    const stores = [
        { name: "Store A", staffCount: 12, capacity: 15, utilization: 80 },
        { name: "Store B", staffCount: 8, capacity: 10, utilization: 80 },
        { name: "Store C", staffCount: 5, capacity: 12, utilization: 41 },
        { name: "Central Warehouse", staffCount: 20, capacity: 25, utilization: 80 },
    ];

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Resource Assignment</h2>
                    <p className="text-muted-foreground">Optimize staff distribution across stores.</p>
                </div>
                <Button>Rebalance Resources</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stores.map((store) => (
                    <Card key={store.name}>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">{store.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{store.staffCount} / {store.capacity}</div>
                            <p className="text-xs text-muted-foreground mb-2">Staff Members</p>
                            <Progress value={store.utilization} className="h-2" />
                            <p className="text-xs text-right mt-1 text-muted-foreground">{store.utilization}% Full</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Transfer Requests</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Staff Name</TableHead>
                                <TableHead>From Store</TableHead>
                                <TableHead>To Store</TableHead>
                                <TableHead>Reason</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-medium">Le Van C</TableCell>
                                <TableCell>Store B</TableCell>
                                <TableCell>Store A</TableCell>
                                <TableCell>Promotion to Manager</TableCell>
                                <TableCell><span className="text-yellow-600 font-medium">Pending</span></TableCell>
                                <TableCell className="text-right">
                                    <Button size="sm" variant="outline">Review</Button>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">Hoang Van E</TableCell>
                                <TableCell>Store C</TableCell>
                                <TableCell>Central Warehouse</TableCell>
                                <TableCell>Temporary Support</TableCell>
                                <TableCell><span className="text-green-600 font-medium">Approved</span></TableCell>
                                <TableCell className="text-right">
                                    <Button size="sm" variant="ghost" disabled>Approved</Button>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default ResourceAssignment;
