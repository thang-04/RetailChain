import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Save,
    X,
    Upload,
    ChevronRight,
    Store,
    Package,
    BarChart3,
    Image as ImageIcon,
    Loader2
} from "lucide-react";
import productService from "@/services/product.service";
import inventoryService from "@/services/inventory.service";
import uploadService from "@/services/upload.service";

const ProductEditPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const isEdit = !!slug;

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEdit);
    const [isUploading, setIsUploading] = useState(false);
    const [loadingCode, setLoadingCode] = useState(false);

    const [formData, setFormData] = useState({
        code: "",
        name: "",
        description: "",
        gender: "UNISEX",
        status: 1,
        categoryId: 1,
        image: ""
    });

    const [categories, setCategories] = useState([]);
    const [chainStock, setChainStock] = useState([]); // Added chainStock state

    useEffect(() => {
        const loadPageData = async () => {
            await fetchCategories();
            if (isEdit) {
                await fetchProduct();
            }
        };
        loadPageData();
    }, [slug]);

    const fetchCategories = async () => {
        try {
            const res = await productService.getCategories();
            if (res.data) {
                setCategories(res.data);
            }
        } catch (error) {
            console.error("Failed to fetch categories", error);
        }
    };

    const fetchProduct = async () => {
        try {
            console.log("Fetching product for Edit mode, slug:", slug);
            const res = await productService.getProductBySlug(slug);
            console.log("Edit Page: Product response:", res);
            const data = res.data;
            if (data) {
                setFormData({
                    code: data.code || "",
                    name: data.name || "",
                    description: data.description || "",
                    gender: data.gender || "UNISEX",
                    status: data.status !== undefined ? data.status : 1,
                    categoryId: data.categoryId || 1,
                    image: data.image || ""
                });

                // Fetch stock for this product
                if (data.id) {
                    console.log("Edit Page: Fetching stock for product ID:", data.id);
                    const stockRes = await inventoryService.getStockByProduct(data.id);
                    setChainStock(stockRes.data || []);
                }
            }
        } catch (error) {
            console.error("Failed to fetch product", error);
        } finally {
            setFetching(false);
        }
    };

    const handleNextCode = async (catId) => {
        if (isEdit) return;
        setLoadingCode(true);
        try {
            const res = await productService.getNextCode(catId);
            setFormData(prev => ({ ...prev, code: res.data }));
        } catch (err) {
            console.error("Failed to fetch next code", err);
        } finally {
            setLoadingCode(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name, value) => {
        const val = name === "categoryId" || name === "status" ? parseInt(value) : value;
        setFormData(prev => ({ ...prev, [name]: val }));
        if (name === "categoryId") {
            handleNextCode(val);
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const url = await uploadService.uploadFile(file);
            setFormData(prev => ({ ...prev, image: url }));
        } catch (error) {
            console.error("Upload failed:", error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEdit) {
                await productService.updateProduct(slug, formData);
            } else {
                await productService.createProduct(formData);
            }
            navigate("/products");
        } catch (error) {
            console.error("Failed to save product", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (quantity) => {
        if (quantity > 100) {
            return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-green-700 border border-green-100">RẤT TỐT</span>;
        } else if (quantity > 10) {
            return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-yellow-50 text-yellow-700 border border-yellow-100">CÒN HÀNG</span>;
        } else if (quantity > 0) {
            return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-50 text-orange-700 border border-orange-100">SẮP HẾT</span>;
        } else {
            return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-100">HẾT HÀNG</span>;
        }
    };

    const getGenderLabel = (gender) => {
        switch (String(gender || "").toUpperCase()) {
            case "UNISEX":
                return "Dùng chung";
            default:
                return gender;
        }
    };

    if (fetching) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full overflow-hidden bg-slate-50 dark:bg-slate-950">
            {/* Header */}
            <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 shrink-0 z-10 shadow-sm">
                <div className="flex items-center gap-4">
                    <nav className="flex items-center text-sm font-medium text-slate-500">
                        <Link to="/products" className="hover:text-primary transition-colors">Sản phẩm</Link>
                        <ChevronRight className="w-4 h-4 mx-1 text-slate-400" />
                        <span className="text-slate-900 dark:text-white font-semibold">
                            {isEdit ? "Chỉnh sửa sản phẩm" : "Tạo sản phẩm"}
                        </span>
                    </nav>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="ghost" onClick={() => navigate("/products")} disabled={loading}>
                        Hủy
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading || isUploading} className="bg-primary hover:bg-primary/90 text-white font-bold flex items-center gap-2">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {isEdit ? "Lưu thay đổi" : "Tạo sản phẩm"}
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-200">
                <div className="max-w-6xl mx-auto space-y-6 pb-10">
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Thông tin sản phẩm</h2>
                                <p className="text-sm text-slate-500">Thông tin cốt lõi và thuộc tính áp dụng trong toàn chuỗi.</p>
                            </div>
                            {isEdit && (
                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${formData.status === 1
                                    ? "bg-green-100 text-green-700 border-green-200"
                                    : formData.status === 2
                                        ? "bg-amber-100 text-amber-700 border-amber-200"
                                        : "bg-slate-100 text-slate-600 border-slate-200"
                                    }`}>
                                    {formData.status === 1 ? "Đang kinh doanh" : formData.status === 2 ? "Hết hàng" : "Ngừng kinh doanh"}
                                </span>
                            )}
                        </div>

                        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left: Image Section */}
                            <div className="lg:col-span-1 flex flex-col gap-4">
                                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 p-2 group relative">
                                    <div className="aspect-square bg-white dark:bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center border border-slate-100 dark:border-slate-800">
                                        {isUploading ? (
                                            <Loader2 className="w-10 h-10 animate-spin text-primary" />
                                        ) : formData.image ? (
                                            <img src={formData.image} alt="Sản phẩm" className="w-full h-full object-contain" />
                                        ) : (
                                            <ImageIcon className="w-16 h-16 text-slate-200" />
                                        )}
                                    </div>
                                    <Label
                                        htmlFor="image-upload"
                                        className="absolute bottom-4 right-4 bg-primary text-white p-2 rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform flex items-center justify-center"
                                    >
                                        <Upload className="w-4 h-4" />
                                        <input
                                            id="image-upload"
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            disabled={isUploading}
                                        />
                                    </Label>
                                </div>
                                <div className="grid grid-cols-4 gap-2">
                                    {formData.image && (
                                        <div className="aspect-square rounded border-2 border-primary overflow-hidden">
                                            <img src={formData.image} className="w-full h-full object-cover" alt="Ảnh thu nhỏ" />
                                        </div>
                                    )}
                                    <button className="aspect-square rounded border border-dashed border-slate-300 dark:border-slate-700 hover:border-primary hover:text-primary text-slate-400 flex flex-col items-center justify-center bg-slate-50/50 dark:bg-slate-800/30 transition-all">
                                        <Upload className="w-4 h-4" />
                                    </button>
                                </div>
                                <p className="text-[11px] text-slate-400 text-center uppercase tracking-wider font-semibold">Tối đa 5MB • JPG, PNG, WEBP</p>
                            </div>

                            {/* Right: Form fields */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="md:col-span-2">
                                        <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">Tên sản phẩm</Label>
                                        <Input
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Nhập tên sản phẩm"
                                            className="font-medium h-11 focus:ring-primary/20"
                                        />
                                    </div>

                                    <div>
                                        <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">Mã sản phẩm</Label>
                                        <div className="relative">
                                            <Input
                                                value={formData.code}
                                                readOnly
                                                disabled
                                                placeholder={loadingCode ? "Đang tạo..." : "Chọn danh mục..."}
                                                className="h-11 bg-slate-50 dark:bg-slate-800/50 font-mono text-slate-500"
                                            />
                                            {loadingCode && <Loader2 className="absolute right-3 top-3 w-4 h-4 animate-spin text-primary" />}
                                        </div>
                                    </div>

                                    <div>
                                        <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">Danh mục</Label>
                                        <Select
                                            value={String(formData.categoryId)}
                                            onValueChange={(v) => handleSelectChange("categoryId", v)}
                                        >
                                            <SelectTrigger className="h-11">
                                                <SelectValue placeholder="Chọn danh mục" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map(cat => (
                                                    <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">Giới tính mục tiêu</Label>
                                        <Select
                                            value={formData.gender}
                                            onValueChange={(v) => handleSelectChange("gender", v)}
                                        >
                                            <SelectTrigger className="h-11">
                                                <SelectValue placeholder="Chọn giới tính" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="MEN">Nam</SelectItem>
                                                <SelectItem value="WOMEN">Nữ</SelectItem>
                                                <SelectItem value="UNISEX">{getGenderLabel("UNISEX")}</SelectItem>
                                                <SelectItem value="KIDS">Trẻ em</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {isEdit && (
                                        <div>
                                            <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">Trạng thái</Label>
                                            <Select
                                                value={String(formData.status)}
                                                onValueChange={(v) => handleSelectChange("status", v)}
                                            >
                                                <SelectTrigger className="h-11">
                                                    <SelectValue placeholder="Chọn trạng thái" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="1">Đang kinh doanh</SelectItem>
                                                    <SelectItem value="0">Ngừng kinh doanh</SelectItem>
                                                    <SelectItem value="2">Hết hàng</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}

                                    <div className="md:col-span-2">
                                        <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">Mô tả</Label>
                                        <Textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            rows={4}
                                            placeholder="Mô tả chi tiết sản phẩm..."
                                            className="resize-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Attribution */}
            <div className="h-10 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center shrink-0">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">© 2026 RetailChain • Quản lý doanh nghiệp</p>
            </div>
        </div>
    );
};

export default ProductEditPage;
