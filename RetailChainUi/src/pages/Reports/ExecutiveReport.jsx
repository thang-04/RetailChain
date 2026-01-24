import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import dashboardService from "@/services/dashboard.service";
import inventoryService from '@/services/inventory.service';

const ExecutiveReport = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                // Using dashboard service which aggregates or provides report data
                // In a real app this might be a specialized report endpoint
                const result = await dashboardService.getExecutiveReport();
                // Or if it was supposed to come from inventory service for specific parts
                // we can mix and match. The original code used inventoryService.getExecutiveReport()
                // Let's stick to dashboard service if it has it (it does in my mock read earlier)
                // Actually, I saw `dashboardService.getExecutiveReport` in `dashboard.service.js`.
                setData(result);
            } catch (error) {
                console.error("Failed to fetch report:", error);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    if (loading || !data) return <div className="p-6">Loading report data...</div>;

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
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle></CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.overview?.totalRevenue || "---"}</div>
                        <p className="text-xs text-green-600 font-medium">{data.overview?.yoyGrowth || "---"} YoY</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Profit</CardTitle></CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.overview?.totalProfit || "---"}</div>
                         <p className="text-xs text-muted-foreground">Target: 40.0B</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Costs</CardTitle></CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-500">{data.overview?.totalCosts || "---"}</div>
                         <p className="text-xs text-muted-foreground">Operating expenses</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Regional efficiency</CardTitle></CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">94%</div>
                         <p className="text-xs text-green-600 font-medium">Top 5% region</p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="overview" className="w-full">
                <TabsList>
                    <TabsTrigger value="overview">Regional Overview</TabsTrigger>
                    <TabsTrigger value="category">Category Analysis</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-4 pt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Revenue by Region</CardTitle>
                            <CardDescription>Performance distribution across regions</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[300px] flex items-end justify-around pb-4">
                            {/* Simple CSS Bar Chart Simulation */}
                            {data.regionalPerformance?.map((item) => (
                                <div key={item.region} className="flex flex-col items-center gap-2 group w-full">
                                    <div 
                                        className="w-16 bg-primary/80 rounded-t-md transition-all group-hover:bg-primary"
                                        style={{ height: `${parseInt(item.revenue) * 2}px` }} 
                                    ></div>
                                    <span className="text-sm font-medium">{item.region}</span>
                                    <span className="text-xs text-muted-foreground">{item.revenue}</span>
                                </div>
                            )) || <div>No data</div>}
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="category" className="pt-4">
                     <Card>
                        <CardContent className="pt-6">
                            <div className="space-y-4">
                                {data.categoryPerformance?.map((cat) => (
                                    <div key={cat.category} className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <p className="font-medium">{cat.category}</p>
                                            <p className="text-sm text-muted-foreground">Growth: {cat.growth}</p>
                                        </div>
                                        <div className="font-bold">{cat.share} share</div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default ExecutiveReport;
