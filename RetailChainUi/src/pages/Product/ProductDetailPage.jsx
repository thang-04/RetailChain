import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
    ChevronLeft,
    Edit3,
    ChevronRight,
    Store,
    Package,
    BarChart3,
    Image as ImageIcon,
    Loader2,
    Calendar,
    Hash,
    Layers,
    UserCircle2,
    Plus,
    CircleDollarSign
} from "lucide-react";
import productService from "@/services/product.service";
import inventoryService from "@/services/inventory.service";
import ProductVariantForm from "./components/ProductVariantForm/ProductVariantForm";

const ProductDetailPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();

    const [fetching, setFetching] = useState(true);
    const [product, setProduct] = useState(null);
    const [categories, setCategories] = useState([]);
    const [chainStock, setChainStock] = useState([]);

    // Variant states
    const [isVariantFormOpen, setIsVariantFormOpen] = useState(false);
    const [savingVariant, setSavingVariant] = useState(false);

    useEffect(() => {
        const loadPageData = async () => {
            setFetching(true);
            try {
                console.log("Fetching product details for slug:", slug);
                // Parallel fetch
                const [productRes, catRes] = await Promise.all([
                    productService.getProductBySlug(slug),
                    productService.getCategories()
                ]);

                console.log("Product details response:", productRes);
                const productData = productRes.data;
                setProduct(productData);
                setCategories(catRes.data || []);

                // Fetch stock with product ID now that we have it
                if (productData && productData.id) {
                    console.log("Fetching stock for product ID:", productData.id);
                    const realStockRes = await inventoryService.getStockByProduct(productData.id);
                    setChainStock(realStockRes.data || []);
                }
            } catch (error) {
                console.error("Failed to fetch page data", error);
            } finally {
                setFetching(false);
            }
        };

        loadPageData();
    }, [slug]);

    const getCategoryName = (id) => {
        const cat = categories.find(c => c.id === id);
        return cat ? cat.name : "Unknown";
    };

    const handleCreateVariant = async (formData) => {
        if (!product?.id) return;
        setSavingVariant(true);
        try {
            await productService.createProductVariant(product.id, formData);
            // Refresh product details to get new variants
            const productRes = await productService.getProductBySlug(slug);
            setProduct(productRes.data);

            // Refresh stock table if an initial quantity was added
            const realStockRes = await inventoryService.getStockByProduct(product.id);
            setChainStock(realStockRes.data || []);

            setIsVariantFormOpen(false);
        } catch (error) {
            console.error("Failed to add variant", error);
            alert("Failed to add variant: " + (error.response?.data?.desc || error.message));
        } finally {
            setSavingVariant(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex flex-col h-full items-center justify-center gap-4">
                <p className="text-slate-500">Product not found.</p>
                <Button onClick={() => navigate("/products")}>Back to List</Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full overflow-hidden bg-slate-50 dark:bg-slate-950">
            {/* Header */}
            <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 shrink-0 z-10 shadow-sm">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/products")} className="mr-2">
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <nav className="flex items-center text-sm font-medium text-slate-500">
                        <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
                        <ChevronRight className="w-4 h-4 mx-1 text-slate-400" />
                        <span className="text-slate-900 dark:text-white font-semibold">{product.name}</span>
                    </nav>
                </div>
                <div className="flex items-center gap-3">
                    <Button onClick={() => navigate(`/products/${slug}/edit`)} className="bg-primary hover:bg-primary/90 text-white font-bold flex items-center gap-2">
                        <Edit3 className="w-4 h-4" />
                        Edit Product
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-200">
                <div className="max-w-6xl mx-auto space-y-6 pb-10">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left: Product Overview Card */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                                <div className="aspect-square bg-white dark:bg-slate-900 p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-center">
                                    {product.image ? (
                                        <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                                    ) : (
                                        <ImageIcon className="w-20 h-20 text-slate-200" />
                                    )}
                                </div>
                                <div className="p-6 space-y-4">
                                    <div>
                                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">{product.name}</h1>
                                        <div className="mt-2 flex items-center gap-2">
                                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${product.status === 1
                                                ? "bg-green-100 text-green-700 border-green-200"
                                                : product.status === 2
                                                    ? "bg-amber-100 text-amber-700 border-amber-200"
                                                    : "bg-slate-100 text-slate-600 border-slate-200"
                                                }`}>
                                                {product.status === 1 ? "ACTIVE" : product.status === 2 ? "OUT OF STOCK" : "INACTIVE"}
                                            </span>
                                            <span className="text-slate-400 font-mono text-xs">#{product.code}</span>
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-slate-500 font-medium flex items-center gap-2">
                                                <Layers className="w-4 h-4" /> Category
                                            </span>
                                            <span className="text-slate-900 dark:text-white font-semibold">
                                                {getCategoryName(product.categoryId)}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-slate-500 font-medium flex items-center gap-2">
                                                <UserCircle2 className="w-4 h-4" /> Gender
                                            </span>
                                            <span className="text-slate-900 dark:text-white font-semibold capitalize">{product.gender?.toLowerCase()}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-slate-500 font-medium flex items-center gap-2">
                                                <Calendar className="w-4 h-4" /> Created At
                                            </span>
                                            <span className="text-slate-900 dark:text-white font-semibold">
                                                {new Date(product.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Details and Tabs */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Description</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">
                                    {product.description || "No description provided for this product."}
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-end justify-between px-1">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                            <Package className="w-5 h-5 text-primary" /> Product Variants
                                        </h3>
                                        <p className="text-sm text-slate-500">Different colors and sizes available.</p>
                                    </div>
                                    <Button onClick={() => setIsVariantFormOpen(true)} size="sm" className="bg-slate-900 hover:bg-slate-800 text-white">
                                        <Plus className="w-4 h-4 mr-2" /> Add Variant
                                    </Button>
                                </div>
                                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
                                    <table className="w-full text-left border-collapse text-sm">
                                        <thead>
                                            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-[11px] uppercase tracking-widest text-slate-500 font-bold">
                                                <th className="px-6 py-4">SKU</th>
                                                <th className="px-6 py-4">Color</th>
                                                <th className="px-6 py-4">Size</th>
                                                <th className="px-6 py-4 text-right">Price</th>
                                                <th className="px-6 py-4 text-center">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                            {product.variants && product.variants.length > 0 ? product.variants.map((v, idx) => (
                                                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                                    <td className="px-6 py-4 font-mono font-medium text-slate-900 dark:text-white">
                                                        {v.sku}
                                                    </td>
                                                    <td className="px-6 py-4">{v.color}</td>
                                                    <td className="px-6 py-4">{v.size}</td>
                                                    <td className="px-6 py-4 text-right font-bold text-green-600 dark:text-green-400">
                                                        ${v.price?.toLocaleString()}
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        {v.status === 1 ? (
                                                            <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">ACTIVE</span>
                                                        ) : (
                                                            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">INACTIVE</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-400">No variants exist for this product. Add one above!</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                                <div className="flex items-end justify-between px-1">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Chain Inventory</h3>
                                        <p className="text-sm text-slate-500">Stock availability across all locations.</p>
                                    </div>
                                </div>
                                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
                                    <table className="w-full text-left border-collapse text-sm">
                                        <thead>
                                            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-[11px] uppercase tracking-widest text-slate-500 font-bold">
                                                <th className="px-6 py-4">Location</th>
                                                <th className="px-6 py-4 text-center">SKU</th>
                                                <th className="px-6 py-4 text-right">Available</th>
                                                <th className="px-6 py-4 text-center">Last Updated</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                            {chainStock.length > 0 ? chainStock.map((stock, idx) => (
                                                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                                    <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                                                <Store className="w-4 h-4" />
                                                            </div>
                                                            {stock.warehouseName}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium font-mono">{stock.sku}</span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                                                        {stock.quantity.toLocaleString()}
                                                    </td>
                                                    <td className="px-6 py-4 text-center text-slate-500 text-xs">
                                                        {new Date(stock.lastUpdated).toLocaleString()}
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan={4} className="px-6 py-8 text-center text-slate-400">No inventory records found for this product.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Attribution */}
            <div className="h-10 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center shrink-0">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">© 2026 Nexus Retail Systems • Enterprise Management</p>
            </div>

            <ProductVariantForm
                open={isVariantFormOpen}
                onOpenChange={setIsVariantFormOpen}
                onSubmit={handleCreateVariant}
                loading={savingVariant}
                product={product}
            />
        </div>
    );
};

export default ProductDetailPage;
