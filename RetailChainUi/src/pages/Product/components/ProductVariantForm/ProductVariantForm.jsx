import React, { useState } from "react";
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
import { Loader2 } from "lucide-react";

const ProductVariantForm = ({ open, onOpenChange, onSubmit, loading, product }) => {
    const [formData, setFormData] = useState({
        color: "",
        size: "",
        price: "",
        sku: "",
        barcode: "",
        initialQuantity: "",
        status: 1
    });

    // Reset when opened
    React.useEffect(() => {
        if (open) {
            setFormData({
                color: "",
                size: "",
                price: "",
                sku: "",
                barcode: "",
                initialQuantity: "",
                status: 1
            });
        }
    }, [open]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-white dark:bg-slate-900 border-none shadow-2xl rounded-2xl">
                <DialogHeader className="p-6 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                    <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
                        Add New Variant
                    </DialogTitle>
                    <DialogDescription className="text-slate-500 dark:text-slate-400">
                        Create a new version of {product?.name || "this product"} (Color, Size, Price).
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="grid grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                Color <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                name="color"
                                value={formData.color}
                                onChange={handleChange}
                                placeholder="Red, Blue..."
                                required
                                className="h-10 border-slate-200 dark:border-slate-700 focus:ring-primary/20"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                Size <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                name="size"
                                value={formData.size}
                                onChange={handleChange}
                                placeholder="S, M, L, XL..."
                                required
                                className="h-10 border-slate-200 dark:border-slate-700 focus:ring-primary/20"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                            Price (Decimal) <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            name="price"
                            type="number"
                            step="0.01"
                            min="0"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="0.00"
                            required
                            className="h-10 border-slate-200 dark:border-slate-700 focus:ring-primary/20"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                            Initial Stock Quantity (Optional)
                        </Label>
                        <Input
                            name="initialQuantity"
                            type="number"
                            min="0"
                            value={formData.initialQuantity}
                            onChange={handleChange}
                            placeholder="e.g. 50"
                            className="h-10 border-slate-200 dark:border-slate-700 focus:ring-primary/20"
                        />
                        <p className="text-xs text-slate-500">Leaving this blank means 0. Stock will be added to the default warehouse.</p>
                    </div>

                    <DialogFooter className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-2">
                        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="font-semibold text-slate-600">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading} className="font-bold shadow-lg shadow-primary/20">
                            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            {loading ? "Saving..." : "Create Variant"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ProductVariantForm;
