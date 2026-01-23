import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import inventoryService from '@/services/inventory.service';

const ExecutiveReport = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetch = async () => {
            const result = await inventoryService.getExecutiveReport();
            setData(result);
        };
        fetch();
    }, []);

    if (!data) return <div className="p-6">Loading report data...</div>;

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Executive Report</h2>
                    <p className="text-muted-foreground">High-level insights on inventory & workforce.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">Export PDF</Button>
                    <Button>This Month</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Inventory Value</CardTitle></CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1.25B VND</div>
                        <p className="text-xs text-green-600 font-medium">+12% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Turnover Rate</CardTitle></CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.turnoverRate}x</div>
                         <p className="text-xs text-muted-foreground">Target: 5.0x</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Low Stock SKUs</CardTitle></CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-500">{data.lowStockItems}</div>
                         <p className="text-xs text-muted-foreground">Requires attention</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Staff Efficiency</CardTitle></CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">94%</div>
                         <p className="text-xs text-green-600 font-medium">Top 5% region</p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="inventory" className="w-full">
                <TabsList>
                    <TabsTrigger value="inventory">Inventory Analysis</TabsTrigger>
                    <TabsTrigger value="workforce">Workforce Insights</TabsTrigger>
                </TabsList>
                <TabsContent value="inventory" className="space-y-4 pt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Stock Distribution by Location</CardTitle>
                            <CardDescription>Value distribution across chain network</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[300px] flex items-end justify-around pb-4">
                            {/* Simple CSS Bar Chart Simulation */}
                            {data.stockDistribution.map((item) => (
                                <div key={item.name} className="flex flex-col items-center gap-2 group w-full">
                                    <div 
                                        className="w-16 bg-primary/80 rounded-t-md transition-all group-hover:bg-primary"
                                        style={{ height: `${item.value * 3}px` }} 
                                    ></div>
                                    <span className="text-sm font-medium">{item.name}</span>
                                    <span className="text-xs text-muted-foreground">{item.value}%</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="workforce" className="pt-4">
                     <Card>
                        <CardContent className="pt-6">
                            <p className="text-center text-muted-foreground">Workforce analytics module is loading...</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default ExecutiveReport;
