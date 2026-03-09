import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import shiftService from "@/services/shift.service";
import { axiosPublic } from "@/services/api/axiosClient";

const AssignStaffShiftModal = ({ isOpen, onClose, storeId, onAssignSuccess }) => {
    // State form
    const [selectedUserId, setSelectedUserId] = useState("");
    const [selectedShiftId, setSelectedShiftId] = useState("");
    const [workDate, setWorkDate] = useState("");
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // State data dari API
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
            setSelectedShiftId("");
            setWorkDate("");
            setNotes("");
            setError("");
        }
    }, [isOpen]);

    const loadStaffAndShifts = async () => {
        try {
            // Load nhân viên theo store
            const staffRes = await axiosPublic.get(`/stores/${storeId}/staff-list`);
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
        if (!selectedShiftId) {
            setError("Vui lòng chọn ca làm");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const result = await shiftService.assignShift({
                shiftId: Number(selectedShiftId),
                userId: Number(selectedUserId),
                workDate: workDate,
                createdBy: 1, // TODO: lấy từ AuthContext user hiện tại
            });

            if (result?.code === 200) {
                // Thành công → đóng modal + reload lịch
                if (onAssignSuccess) onAssignSuccess();
                onClose(false);
            } else {
                setError(result?.desc || "Có lỗi xảy ra khi phân công ca");
            }
        } catch (err) {
            setError(err?.response?.data?.desc || "Có lỗi xảy ra khi phân công ca");
        } finally {
            setLoading(false);
        }
    };

    // Tìm shift đã chọn để hiện thông tin thời gian
    const selectedShift = shiftList.find(s => String(s.id) === String(selectedShiftId));

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg p-0 overflow-hidden bg-white dark:bg-surface-dark border-border-light dark:border-border-dark gap-0">
                <DialogHeader className="p-6 pb-4 border-b border-border-light dark:border-border-dark flex flex-row justify-between items-start space-y-0">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                Store {storeId || "—"}
                            </span>
                        </div>
                        <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white leading-tight">Assign Shift</DialogTitle>
                        <DialogDescription className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                            Schedule a team member for an upcoming shift.
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
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Select Staff Member</label>
                        <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                            <SelectTrigger className="w-full h-12 rounded-xl border-slate-300 dark:border-slate-600 dark:bg-surface-dark dark:text-white">
                                <SelectValue placeholder="Search or select employee..." />
                            </SelectTrigger>
                            <SelectContent>
                                {staffList.length > 0 ? (
                                    staffList.map(staff => (
                                        <SelectItem key={staff.id} value={String(staff.id)}>
                                            {staff.fullName || staff.username} {staff.phone ? `(${staff.phone})` : ""}
                                        </SelectItem>
                                    ))
                                ) : (
                                    <SelectItem value="__empty" disabled>Không có nhân viên</SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Ngày + Thông tin */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Date</label>
                            <input
                                type="date"
                                value={workDate}
                                onChange={(e) => setWorkDate(e.target.value)}
                                className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-surface-dark px-4 py-3 text-base text-slate-900 dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>

                        <div className="flex flex-col gap-2 justify-end pb-3">
                            {selectedShift && (
                                <div className="flex items-center gap-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-lg text-sm border border-green-100 dark:border-green-800 h-12">
                                    <span className="material-symbols-outlined text-[18px]">schedule</span>
                                    <span>{selectedShift.startTime} - {selectedShift.endTime}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Chọn ca làm (Radio Cards) */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Shift Type</label>
                        <div className="grid grid-cols-3 gap-3">
                            {shiftList.length > 0 ? (
                                shiftList.map((shift, index) => {
                                    const icons = ["wb_sunny", "light_mode", "nights_stay"];
                                    const colors = ["text-orange-500", "text-blue-500", "text-indigo-500"];
                                    return (
                                        <label key={shift.id} className="cursor-pointer relative">
                                            <input
                                                type="radio"
                                                name="shift_type"
                                                className="peer sr-only"
                                                value={shift.id}
                                                checked={String(selectedShiftId) === String(shift.id)}
                                                onChange={() => setSelectedShiftId(String(shift.id))}
                                            />
                                            <div className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark hover:border-primary/50 peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:ring-1 peer-checked:ring-primary transition-all h-full text-center">
                                                <span className={`material-symbols-outlined ${colors[index % colors.length]} mb-1`}>
                                                    {icons[index % icons.length]}
                                                </span>
                                                <span className="text-sm font-bold text-slate-900 dark:text-white">{shift.name}</span>
                                                <span className="text-xs text-slate-500">{shift.startTime} - {shift.endTime}</span>
                                            </div>
                                            <div className="absolute top-[-6px] right-[-6px] bg-primary text-white rounded-full p-0.5 hidden peer-checked:block shadow-sm">
                                                <span className="material-symbols-outlined text-[14px] block">check</span>
                                            </div>
                                        </label>
                                    );
                                })
                            ) : (
                                <div className="col-span-3 text-center text-sm text-slate-400 py-4">
                                    Chưa có ca làm nào. Hãy tạo ca làm trước.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex justify-between">
                            Notes <span className="text-slate-400 font-normal text-xs">Optional</span>
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-surface-dark px-4 py-3 text-sm text-slate-900 dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-slate-400 min-h-[80px]"
                            placeholder="Add special instructions or tasks for this shift..."
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
                        Cancel
                    </button>
                    <button
                        onClick={handleAssign}
                        disabled={loading}
                        className="px-6 py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-white font-semibold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        {loading ? (
                            <>
                                <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
                                Đang xử lý...
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-[20px]">person_add</span>
                                Assign Shift
                            </>
                        )}
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AssignStaffShiftModal;
