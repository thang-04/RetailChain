import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AssignStaffShiftModal = ({ isOpen, onClose }) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg p-0 overflow-hidden bg-white dark:bg-surface-dark border-border-light dark:border-border-dark gap-0">
                <DialogHeader className="p-6 pb-4 border-b border-border-light dark:border-border-dark flex flex-row justify-between items-start space-y-0">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Store A</span>
                        </div>
                        <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white leading-tight">Assign Shift</DialogTitle>
                        <DialogDescription className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                            Schedule a team member for an upcoming shift.
                        </DialogDescription>
                    </div>
                </DialogHeader>

                <div className="p-6 flex flex-col gap-6 max-h-[70vh] overflow-y-auto">
                    {/* Staff Selection */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Select Staff Member</label>
                        <Select>
                            <SelectTrigger className="w-full h-12 rounded-xl border-slate-300 dark:border-slate-600 dark:bg-surface-dark dark:text-white">
                                <SelectValue placeholder="Search or select employee..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">Sarah Jenkins (Manager)</SelectItem>
                                <SelectItem value="2">Michael Chen (Associate)</SelectItem>
                                <SelectItem value="3">David Miller (Associate)</SelectItem>
                                <SelectItem value="4">Emily Ross (Trainee)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Date & Time Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Date</label>
                            <input
                                type="date"
                                className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-surface-dark px-4 py-3 text-base text-slate-900 dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>

                        {/* Helper Info */}
                        <div className="flex flex-col gap-2 justify-end pb-3">
                            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-lg text-sm border border-green-100 dark:border-green-800 h-12">
                                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                                <span>Store is open (09:00 - 21:00)</span>
                            </div>
                        </div>
                    </div>

                    {/* Shift Type (Radio Cards) */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Shift Type</label>
                        <div className="grid grid-cols-3 gap-3">
                            {/* Option 1 */}
                            <label className="cursor-pointer relative">
                                <input type="radio" name="shift_type" className="peer sr-only" defaultChecked />
                                <div className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark hover:border-primary/50 peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:ring-1 peer-checked:ring-primary transition-all h-full text-center">
                                    <span className="material-symbols-outlined text-orange-500 mb-1">wb_sunny</span>
                                    <span className="text-sm font-bold text-slate-900 dark:text-white">Opening</span>
                                    <span className="text-xs text-slate-500">9am - 3pm</span>
                                </div>
                                <div className="absolute top-[-6px] right-[-6px] bg-primary text-white rounded-full p-0.5 hidden peer-checked:block shadow-sm">
                                    <span className="material-symbols-outlined text-[14px] block">check</span>
                                </div>
                            </label>

                            {/* Option 2 */}
                            <label className="cursor-pointer relative">
                                <input type="radio" name="shift_type" className="peer sr-only" />
                                <div className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark hover:border-primary/50 peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:ring-1 peer-checked:ring-primary transition-all h-full text-center">
                                    <span className="material-symbols-outlined text-blue-500 mb-1">light_mode</span>
                                    <span className="text-sm font-bold text-slate-900 dark:text-white">Mid-Day</span>
                                    <span className="text-xs text-slate-500">12pm - 6pm</span>
                                </div>
                                <div className="absolute top-[-6px] right-[-6px] bg-primary text-white rounded-full p-0.5 hidden peer-checked:block shadow-sm">
                                    <span className="material-symbols-outlined text-[14px] block">check</span>
                                </div>
                            </label>

                            {/* Option 3 */}
                            <label className="cursor-pointer relative">
                                <input type="radio" name="shift_type" className="peer sr-only" />
                                <div className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark hover:border-primary/50 peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:ring-1 peer-checked:ring-primary transition-all h-full text-center">
                                    <span className="material-symbols-outlined text-indigo-500 mb-1">nights_stay</span>
                                    <span className="text-sm font-bold text-slate-900 dark:text-white">Closing</span>
                                    <span className="text-xs text-slate-500">3pm - 9pm</span>
                                </div>
                                <div className="absolute top-[-6px] right-[-6px] bg-primary text-white rounded-full p-0.5 hidden peer-checked:block shadow-sm">
                                    <span className="material-symbols-outlined text-[14px] block">check</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex justify-between">
                            Notes <span className="text-slate-400 font-normal text-xs">Optional</span>
                        </label>
                        <textarea
                            className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-surface-dark px-4 py-3 text-sm text-slate-900 dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-slate-400 min-h-[80px]"
                            placeholder="Add special instructions or tasks for this shift..."
                        ></textarea>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="p-6 bg-slate-50 dark:bg-black/20 border-t border-border-light dark:border-border-dark flex justify-end gap-3 rounded-b-lg">
                    <button
                        onClick={() => onClose(false)}
                        className="px-6 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        Cancel
                    </button>
                    <button className="px-6 py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-white font-semibold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all flex items-center gap-2">
                        <span className="material-symbols-outlined text-[20px]">person_add</span>
                        Assign Shift
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AssignStaffShiftModal;
