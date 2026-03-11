import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Search, Plus, Trash2, Package, AlertCircle } from 'lucide-react';

const StepTwoProducts = ({ items, setItems, productVariants, categories, errors }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('ALL');

    const filteredProducts = useMemo(() => {
        return productVariants.filter(variant => {
            const matchesSearch = searchTerm === '' || 
                variant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                variant.sku.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesCategory = categoryFilter === 'ALL' || variant.categoryName === categoryFilter;
            
            return matchesSearch && matchesCategory;
        });
    }, [productVariants, searchTerm, categoryFilter]);

    const selectedVariantIds = items.filter(i => i.variantId).map(i => parseInt(i.variantId));
    const availableProducts = filteredProducts.filter(p => !selectedVariantIds.includes(p.id));

    const handleAddItem = (variant) => {
        setItems([...items, { 
            id: Date.now(), 
            variantId: String(variant.id), 
            quantity: 1,
            productName: variant.productName,
            sku: variant.sku,
            size: variant.size,
            color: variant.color
        }]);
    };

    const handleRemoveItem = (id) => {
        if (items.length > 1) {
            setItems(items.filter(item => item.id !== id));
        }
    };

    const handleQuantityChange = (id, value) => {
        const qty = parseInt(value) || 0;
        setItems(items.map(item => 
            item.id === id ? { ...item, quantity: qty } : item
        ));
    };

    const totalQuantity = items.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0);

    return (
        <div className="space-y-6">
            {/* Product Selection */}
            <Card className="border-amber-100 shadow-sm">
                <CardHeader className="bg-amber-50 border-b border-amber-100">
                    <CardTitle className="text-lg flex items-center gap-2 text-amber-700">
                        <Package className="w-5 h-5" />
                        Chọn sản phẩm xuất
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                    {/* Filters */}
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <Label className="text-sm mb-2 block">Tìm kiếm</Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    placeholder="Tìm theo tên sản phẩm, SKU..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="w-64">
                            <Label className="text-sm mb-2 block">Danh mục</Label>
                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Tất cả danh mục" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">Tất cả danh mục</SelectItem>
                                    {categories.map(cat => (
                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Available Products List */}
                    <div className="border rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader className="bg-gray-50">
                                <TableRow>
                                    <TableHead className="font-medium">Sản phẩm</TableHead>
                                    <TableHead className="font-medium">SKU</TableHead>
                                    <TableHead className="font-medium">Danh mục</TableHead>
                                    <TableHead className="font-medium w-24">Thao tác</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {availableProducts.length > 0 ? (
                                    availableProducts.slice(0, 10).map((variant) => (
                                        <TableRow key={variant.id} className="hover:bg-gray-50">
                                            <TableCell className="font-medium">
                                                <div>
                                                    <p>{variant.productName}</p>
                                                    <p className="text-xs text-gray-500">{variant.size} / {variant.color}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>{variant.sku}</TableCell>
                                            <TableCell>{variant.categoryName}</TableCell>
                                            <TableCell>
                                                <Button 
                                                    size="sm" 
                                                    variant="outline"
                                                    onClick={() => handleAddItem(variant)}
                                                    className="text-amber-600 border-amber-200 hover:bg-amber-50"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-8 text-gray-400">
                                            {productVariants.length === 0 ? (
                                                <div className="flex items-center justify-center gap-2">
                                                    <AlertCircle className="w-4 h-4" />
                                                    <span>Không có sản phẩm nào</span>
                                                </div>
                                            ) : (
                                                <span>Không tìm thấy sản phẩm phù hợp</span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Selected Items */}
            <Card className="border-amber-100 shadow-sm">
                <CardHeader className="bg-amber-50 border-b border-amber-100">
                    <CardTitle className="text-lg flex items-center gap-2 text-amber-700">
                        <Package className="w-5 h-5" />
                        Danh sách xuất ({items.filter(i => i.variantId).length} sản phẩm)
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    {errors.items && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-red-600">
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-sm">{errors.items}</span>
                        </div>
                    )}
                    
                    {items.filter(i => i.variantId).length > 0 ? (
                        <Table>
                            <TableHeader className="bg-gray-50">
                                <TableRow>
                                    <TableHead className="font-medium">Sản phẩm</TableHead>
                                    <TableHead className="font-medium">SKU</TableHead>
                                    <TableHead className="font-medium w-32">Số lượng</TableHead>
                                    <TableHead className="font-medium w-24">Thao tác</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {items.filter(i => i.variantId).map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">
                                            <div>
                                                <p>{item.productName || item.name}</p>
                                                <p className="text-xs text-gray-500">{item.size} / {item.color}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>{item.sku}</TableCell>
                                        <TableCell>
                                            <Input
                                                type="number"
                                                min="1"
                                                value={item.quantity}
                                                onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                                className="w-24"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Button 
                                                size="sm" 
                                                variant="ghost"
                                                onClick={() => handleRemoveItem(item.id)}
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="text-center py-8 text-gray-400">
                            <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p>Chưa chọn sản phẩm nào</p>
                            <p className="text-sm">Click nút + để thêm sản phẩm</p>
                        </div>
                    )}

                    {items.filter(i => i.variantId).length > 0 && (
                        <div className="mt-4 p-4 bg-amber-50 rounded-lg flex justify-between items-center">
                            <span className="font-medium text-amber-800">Tổng số lượng:</span>
                            <span className="text-2xl font-bold text-amber-600">{totalQuantity}</span>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default StepTwoProducts;
