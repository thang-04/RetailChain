import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const AutoAssignConfigModal = ({
    isOpen,
    onOpenChange,
    rangeLabel,
    shiftRows,
    quotaRows,
    quotaLoading,
    autoAssignLoading,
    onShiftToggle,
    onShiftStaffChange,
    onQuotaChange,
    onGenerate,
}) => {
    const selectedShiftCount = Array.isArray(shiftRows)
        ? shiftRows.filter((row) => row.selected).length
        : 0;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-5xl max-h-[88vh] overflow-hidden p-0 bg-white dark:bg-slate-900">
                <DialogHeader className="px-6 pt-6 pb-4 border-b border-slate-200 dark:border-slate-700">
                    <DialogTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">
                        Cau hinh Auto-assign
                    </DialogTitle>
                    <DialogDescription className="text-sm text-slate-500 dark:text-slate-400">
                        Chon loai ca, chinh min/max theo tung shift type va quota nhan vien trong khoang {rangeLabel}.
                    </DialogDescription>
                </DialogHeader>

                <div className="px-6 py-4 overflow-auto space-y-5">
                    <div className="rounded-lg border border-slate-200 dark:border-slate-700">
                        <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60">
                            <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                Shift types ({selectedShiftCount}/{shiftRows.length || 0} da chon)
                            </div>
                        </div>
                        {shiftRows.length > 0 ? (
                            <div className="overflow-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-left text-slate-500">
                                            <th className="py-2 px-3 w-16">Chon</th>
                                            <th className="py-2 px-3">Shift</th>
                                            <th className="py-2 px-3 w-36">Khung gio</th>
                                            <th className="py-2 px-3 w-28">Min staff</th>
                                            <th className="py-2 px-3 w-28">Max staff</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {shiftRows.map((row) => (
                                            <tr key={row.shiftId} className="border-t border-slate-200 dark:border-slate-700">
                                                <td className="py-2 px-3">
                                                    <input
                                                        type="checkbox"
                                                        checked={row.selected}
                                                        onChange={(e) => onShiftToggle(row.shiftId, e.target.checked)}
                                                    />
                                                </td>
                                                <td className="py-2 px-3 text-slate-800 dark:text-slate-200 font-medium">
                                                    {row.name}
                                                </td>
                                                <td className="py-2 px-3 text-slate-600 dark:text-slate-400">
                                                    {row.startTime} - {row.endTime}
                                                </td>
                                                <td className="py-2 px-3">
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={row.minStaff}
                                                        onChange={(e) => onShiftStaffChange(row.shiftId, "minStaff", e.target.value)}
                                                        className="w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-2 py-1"
                                                    />
                                                </td>
                                                <td className="py-2 px-3">
                                                    <input
                                                        type="number"
                                                        min={row.minStaff}
                                                        value={row.maxStaff}
                                                        onChange={(e) => onShiftStaffChange(row.shiftId, "maxStaff", e.target.value)}
                                                        className="w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-2 py-1"
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="px-4 py-3 text-sm text-slate-500">Khong co shift type de cau hinh.</div>
                        )}
                    </div>

                    <div className="rounded-lg border border-slate-200 dark:border-slate-700">
                        <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60">
                            <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                Quota nhan vien (Min/Max theo tuan)
                            </div>
                        </div>
                        {quotaLoading ? (
                            <div className="px-4 py-3 text-sm text-slate-500">Dang tai danh sach quota...</div>
                        ) : quotaRows.length > 0 ? (
                            <div className="overflow-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-left text-slate-500">
                                            <th className="py-2 px-3">Nhan vien</th>
                                            <th className="py-2 px-3 w-28">Min/Week</th>
                                            <th className="py-2 px-3 w-28">Max/Week</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {quotaRows.map((row) => (
                                            <tr key={row.userId} className="border-t border-slate-200 dark:border-slate-700">
                                                <td className="py-2 px-3 text-slate-800 dark:text-slate-200">{row.fullName}</td>
                                                <td className="py-2 px-3">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={row.minShiftsPerWeek}
                                                        onChange={(e) => onQuotaChange(row.userId, "minShiftsPerWeek", e.target.value)}
                                                        className="w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-2 py-1"
                                                    />
                                                </td>
                                                <td className="py-2 px-3">
                                                    <input
                                                        type="number"
                                                        min={row.minShiftsPerWeek}
                                                        value={row.maxShiftsPerWeek}
                                                        onChange={(e) => onQuotaChange(row.userId, "maxShiftsPerWeek", e.target.value)}
                                                        className="w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-2 py-1"
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="px-4 py-3 text-sm text-slate-500">Khong co nhan vien de cau hinh quota.</div>
                        )}
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={() => onOpenChange(false)}
                        className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-sm font-semibold text-slate-700 dark:text-slate-200"
                    >
                        Dong
                    </button>
                    <button
                        type="button"
                        onClick={onGenerate}
                        disabled={autoAssignLoading || quotaLoading || selectedShiftCount === 0}
                        className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white text-sm font-semibold disabled:opacity-50 flex items-center gap-2"
                    >
                        <span className={`material-symbols-outlined text-[18px] ${autoAssignLoading ? "animate-spin" : ""}`}>
                            {autoAssignLoading ? "progress_activity" : "auto_fix_high"}
                        </span>
                        Generate Preview
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AutoAssignConfigModal;
