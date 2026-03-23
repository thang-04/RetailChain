import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Search, Plus, Trash2, Package, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';

const StepTwoProducts = ({ items, setItems, productVariants, categories, errors }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('ALL');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

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

    const totalPages = Math.ceil(availableProducts.length / itemsPerPage);
    const paginatedProducts = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return availableProducts.slice(start, start + itemsPerPage);
    }, [availableProducts, currentPage]);

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
        if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
            return;
        }
        if (items.length > 1) {
            setItems(items.filter(item => item.id !== id));
        } else {
            setItems([{ id: Date.now(), variantId: '', quantity: 1 }]);
        }
    };

    const handleQuantityChange = (id, value) => {
        const qty = Number(value) || 0;
        setItems(items.map(item =>
            item.id === id ? { ...item, quantity: qty } : item
        ));
    };

    const totalQuantity = items.filter(i => i.variantId).reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);

    const selectedItems = items.filter(i => i.variantId);

    return (
        <div className="space-y-6">
            {/* Product Selection */}
            <Card className="border-border shadow-sm">
                <CardHeader className="bg-primary/5 border-b border-border pb-4">
                    <CardTitle className="text-base flex items-center gap-2 text-primary">
                        <Package className="w-4 h-4" />
                        Chọn sản phẩm để xuất kho
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                    {/* Filters - Compact row */}
                    <div className="flex flex-wrap gap-3">
                        <div className="flex-1 min-w-[200px]">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Tìm sản phẩm..."
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="pl-9 h-10"
                                />
                            </div>
                        </div>
                        <div className="w-48">
                            <Select value={categoryFilter} onValueChange={(val) => { setCategoryFilter(val); setCurrentPage(1); }}>
                                <SelectTrigger className="h-10">
                                    <SelectValue placeholder="Danh mục" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">Tất cả</SelectItem>
                                    {categories.map(cat => (
                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Products List - Compact with scroll */}
                    <div className="border border-border rounded-lg overflow-hidden">
                        <div className="max-h-[320px] overflow-y-auto">
                            <Table>
                                <TableHeader className="sticky top-0 bg-muted">
                                    <TableRow>
                                        <TableHead className="h-9 font-medium text-sm">Sản phẩm</TableHead>
                                        <TableHead className="h-9 font-medium text-sm w-20">Thao tác</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedProducts.length > 0 ? (
                                        paginatedProducts.map((variant) => (
                                            <TableRow key={variant.id} className="h-11">
                                                <TableCell className="py-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium text-sm truncate max-w-[300px]">{variant.productName}</span>
                                                        <span className="text-xs text-muted-foreground shrink-0">{variant.sku}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-2">
                                                    <Button 
                                                        size="icon" 
                                                        variant="ghost"
                                                        onClick={() => handleAddItem(variant)}
                                                        className="h-7 w-7 text-primary hover:bg-primary/10"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={2} className="text-center py-6 text-muted-foreground text-sm">
                                                {productVariants.length === 0 ? 'Không có sản phẩm nào' : 'Không tìm thấy sản phẩm'}
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between px-3 py-2 border-t bg-muted/50 text-sm">
                                <span className="text-muted-foreground text-xs">
                                    {availableProducts.length} sản phẩm
                                </span>
                                <div className="flex items-center gap-1">
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-7 w-7"
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                    >
                                        <ChevronLeft className="w-3 h-3" />
                                    </Button>
                                    <span className="text-xs px-2">{currentPage}/{totalPages}</span>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-7 w-7"
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                    >
                                        <ChevronRight className="w-3 h-3" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Selected Items */}
            <Card className="border-border shadow-sm">
                <CardHeader className="bg-primary/5 border-b border-border pb-4">
                    <CardTitle className="text-base flex items-center gap-2 text-primary">
                        <Package className="w-4 h-4" />
                        Sản phẩm đã chọn ({selectedItems.length})
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                    {errors.items && (
                        <div className="mb-3 p-2 bg-destructive/5 border border-destructive/20 rounded-md flex items-center gap-2 text-destructive text-sm">
                            <AlertCircle className="w-4 h-4" />
                            <span>{errors.items}</span>
                        </div>
                    )}
                    
                    {selectedItems.length > 0 ? (
                        <div className="border border-border rounded-lg overflow-hidden">
                            <div className="max-h-[240px] overflow-y-auto">
                                <Table>
                                    <TableHeader className="sticky top-0 bg-muted">
                                        <TableRow>
                                            <TableHead className="h-8 font-medium text-sm">Sản phẩm</TableHead>
                                            <TableHead className="h-8 font-medium text-sm w-24">Số lượng</TableHead>
                                            <TableHead className="h-8 font-medium text-sm w-16"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {selectedItems.map((item) => (
                                            <TableRow key={item.id} className="h-10">
                                                <TableCell className="py-1">
                                                    <span className="font-medium text-sm">{item.productName || item.name}</span>
                                                    <span className="text-xs text-muted-foreground ml-2">{item.sku}</span>
                                                </TableCell>
                                                <TableCell className="py-1">
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        value={item.quantity}
                                                        onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                                        className="h-8 w-20 text-sm"
                                                    />
                                                </TableCell>
                                                <TableCell className="py-1">
                                                    <Button 
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={() => handleRemoveItem(item.id)}
                                                        className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">Chưa có sản phẩm nào được chọn</p>
                        </div>
                    )}

                    {selectedItems.length > 0 && (
                        <div className="mt-3 p-3 bg-primary/5 rounded-lg flex justify-between items-center">
                            <span className="text-sm font-medium">Tổng:</span>
                            <span className="text-xl font-bold text-primary">{totalQuantity}</span>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default StepTwoProducts;
