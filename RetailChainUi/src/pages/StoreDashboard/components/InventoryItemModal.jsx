// src/pages/StoreDashboard/components/InventoryItemModal.jsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, AlertTriangle, CheckCircle2, X, Hash, Tag, LayoutGrid, Layers } from "lucide-react";

const getStatusConfig = (status) => {
    switch (status) {
        case "In Stock":
            return { icon: <CheckCircle2 className="w-4 h-4" />, className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400", label: "Còn hàng" };
        case "Low Stock":
            return { icon: <AlertTriangle className="w-4 h-4" />, className: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400", label: "Sắp hết hàng" };
        case "Out of Stock":
            return { icon: <Package className="w-4 h-4" />, className: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400", label: "Hết hàng" };
        default:
            return { icon: null, className: "bg-slate-100 text-slate-700", label: status };
    }
};

const InfoRow = ({ icon, label, value }) => (
    <div className="flex items-start gap-3 py-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 shrink-0 mt-0.5">
            {icon}
        </div>
        <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">{label}</span>
            <span className="text-sm font-semibold text-slate-900 dark:text-white break-words">{value ?? "—"}</span>
        </div>
    </div>
);

const InventoryItemModal = ({ item, onClose }) => {
    if (!item) return null;

    const statusConfig = getStatusConfig(item.status);

    // Đóng khi click backdrop
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={handleBackdropClick}
        >
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-start justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex flex-col gap-1 flex-1 min-w-0 pr-4">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                            {item.name}
                        </h2>
                        {item.sku && (
                            <span className="text-xs font-mono text-slate-400">{item.sku}</span>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors shrink-0"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Status Banner */}
                <div className={`flex items-center gap-2 px-6 py-3 ${statusConfig.className} bg-opacity-50`}>
                    {statusConfig.icon}
                    <span className="text-sm font-semibold">{statusConfig.label}</span>
                    <div className="ml-auto text-2xl font-bold">
                        {item.stock ?? 0}
                        <span className="text-sm font-medium ml-1 opacity-70">đơn vị</span>
                    </div>
                </div>

                {/* Info Rows */}
                <div className="px-6 py-2">
                    <InfoRow icon={<Hash className="w-4 h-4" />} label="SKU" value={item.sku} />
                    <InfoRow icon={<Tag className="w-4 h-4" />} label="Tên sản phẩm" value={item.name} />
                    <InfoRow icon={<LayoutGrid className="w-4 h-4" />} label="Danh mục" value={item.category} />
                    <InfoRow icon={<Layers className="w-4 h-4" />} label="Số lượng tồn kho" value={`${item.stock ?? 0} sản phẩm`} />
                    <InfoRow icon={<span className="text-xs font-bold text-sky-600">VND</span>} label="Giá bán" value={item.price} />
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                    <Button variant="outline" size="sm" onClick={onClose}>
                        Đóng
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default InventoryItemModal;
