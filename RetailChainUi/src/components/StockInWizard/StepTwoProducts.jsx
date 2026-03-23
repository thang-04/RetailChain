import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Trash2, Package, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

const StepTwoProducts = ({
    items,
    setItems,
    productVariants,
    categories,
    errors,
    summary
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [filterSize, setFilterSize] = useState('');
    const [filterColor, setFilterColor] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    // Get unique categories, sizes, colors from productVariants
    const { categories: allCategories, sizes, colors } = useMemo(() => {
        const cats = new Set();
        const szs = new Set();
        const clrs = new Set();

        productVariants.forEach(pv => {
            if (pv.categoryName) cats.add(pv.categoryName);
            if (pv.size) szs.add(pv.size);
            if (pv.color) clrs.add(pv.color);
        });

        return {
            categories: Array.from(cats),
            sizes: Array.from(szs),
            colors: Array.from(clrs)
        };
    }, [productVariants]);

    // Filter product variants
    const filteredVariants = useMemo(() => {
        return productVariants.filter(variant => {
            const matchesSearch = !searchTerm ||
                variant.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                variant.sku?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = !filterCategory || variant.categoryName === filterCategory;
            const matchesSize = !filterSize || variant.size === filterSize;
            const matchesColor = !filterColor || variant.color === filterColor;

            return matchesSearch && matchesCategory && matchesSize && matchesColor;
        });
    }, [productVariants, searchTerm, filterCategory, filterSize, filterColor]);

    const handleAddItem = () => {
        setItems([...items, { id: Date.now(), variantId: '', quantity: 1 }]);
    };

    const handleRemoveItem = (id) => {
        if (items.length > 1) {
            setItems(items.filter(item => item.id !== id));
        } else {
            setItems([{ id: Date.now(), variantId: '', quantity: 1 }]);
        }
    };

    const handleItemChange = (id, field, value) => {
        setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    const getVariantInfo = (variantId) => {
        return productVariants.find(v => v.id === Number(variantId));
    };

    const hasDuplicates = useMemo(() => {
        const ids = items.map(i => i.variantId).filter(Boolean);
        return new Set(ids).size !== ids.length;
    }, [items]);

    return (
        <div className="space-y-6">
            {/* Search & Filter Bar */}
            <Card className="border-border shadow-sm">
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search Input */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Tìm kiếm sản phẩm theo tên hoặc SKU..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        {/* Filter Toggle */}
                        <Button
                            variant="outline"
                            onClick={() => setShowFilters(!showFilters)}
                            className={cn(showFilters && "bg-accent border-input")}
                        >
                            <Filter className="w-4 h-4 mr-2" />
                            Bộ lọc
                            {(filterCategory || filterSize || filterColor) && (
                                <Badge variant="secondary" className="ml-2">
                                    {(filterCategory ? 1 : 0) + (filterSize ? 1 : 0) + (filterColor ? 1 : 0)}
                                </Badge>
                            )}
                        </Button>
                    </div>

                    {/* Filter Options */}
                    {showFilters && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t">
                            <div className="space-y-2">
                                <label className="text-xs font-medium">Danh mục</label>
                                <Select value={filterCategory || "all"} onValueChange={(v) => setFilterCategory(v === "all" ? "" : v)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Tất cả danh mục" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tất cả</SelectItem>
                                        {allCategories.map(cat => (
                                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium">Size</label>
                                <Select value={filterSize || "all"} onValueChange={(v) => setFilterSize(v === "all" ? "" : v)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Tất cả size" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tất cả</SelectItem>
                                        {sizes.map(sz => (
                                            <SelectItem key={sz} value={sz}>{sz}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium">Màu sắc</label>
                                <Select value={filterColor || "all"} onValueChange={(v) => setFilterColor(v === "all" ? "" : v)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Tất cả màu" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tất cả</SelectItem>
                                        {colors.map(clr => (
                                            <SelectItem key={clr} value={clr}>{clr}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Duplicate Warning */}
            {hasDuplicates && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center gap-2">
                    <Package className="w-5 h-5 text-amber-500" />
                    <span className="text-sm text-amber-700">
                        Cảnh báo: Có sản phẩm trùng lặp trong danh sách. Vui lòng kiểm tra lại.
                    </span>
                </div>
            )}

            {/* Products Table */}
            <Card className="border-border shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between bg-secondary/50 border-b">
                    <CardTitle className="text-lg flex items-center gap-2 text-foreground">
                        <Package className="w-5 h-5" />
                        Danh sách hàng hóa
                    </CardTitle>
                    <Button variant="outline" size="sm" onClick={handleAddItem} className="gap-2">
                        <Plus className="w-4 h-4" /> Thêm sản phẩm
                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[45%]">Sản phẩm (SKU)</TableHead>
                                <TableHead>Số lượng</TableHead>
                                <TableHead className="w-[100px]">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.map((item) => {
                                const variantInfo = getVariantInfo(item.variantId);
                                return (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            <Select
                                                value={String(item.variantId)}
                                                onValueChange={(val) => handleItemChange(item.id, 'variantId', val)}
                                            >
                                                <SelectTrigger className={errors[`item_${item.id}`] ? "border-red-500" : ""}>
                                                    <SelectValue placeholder="Chọn sản phẩm" />
                                                </SelectTrigger>
                                                <SelectContent className="max-h-60">
                                                    {filteredVariants.length > 0 ? (
                                                        filteredVariants.map(v => (
                                                            <SelectItem key={v.id} value={String(v.id)}>
                                                                <div className="flex flex-col">
                                                                    <span className="font-medium">{v.productName || v.name}</span>
                                                                    <span className="text-xs text-muted-foreground">
                                                                        SKU: {v.sku} | Size: {v.size} | Màu: {v.color}
                                                                    </span>
                                                                </div>
                                                            </SelectItem>
                                                        ))
                                                    ) : (
                                                        <SelectItem value="no-result" disabled>
                                                            Không tìm thấy sản phẩm
                                                        </SelectItem>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            {errors[`item_${item.id}`] && (
                                                <p className="text-xs text-red-500 mt-1">{errors[`item_${item.id}`]}</p>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                type="number"
                                                min="1"
                                                value={item.quantity}
                                                onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)}
                                                className={`w-24 ${errors[`qty_${item.id}`] ? "border-red-500" : ""}`}
                                            />
                                            {errors[`qty_${item.id}`] && (
                                                <p className="text-xs text-red-500 mt-1">{errors[`qty_${item.id}`]}</p>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => handleRemoveItem(item.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>

                    {/* Summary Panel */}
                    {items.length > 0 && (
                        <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                            <h4 className="font-medium text-foreground mb-3">Tổng quan đơn nhập</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <p className="text-xs text-muted-foreground">Tổng dòng</p>
                                    <p className="text-2xl font-bold text-primary">{items.filter(i => i.variantId).length}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Tổng số lượng</p>
                                    <p className="text-2xl font-bold text-primary">
                                        {items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Sản phẩm hợp lệ</p>
                                    <p className="text-2xl font-bold text-green-600">
                                        {items.filter(i => i.variantId && i.quantity > 0).length}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Sản phẩm chưa chọn</p>
                                    <p className="text-2xl font-bold text-amber-600">
                                        {items.filter(i => !i.variantId).length}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default StepTwoProducts;
