import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import shiftService from "@/services/shift.service";
import { axiosPrivate } from "@/services/api/axiosClient";
import { cn } from "@/lib/utils";
import useAuth from "@/contexts/AuthContext/useAuth";

const AssignStaffShiftModal = ({ isOpen, onClose, storeId, onAssignSuccess }) => {
    const { user } = useAuth();
    // State form
    const [selectedUserId, setSelectedUserId] = useState("");
    const [selectedShiftIds, setSelectedShiftIds] = useState([]); // Chuyển sang mảng
    const [workDate, setWorkDate] = useState("");
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // State data từ API
    const [staffList, setStaffList] = useState([]);
    const [shiftList, setShiftList] = useState([]);

    // Load danh sách nhân viên & ca làm khi modal mở
    useEffect(() => {
        if (isOpen && storeId) {
            loadStaffAndShifts();
        }
    }, [isOpen, storeId]);

    // Reset form khi đóng modal
    useEffect(() => {
        if (!isOpen) {
            setSelectedUserId("");
            setSelectedShiftIds([]);
            setWorkDate("");
            setNotes("");
            setError("");
        }
    }, [isOpen]);

    const loadStaffAndShifts = async () => {
        try {
            // Load nhân viên theo store
            const staffRes = await axiosPrivate.get(`/stores/${storeId}/staff-list`);
            if (staffRes?.code === 200 && staffRes?.data) {
                setStaffList(staffRes.data);
            }

            // Load ca làm theo store
            const shiftRes = await shiftService.getShiftsByStore(storeId);
            if (shiftRes?.code === 200 && shiftRes?.data) {
                setShiftList(shiftRes.data);
            }
        } catch (err) {
            console.error("Error loading data:", err);
        }
    };

    const toggleShift = (shiftId) => {
        setSelectedShiftIds(prev => 
            prev.includes(shiftId) 
                ? prev.filter(id => id !== shiftId) 
                : [...prev, shiftId]
        );
    };

    const handleAssign = async () => {
        // Validate
        if (!selectedUserId) {
            setError("Vui lòng chọn nhân viên");
            return;
        }
        if (!workDate) {
            setError("Vui lòng chọn ngày làm việc");
            return;
        }
        if (selectedShiftIds.length === 0) {
            setError("Vui lòng chọn ít nhất một ca làm");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const result = await shiftService.assignShifts({
                shiftIds: selectedShiftIds.map(id => Number(id)),
                userId: Number(selectedUserId),
                workDate: workDate,
                createdBy: user?.id || 1, // Dùng ID người dùng hiện tại
            });

            if (result?.code === 200) {
                if (onAssignSuccess) onAssignSuccess();
                onClose(false);
            } else {
                setError(result?.desc || "Có lỗi xảy ra khi phân công ca");
            }
        } catch (err) {
            let errorMsg = "Có lỗi xảy ra khi phân công ca";
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
            <DialogContent className="sm:max-w-lg p-0 overflow-hidden bg-white dark:bg-surface-dark border-border-light dark:border-border-dark gap-0">
                <DialogHeader className="p-6 pb-4 border-b border-border-light dark:border-border-dark flex flex-row justify-between items-start space-y-0">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="bg-[#24748f]/10 text-[#24748f] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                Store {storeId || "—"}
                            </span>
                        </div>
                        <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white leading-tight">Phân Công Ca Làm</DialogTitle>
                        <DialogDescription className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                            Lên lịch làm việc cho nhân viên. Bạn có thể chọn nhiều ca cùng lúc.
                        </DialogDescription>
                    </div>
                </DialogHeader>

                <div className="p-6 flex flex-col gap-6 max-h-[70vh] overflow-y-auto">
                    {/* Thông báo lỗi */}
                    {error && (
                        <div className="flex items-center gap-2 text-red-600 bg-red-50 dark:bg-red-900/20 px-4 py-3 rounded-lg text-sm border border-red-200 dark:border-red-800">
                            <span className="material-symbols-outlined text-[18px]">error</span>
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Chọn nhân viên */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Chọn Nhân Viên</label>
                        <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                            <SelectTrigger className="w-full h-12 rounded-xl border-slate-300 dark:border-slate-600 dark:bg-surface-dark dark:text-white">
                                <SelectValue placeholder="Tìm hoặc chọn nhân viên..." />
                            </SelectTrigger>
                            <SelectContent>
                                {staffList.length > 0 ? (
                                    staffList.map(staff => (
                                        <SelectItem key={staff.id} value={String(staff.id)}>
                                            {staff.fullName || staff.username} {staff.phone ? `(${staff.phone})` : ""}
                                        </SelectItem>
                                    ))
                                ) : (
                                    <div className="p-4 text-center">
                                        <p className="text-sm text-slate-500 mb-2">Cửa hàng này chưa có nhân viên nào.</p>
                                        <p className="text-xs text-slate-400">Bạn cần vào phần "Quản lý nhân sự" của cửa hàng để thêm nhân viên trước.</p>
                                    </div>
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Ngày làm việc */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Ngày Làm Việc</label>
                        <input
                            type="date"
                            value={workDate}
                            onChange={(e) => setWorkDate(e.target.value)}
                            className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-surface-dark px-4 py-3 text-base text-slate-900 dark:text-white focus:border-[#24748f] focus:outline-none focus:ring-1 focus:ring-[#24748f]"
                        />
                    </div>

                    {/* Chọn ca làm (Pill Cards) */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex justify-between">
                            Chọn Ca Làm Việc
                            {selectedShiftIds.length > 0 && (
                                <span className="text-[#24748f] text-xs font-normal">Đã chọn {selectedShiftIds.length} ca</span>
                            )}
                        </label>
                        <div className="grid grid-cols-1 gap-2">
                            {shiftList.length > 0 ? (
                                shiftList.map((shift, index) => {
                                    const isSelected = selectedShiftIds.includes(String(shift.id));
                                    const icons = ["wb_sunny", "light_mode", "nights_stay"];
                                    const colors = ["text-amber-500", "text-sky-500", "text-indigo-500"];
                                    
                                    return (
                                        <div 
                                            key={shift.id}
                                            onClick={() => toggleShift(String(shift.id))}
                                            className={cn(
                                                "flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer group",
                                                isSelected 
                                                    ? "border-[#24748f] bg-[#24748f]/5 ring-1 ring-[#24748f]" 
                                                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark hover:border-[#24748f]/50"
                                            )}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={cn(
                                                    "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                                                    isSelected ? "bg-[#24748f] text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:text-[#24748f]"
                                                )}>
                                                    <span className="material-symbols-outlined text-[20px]">
                                                        {icons[index % icons.length]}
                                                    </span>
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="text-sm font-bold text-slate-900 dark:text-white">{shift.name}</div>
                                                        {shift.isDefault && (
                                                            <span className="bg-primary/10 text-primary text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-tighter border border-primary/20">Hệ thống</span>
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-slate-500">{shift.startTime} - {shift.endTime}</div>
                                                </div>
                                            </div>
                                            <div className={cn(
                                                "w-6 h-6 rounded-full border flex items-center justify-center transition-all",
                                                isSelected 
                                                    ? "bg-[#24748f] border-[#24748f] text-white" 
                                                    : "border-slate-300 dark:border-slate-600"
                                            )}>
                                                {isSelected && <span className="material-symbols-outlined text-[16px]">check</span>}
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-center text-sm text-slate-400 py-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                                    <span className="material-symbols-outlined text-[32px] mb-2 block opacity-20">history_toggle_off</span>
                                    Chưa có dữ liệu ca làm việc.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex justify-between">
                            Ghi chú <span className="text-slate-400 font-normal text-xs italic">Tùy chọn</span>
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-surface-dark px-4 py-3 text-sm text-slate-900 dark:text-white focus:border-[#24748f] focus:outline-none focus:ring-1 focus:ring-[#24748f] placeholder:text-slate-400 min-h-[80px]"
                            placeholder="Thêm hướng dẫn đặc biệt cho nhân viên..."
                        ></textarea>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="p-6 bg-slate-50 dark:bg-black/20 border-t border-border-light dark:border-border-dark flex justify-end gap-3 rounded-b-lg">
                    <button
                        onClick={() => onClose(false)}
                        disabled={loading}
                        className="px-6 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleAssign}
                        disabled={loading || selectedShiftIds.length === 0}
                        className="px-6 py-2.5 rounded-lg bg-[#24748f] hover:bg-[#1a5b71] text-white font-semibold shadow-md shadow-[#24748f]/20 hover:shadow-lg hover:shadow-[#24748f]/30 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        {loading ? (
                            <>
                                <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
                                Đang xử lý...
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-[20px]">person_add</span>
                                Phân Công {selectedShiftIds.length > 1 ? `(${selectedShiftIds.length} ca)` : ""}
                            </>
                        )}
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AssignStaffShiftModal;
