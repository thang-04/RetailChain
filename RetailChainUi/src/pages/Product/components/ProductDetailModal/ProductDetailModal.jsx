import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar, Tag, Layers, FileText, QrCode } from "lucide-react";

const ProductDetailModal = ({ open, onOpenChange, product, onEdit }) => {
    if (!product) return null;

    const getCategoryName = (id) => {
        switch (id) {
            case 1: return "Fashion";
            case 2: return "Shirts";
            case 3: return "Pants";
            case 4: return "Bags";
            default: return "Unknown";
        }
    };

    const getStatusBadge = (status) => {
        if (status === 1 || status === "ACTIVE") {
            return <Badge className="bg-emerald-500 hover:bg-emerald-600">Active</Badge>;
        }
        return <Badge variant="secondary">Inactive</Badge>;
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl p-0 overflow-hidden bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <div className="grid grid-cols-1 md:grid-cols-2">
                    {/* Left Column: Image */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-6 flex items-center justify-center border-r border-slate-100 dark:border-slate-800">
                        <div className="relative aspect-square w-full max-w-[300px] rounded-xl overflow-hidden bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700">
                            {product.image ? (
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                                    <div className="text-4xl font-bold mb-2">IMG</div>
                                    <span className="text-xs uppercase tracking-wider">No Image</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Info */}
                    <div className="p-6 flex flex-col h-full">
                        <DialogHeader className="mb-4">
                            <div className="flex items-start justify-between gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        {getStatusBadge(product.status)}
                                        <span className="text-xs text-slate-500 font-mono">{product.code}</span>
                                    </div>
                                    <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">
                                        {product.name}
                                    </DialogTitle>
                                </div>
                            </div>
                        </DialogHeader>

                        <div className="space-y-6 flex-1">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="size-8 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                                        <Layers className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-slate-500 uppercase font-semibold">Category</div>
                                        <div className="font-medium text-slate-700 dark:text-slate-300">
                                            {getCategoryName(product.categoryId)}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 text-sm">
                                    <div className="size-8 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                                        <Tag className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-slate-500 uppercase font-semibold">Gender</div>
                                        <div className="font-medium text-slate-700 dark:text-slate-300">
                                            {product.gender || "Unisex"}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 text-sm">
                                    <div className="size-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center mt-1">
                                        <FileText className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-slate-500 uppercase font-semibold mb-1">Description</div>
                                        <div className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                                            {product.description || "No description available."}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 text-sm">
                                    <div className="size-8 rounded-full bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                                        <QrCode className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-slate-500 uppercase font-semibold">Slug (SEO)</div>
                                        <div className="font-mono text-xs text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded mt-1">
                                            {product.slug || "N/A"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 transition-all">
                            <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
                            <Button onClick={() => { onOpenChange(false); onEdit(product); }}>Edit Product</Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ProductDetailModal;
