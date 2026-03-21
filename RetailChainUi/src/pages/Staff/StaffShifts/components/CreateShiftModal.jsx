import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import shiftService from "@/services/shift.service";

const CreateShiftModal = ({ isOpen, onClose, storeId, onCreateSuccess }) => {
    const [name, setName] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [minStaff, setMinStaff] = useState(1);
    const [maxStaff, setMaxStaff] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Reset form khi đóng modal
    useEffect(() => {
        if (!isOpen) {
            setName("");
            setStartTime("");
            setEndTime("");
            setMinStaff(1);
            setMaxStaff(1);
            setError("");
        }
    }, [isOpen]);

    const handleCreate = async () => {
        // Validate
        if (!name.trim()) {
            setError("Vui lòng nhập tên ca làm (VD: Ca Sáng)");
            return;
        }
        if (!startTime || !endTime) {
            setError("Vui lòng nhập đầy đủ thời gian bắt đầu và kết thúc");
            return;
        }
        if (!minStaff || !maxStaff || Number(minStaff) <= 0 || Number(maxStaff) <= 0) {
            setError("Min/Max nhân sự phải lớn hơn 0");
            return;
        }
        if (Number(minStaff) > Number(maxStaff)) {
            setError("Min nhân sự không được lớn hơn Max nhân sự");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const data = {
                storeId: Number(storeId),
                name: name.trim(),
                startTime: startTime.length === 5 ? `${startTime}:00` : startTime,
                endTime: endTime.length === 5 ? `${endTime}:00` : endTime,
                minStaff: Number(minStaff),
                maxStaff: Number(maxStaff),
            };

            const result = await shiftService.createShift(data);

            if (result?.code === 200) {
                if (onCreateSuccess) onCreateSuccess();
                onClose(false);
            } else {
                setError(result?.desc || "Có lỗi xảy ra khi tạo ca làm");
            }
        } catch (err) {
            let errorMsg = "Có lỗi xảy ra khi tạo ca làm";
            if (err?.response?.data) {
                const data = err.response.data;
                if (typeof data === "string") {
                    try {
                        const parsed = JSON.parse(data);
                        errorMsg = parsed?.desc || errorMsg;
                    } catch {
                        errorMsg = data;
                    }
                } else {
                    errorMsg = data?.desc || errorMsg;
                }
            }
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-white dark:bg-surface-dark border-border-light dark:border-border-dark gap-0">
                <DialogHeader className="p-6 pb-4 border-b border-border-light dark:border-border-dark flex flex-row justify-between items-start space-y-0">
                    <div>
                        <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white leading-tight">Create New Shift Type</DialogTitle>
                        <DialogDescription className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                            Define a new shift template for this store.
                        </DialogDescription>
                    </div>
                </DialogHeader>

                <div className="p-6 flex flex-col gap-5">
                    {error && (
                        <div className="flex items-center gap-2 text-red-600 bg-red-50 dark:bg-red-900/20 px-4 py-3 rounded-lg text-sm border border-red-200 dark:border-red-800">
                            <span className="material-symbols-outlined text-[18px]">error</span>
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Shift Name <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="VD: Ca Sáng, Ca Tối, Full-time..."
                            className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-surface-dark px-4 py-3 text-sm text-slate-900 dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Start Time <span className="text-red-500">*</span></label>
                            <input
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-surface-dark px-4 py-3 text-base text-slate-900 dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">End Time <span className="text-red-500">*</span></label>
                            <input
                                type="time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-surface-dark px-4 py-3 text-base text-slate-900 dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Min Staff <span className="text-red-500">*</span></label>
                            <input
                                type="number"
                                min={1}
                                value={minStaff}
                                onChange={(e) => setMinStaff(e.target.value)}
                                className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-surface-dark px-4 py-3 text-base text-slate-900 dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Max Staff <span className="text-red-500">*</span></label>
                            <input
                                type="number"
                                min={1}
                                value={maxStaff}
                                onChange={(e) => setMaxStaff(e.target.value)}
                                className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-surface-dark px-4 py-3 text-base text-slate-900 dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-slate-50 dark:bg-black/20 border-t border-border-light dark:border-border-dark flex justify-end gap-3 rounded-b-lg">
                    <button
                        onClick={() => onClose(false)}
                        disabled={loading}
                        className="px-6 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleCreate}
                        disabled={loading || !name.trim() || !startTime || !endTime || Number(minStaff) <= 0 || Number(maxStaff) <= 0 || Number(minStaff) > Number(maxStaff)}
                        className="px-6 py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-white font-semibold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        {loading ? (
                            <>
                                <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
                                Saving...
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-[20px]">save</span>
                                Create Shift
                            </>
                        )}
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CreateShiftModal;
