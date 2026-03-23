// src/pages/StoreDashboard/components/StaffDetailModal.jsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, User, Mail, Shield, Activity } from "lucide-react";
import { useState, useEffect } from "react";

const STATUS_OPTIONS = [
    { value: "Active", label: "Đang làm việc" },
    { value: "On Leave", label: "Đang nghỉ phép" },
    { value: "Inactive", label: "Ngừng hoạt động" },
];

const getStatusLabel = (status) => {
    switch (status) {
        case "Active":
            return "Đang làm việc";
        case "On Leave":
            return "Đang nghỉ phép";
        case "Inactive":
            return "Ngừng hoạt động";
        default:
            return status;
    }
};

const InfoRow = ({ icon, label, value }) => (
    <div className="flex items-start gap-3 py-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 shrink-0">
            {icon}
        </div>
        <div className="flex flex-col gap-0.5">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">{label}</span>
            <span className="text-sm font-semibold text-slate-900 dark:text-white">{value ?? "—"}</span>
        </div>
    </div>
);

const StaffDetailModal = ({ staff, mode, onClose, onSave }) => {
    const [form, setForm] = useState({ status: "" });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (staff) setForm({ status: staff.status || "Active" });
    }, [staff]);

    if (!staff) return null;

    const isEdit = mode === "update";

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await onSave({ ...staff, status: form.status });
            onClose();
        } catch (err) {
            console.error("Lỗi cập nhật:", err);
        } finally {
            setSaving(false);
        }
    };

    const statusColor = {
        "Active": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
        "On Leave": "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
        "Inactive": "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400",
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={handleBackdropClick}
        >
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                        {isEdit ? "Cập nhật nhân viên" : "Chi tiết nhân viên"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Avatar + Name */}
                <div className="flex items-center gap-4 px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                    {staff.image ? (
                        <div className="size-14 rounded-full bg-cover bg-center shrink-0 border-2 border-white dark:border-slate-700 shadow-sm" style={{ backgroundImage: `url("${staff.image}")` }} />
                    ) : (
                        <div className={`flex items-center justify-center size-14 rounded-full text-lg font-bold shrink-0 border-2 shadow-sm ${staff.initialsColor || "border-slate-200 bg-slate-100 text-slate-600"}`}>
                            {staff.initials || staff.name?.charAt(0)}
                        </div>
                    )}
                    <div>
                        <p className="text-base font-bold text-slate-900 dark:text-white">{staff.name}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{staff.email}</p>
                    </div>
                </div>

                {/* Info / Edit */}
                <div className="px-6 py-2">
                    <InfoRow icon={<User className="w-4 h-4" />} label="Họ tên" value={staff.name} />
                    <InfoRow icon={<Mail className="w-4 h-4" />} label="Email" value={staff.email} />
                    <InfoRow icon={<Shield className="w-4 h-4" />} label="Vai trò" value={staff.role} />

                    {/* Status */}
                    <div className="flex items-start gap-3 py-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 shrink-0">
                            <Activity className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col gap-1.5 flex-1">
                            <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Trạng thái</span>
                            {isEdit ? (
                                <select
                                    value={form.status}
                                    onChange={(e) => setForm(f => ({ ...f, status: e.target.value }))}
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                >
                                    {STATUS_OPTIONS.map((statusOption) => (
                                        <option key={statusOption.value} value={statusOption.value}>
                                            {statusOption.label}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <Badge variant="secondary" className={`w-fit border-none ${statusColor[staff.status] || "bg-slate-100 text-slate-600"}`}>
                                    {getStatusLabel(staff.status)}
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={onClose}>Đóng</Button>
                    {isEdit && (
                        <Button
                            size="sm"
                            className="bg-primary hover:bg-primary/90 text-white"
                            onClick={handleSave}
                            disabled={saving}
                        >
                            {saving ? "Đang lưu..." : "Lưu thay đổi"}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StaffDetailModal;
