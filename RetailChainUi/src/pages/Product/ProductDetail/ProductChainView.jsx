import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import inventoryService from '@/services/inventory.service';

const ProductChainView = () => {
    // In real app, fetch product detail by ID
    const [chainStock, setChainStock] = useState([]);
    const product = {
        name: "Fresh Milk 1L",
        sku: "DAIRY-001",
        price: 35000,
        category: "Dairy",
        description: "Fresh cow milk, pasteurized. Keep refrigerated.",
        image: "https://placehold.co/100x100?text=Milk"
    };

    useEffect(() => {
        const fetch = async () => {
            const data = await inventoryService.getProductChainStock("P001");
            setChainStock(data);
        };
        fetch();
    }, []);

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">Chi tiết sản phẩm</h2>
                <div className="flex gap-2">
                    <Button variant="destructive">Ngừng kinh doanh</Button>
                    <Button>Lưu thay đổi</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                    <CardHeader><CardTitle>Thông tin chung</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Tên sản phẩm</Label>
                                <Input defaultValue={product.name} />
                            </div>
                            <div className="space-y-2">
                                <Label>SKU</Label>
                                <Input defaultValue={product.sku} disabled />
                            </div>
                            <div className="space-y-2">
                                <Label>Danh mục</Label>
                                <Input defaultValue={product.category} />
                            </div>
                            <div className="space-y-2">
                                <Label>Giá bán (VND)</Label>
                                <Input type="number" defaultValue={product.price} />
                            </div>
                        </div>
                         <div className="space-y-2">
                            <Label>Mô tả</Label>
                            <Input defaultValue={product.description} />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>Hình ảnh sản phẩm</CardTitle></CardHeader>
                    <CardContent className="flex flex-col items-center">
                        <img src={product.image} alt="Sản phẩm" className="rounded-lg border mb-4 w-48 h-48 object-cover" />
                        <Button variant="outline" className="w-full">Đổi ảnh</Button>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Tình trạng tồn kho toàn hệ thống</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Vị trí</TableHead>
                                <TableHead className="w-[300px]">Mức độ sẵn có</TableHead>
                                <TableHead className="text-right">Số lượng</TableHead>
                                <TableHead className="text-right">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {chainStock.map((loc) => (
                                <TableRow key={loc.storeId}>
                                    <TableCell className="font-medium">{loc.storeName}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Progress value={Math.min((loc.stock / 200) * 100, 100)} className="h-2" />
                                            <span className="text-xs text-muted-foreground">{loc.status}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-bold text-lg">{loc.stock}</TableCell>
                                    <TableCell className="text-right">
                                        <Button size="sm" variant="outline">Bổ sung hàng</Button>
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

export default ProductChainView;
