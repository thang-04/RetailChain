import React, { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

const PRESET_COLORS = ["Đen", "Trắng", "Đỏ", "Xanh dương", "Xanh lá", "Vàng", "Xám"];
const PRESET_SIZES = ["S", "M", "L", "XL"];

const ProductVariantForm = ({ open, onOpenChange, onSubmit, loading, product }) => {
    const [formData, setFormData] = useState({
        sizes: [],
        colors: [],
        price: "",
        status: 1
    });

    const [sizeInput, setSizeInput] = useState("");
    const [colorInput, setColorInput] = useState("");
    const [showCustomColor, setShowCustomColor] = useState(false);
    const [showCustomSize, setShowCustomSize] = useState(false);

    // Reset when opened
    React.useEffect(() => {
        if (open) {
            setFormData({
                sizes: [],
                colors: [],
                price: "",
                status: 1
            });
            setSizeInput("");
            setColorInput("");
            setShowCustomColor(false);
            setShowCustomSize(false);
        }
    }, [open]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const normalizeToken = (v) => v.trim();

    const splitTokens = useCallback((raw) => {
        if (!raw) return [];
        return raw
            .split(/[,;\n\t]+/g)
            .map(normalizeToken)
            .filter(Boolean);
    }, []);

    const addTokens = (field, tokens) => {
        if (!tokens.length) return;
        setFormData((prev) => {
            const next = [...(prev[field] || [])];
            const existingSet = new Set(next.map((x) => x.toLowerCase()));
            tokens.forEach((t) => {
                const key = t.toLowerCase();
                if (!existingSet.has(key)) {
                    next.push(t);
                    existingSet.add(key);
                }
            });
            return { ...prev, [field]: next };
        });
    };

    const removeToken = (field, token) => {
        setFormData((prev) => ({
            ...prev,
            [field]: (prev[field] || []).filter((x) => x.toLowerCase() !== token.toLowerCase()),
        }));
    };

    const toggleToken = (field, token) => {
        setFormData((prev) => {
            const current = prev[field] || [];
            const existingToken = current.find((x) => x.toLowerCase() === token.toLowerCase());
            if (existingToken) {
                return { ...prev, [field]: current.filter((x) => x !== existingToken) };
            } else {
                return { ...prev, [field]: [...current, token] };
            }
        });
    };

    const onKeyDownAdd = (e, field) => {
        if (e.key !== "Enter") return;
        e.preventDefault();
        const raw = field === "sizes" ? sizeInput : colorInput;
        const tokens = splitTokens(raw);
        addTokens(field, tokens);
        if (field === "sizes") setSizeInput("");
        if (field === "colors") setColorInput("");
    };

    const canSubmit = useMemo(() => {
        const pendingSizes = splitTokens(sizeInput);
        const pendingColors = splitTokens(colorInput);
        const hasSizes = (formData.sizes || []).length > 0 || pendingSizes.length > 0;
        const hasColors = (formData.colors || []).length > 0 || pendingColors.length > 0;
        const hasPrice = String(formData.price || "").trim() !== "";
        return hasSizes && hasColors && hasPrice && !loading;
    }, [formData, loading, sizeInput, colorInput, splitTokens]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Nếu user chỉ gõ nhưng chưa nhấn Enter, tự động thêm vào danh sách trước khi submit
        const pendingSizes = splitTokens(sizeInput);
        const pendingColors = splitTokens(colorInput);
        if (pendingSizes.length) {
            addTokens("sizes", pendingSizes);
            setSizeInput("");
        }
        if (pendingColors.length) {
            addTokens("colors", pendingColors);
            setColorInput("");
        }

        const finalSizes = [...(formData.sizes || []), ...pendingSizes].filter(Boolean);
        const finalColors = [...(formData.colors || []), ...pendingColors].filter(Boolean);
        if (!finalSizes.length || !finalColors.length) {
            return;
        }

        onSubmit({
            sizes: finalSizes,
            colors: finalColors,
            price: formData.price === "" ? null : Number(formData.price),
            status: formData.status
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-white dark:bg-slate-900 border-none shadow-2xl rounded-2xl">
                <DialogHeader className="p-6 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                    <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
                        Tạo variants
                    </DialogTitle>
                    <DialogDescription className="text-slate-500 dark:text-slate-400">
                        Nhập danh sách size và màu của <span className="font-semibold">{product?.name || "sản phẩm"}</span>. Hệ thống sẽ tự tạo tất cả tổ hợp size × màu.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                            Danh sách màu <span className="text-red-500">*</span>
                        </Label>
                        <div className="flex flex-wrap gap-2 pt-1 mb-2">
                            {PRESET_COLORS.map((c) => {
                                const isSelected = (formData.colors || []).some((x) => x.toLowerCase() === c.toLowerCase());
                                return (
                                    <Badge
                                        key={c}
                                        variant={isSelected ? "default" : "outline"}
                                        className={`cursor-pointer px-3 py-1 text-sm ${isSelected ? "" : "hover:bg-slate-100 dark:hover:bg-slate-800"}`}
                                        onClick={() => toggleToken("colors", c)}
                                    >
                                        {c}
                                    </Badge>
                                );
                            })}
                            <Badge
                                variant={showCustomColor ? "default" : "outline"}
                                className={`cursor-pointer px-3 py-1 text-sm ${showCustomColor ? "" : "hover:bg-slate-100 dark:hover:bg-slate-800"}`}
                                onClick={() => setShowCustomColor(!showCustomColor)}
                            >
                                Khác...
                            </Badge>
                        </div>

                        {showCustomColor && (
                            <div className="mt-2 animate-in fade-in slide-in-from-top-2">
                                <Input
                                    value={colorInput}
                                    onChange={(e) => setColorInput(e.target.value)}
                                    onKeyDown={(e) => onKeyDownAdd(e, "colors")}
                                    placeholder="Nhập màu khác (nhấn Enter để thêm)"
                                    className="h-10 border-slate-200 dark:border-slate-700 focus:ring-primary/20"
                                />
                                <div className="flex flex-wrap gap-2 pt-2">
                                    {(formData.colors || [])
                                        .filter((c) => !PRESET_COLORS.some((pc) => pc.toLowerCase() === c.toLowerCase()))
                                        .map((c) => (
                                            <Badge key={c} variant="secondary" className="gap-1">
                                                <span>{c}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeToken("colors", c)}
                                                    className="ml-1 rounded-full px-1 hover:bg-slate-200/70 dark:hover:bg-slate-700/70"
                                                    aria-label={`Xoá màu ${c}`}
                                                >
                                                    ×
                                                </button>
                                            </Badge>
                                        ))}
                                </div>
                                <p className="text-xs text-slate-500 mt-2">
                                    Tip: Bạn có thể dán nhiều giá trị, ngăn cách bằng dấu phẩy hoặc xuống dòng.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                            Danh sách size <span className="text-red-500">*</span>
                        </Label>
                        <div className="flex flex-wrap gap-2 pt-1 mb-2">
                            {PRESET_SIZES.map((s) => {
                                const isSelected = (formData.sizes || []).some((x) => x.toLowerCase() === s.toLowerCase());
                                return (
                                    <Badge
                                        key={s}
                                        variant={isSelected ? "default" : "outline"}
                                        className={`cursor-pointer px-3 py-1 text-sm ${isSelected ? "" : "hover:bg-slate-100 dark:hover:bg-slate-800"}`}
                                        onClick={() => toggleToken("sizes", s)}
                                    >
                                        {s}
                                    </Badge>
                                );
                            })}
                            <Badge
                                variant={showCustomSize ? "default" : "outline"}
                                className={`cursor-pointer px-3 py-1 text-sm ${showCustomSize ? "" : "hover:bg-slate-100 dark:hover:bg-slate-800"}`}
                                onClick={() => setShowCustomSize(!showCustomSize)}
                            >
                                Khác...
                            </Badge>
                        </div>

                        {showCustomSize && (
                            <div className="mt-2 animate-in fade-in slide-in-from-top-2">
                                <Input
                                    value={sizeInput}
                                    onChange={(e) => setSizeInput(e.target.value)}
                                    onKeyDown={(e) => onKeyDownAdd(e, "sizes")}
                                    placeholder="Nhập size khác (nhấn Enter để thêm)"
                                    className="h-10 border-slate-200 dark:border-slate-700 focus:ring-primary/20"
                                />
                                <div className="flex flex-wrap gap-2 pt-2">
                                    {(formData.sizes || [])
                                        .filter((s) => !PRESET_SIZES.some((ps) => ps.toLowerCase() === s.toLowerCase()))
                                        .map((s) => (
                                            <Badge key={s} variant="secondary" className="gap-1">
                                                <span>{s}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeToken("sizes", s)}
                                                    className="ml-1 rounded-full px-1 hover:bg-slate-200/70 dark:hover:bg-slate-700/70"
                                                    aria-label={`Xoá size ${s}`}
                                                >
                                                    ×
                                                </button>
                                            </Badge>
                                        ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                            Giá (VND) <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            name="price"
                            type="number"
                            step="1"
                            min="0"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="Ví dụ: 199000"
                            required
                            className="h-10 border-slate-200 dark:border-slate-700 focus:ring-primary/20"
                        />
                    </div>

                    <DialogFooter className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-2">
                        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="font-semibold text-slate-600">
                            Huỷ
                        </Button>
                        <Button type="submit" disabled={!canSubmit} className="font-bold shadow-lg shadow-primary/20">
                            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            {loading ? "Đang lưu..." : "Tạo variants"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ProductVariantForm;
