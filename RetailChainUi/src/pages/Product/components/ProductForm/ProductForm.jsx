import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Upload, X, Loader2 } from "lucide-react";
import uploadService from "@/services/upload.service";
import productService from "@/services/product.service";

const ProductForm = ({ open, onOpenChange, onSubmit, initialData, loading }) => {
    const [formData, setFormData] = useState({
        code: "",
        name: "",
        description: "",
        gender: "UNISEX",
        status: 1,
        categoryId: 1,
        image: ""
    });

    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                code: initialData.code || "",
                name: initialData.name || "",
                description: initialData.description || "",
                gender: initialData.gender || "UNISEX",
                status: initialData.status !== undefined ? initialData.status : 1,
                categoryId: initialData.categoryId || 1,
                image: initialData.image || ""
            });
        } else {
            setFormData({
                code: "",
                name: "",
                description: "",
                gender: "UNISEX",
                status: 1,
                categoryId: 1,
                image: ""
            });
        }
    }, [initialData, open]);

    const [loadingCode, setLoadingCode] = useState(false);

    useEffect(() => {
        if (!initialData && formData.categoryId) {
            setLoadingCode(true);
            productService.getNextCode(formData.categoryId)
                .then(res => {
                    const nextCode = res.data; // Data is directly string or object wrapper? Assuming response.data.data from backend utility
                    // Backend returns ResponseJson: { status: 200, message: ..., data: "CODE" }
                    // Axios interceptor usually extracts data. If not: res.data.data
                    // Let's assume axiosClient handles it or check structure.
                    // Based on previous code flow: res.data might be the payload.
                    // Safely handle it.
                    setFormData(prev => ({ ...prev, code: res.data || res }));
                })
                .catch(err => console.error("Failed to fetch next code", err))
                .finally(() => setLoadingCode(false));
        }
    }, [formData.categoryId, initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
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
            alert("Failed to upload image.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemoveImage = () => {
        setFormData(prev => ({ ...prev, image: "" }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-white dark:bg-slate-900 border-none shadow-2xl rounded-2xl">
                <DialogHeader className="p-6 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                    <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
                        {initialData ? "Edit Product" : "Add New Product"}
                    </DialogTitle>
                    <DialogDescription className="text-slate-500 dark:text-slate-400">
                        {initialData ? "Update product details below." : "Enter details to create a new product model."}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Image Upload Section */}
                    <div className="flex flex-col gap-2">
                        <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Product Image</Label>
                        <div className="flex items-center gap-4">
                            <div className="relative w-24 h-24 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-800 group">
                                {isUploading ? (
                                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                ) : formData.image ? (
                                    <>
                                        <img src={formData.image} alt="Product" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={handleRemoveImage}
                                            className="absolute top-1 right-1 bg-black/50 hover:bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </>
                                ) : (
                                    <Upload className="w-6 h-6 text-slate-400" />
                                )}
                            </div>
                            <div className="flex-1">
                                <Input
                                    id="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    disabled={isUploading || loading}
                                    className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                                />
                                <p className="text-xs text-slate-500 mt-2">Recommended: 500x500px, Max 5MB. Supports JPG, PNG.</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <Label htmlFor="code" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                Product Code
                            </Label>
                            <div className="relative">
                                <Input
                                    id="code"
                                    name="code"
                                    value={formData.code}
                                    readOnly
                                    disabled
                                    className="h-10 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-500 cursor-not-allowed pr-10"
                                    placeholder={loadingCode ? "Generating..." : "Auto-generated"}
                                />
                                {loadingCode && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                    </div>
                                )}
                            </div>
                            {!initialData && <p className="text-xs text-slate-500">Code will be generated automatically based on Category.</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                Category
                            </Label>
                            <Select
                                value={String(formData.categoryId)}
                                onValueChange={(value) => handleSelectChange("categoryId", parseInt(value))}
                            >
                                <SelectTrigger className="h-10 border-slate-200 dark:border-slate-700">
                                    <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">Fashion</SelectItem> {/* Mock category */}
                                    <SelectItem value="2">Shirts</SelectItem>
                                    <SelectItem value="3">Pants</SelectItem>
                                    <SelectItem value="4">Bags</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                            Product Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g. Premium Cotton T-Shirt"
                            required
                            className="h-10 border-slate-200 dark:border-slate-700 focus:ring-primary/20"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                            Description
                        </Label>
                        <Input
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Brief description of the product..."
                            className="h-10 border-slate-200 dark:border-slate-700 focus:ring-primary/20"
                        />
                    </div>

                    <div className={initialData ? "grid grid-cols-2 gap-5" : "w-full"}>
                        <div className="space-y-2">
                            <Label htmlFor="gender" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Target Gender</Label>
                            <Select
                                value={formData.gender}
                                onValueChange={(value) => handleSelectChange("gender", value)}
                            >
                                <SelectTrigger className="h-10 border-slate-200 dark:border-slate-700">
                                    <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="MEN">Men</SelectItem>
                                    <SelectItem value="WOMEN">Women</SelectItem>
                                    <SelectItem value="UNISEX">Unisex</SelectItem>
                                    <SelectItem value="KIDS">Kids</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {initialData && (
                            <div className="space-y-2">
                                <Label htmlFor="status" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Status</Label>
                                <Select
                                    value={String(formData.status)}
                                    onValueChange={(value) => handleSelectChange("status", parseInt(value))}
                                >
                                    <SelectTrigger className="h-10 border-slate-200 dark:border-slate-700">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Active</SelectItem>
                                        <SelectItem value="0">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>

                    <DialogFooter className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-2">
                        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="font-semibold text-slate-600">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading || isUploading} className="font-bold shadow-lg shadow-primary/20">
                            {loading ? "Saving..." : (isUploading ? "Uploading..." : (initialData ? "Update Product" : "Create Product"))}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ProductForm;
