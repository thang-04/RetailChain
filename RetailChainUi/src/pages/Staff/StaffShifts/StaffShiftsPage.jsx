import React, { useState } from "react";
import AssignStaffShiftModal from "./components/AssignStaffShiftModal";

const StaffShiftsPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="flex-1 flex flex-col h-full min-w-0 bg-white dark:bg-background-dark relative">
            {/* Header & Controls */}
            <header className="flex-none px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark z-10">
                <div className="flex flex-wrap justify-between items-end gap-4 mb-6">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <h2 className="text-2xl font-bold tracking-tight text-primary dark:text-white">Schedule</h2>
                            <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs px-2 py-1 rounded font-medium border border-slate-200 dark:border-slate-700">
                                Week 42
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
                            <span className="material-symbols-outlined text-[18px]">event</span>
                            Oct 16 - Oct 22, 2023
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Segmented Control */}
                        <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-lg flex shadow-inner">
                            <button className="px-4 py-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 rounded-md transition-all">
                                Day
                            </button>
                            <button className="px-4 py-1.5 text-sm font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-700 shadow-sm rounded-md ring-1 ring-black/5 dark:ring-white/10">
                                Week
                            </button>
                            <button className="px-4 py-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 rounded-md transition-all">
                                Month
                            </button>
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center justify-center gap-2 h-10 px-5 bg-primary hover:bg-primary/90 text-white text-sm font-bold rounded-lg shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <span className="material-symbols-outlined text-[20px]">add</span>
                            Add Shift
                        </button>
                    </div>
                </div>
                {/* Toolbar: Nav & Filters */}
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
                        <button className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-md text-slate-600 dark:text-slate-300 transition-colors">
                            <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                        </button>
                        <button className="px-3 py-1 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 rounded-md transition-colors">
                            Today
                        </button>
                        <button className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-md text-slate-600 dark:text-slate-300 transition-colors">
                            <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                        </button>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-full border border-emerald-100 dark:border-emerald-800/30">
                            <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
                            <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                                Coverage: 98% (340/345 Hrs)
                            </span>
                        </div>
                        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>
                        <button className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">
                            <span className="material-symbols-outlined text-[20px]">filter_list</span>
                            <span>Filter</span>
                        </button>
                        <button className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">
                            <span className="material-symbols-outlined text-[20px]">download</span>
                            <span>Export</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Calendar Grid Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar relative flex flex-col bg-white dark:bg-background-dark">
                {/* Sticky Header Days */}
                <div className="sticky top-0 z-20 grid grid-cols-[60px_repeat(7,1fr)] bg-white dark:bg-background-dark border-b border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="p-4 border-r border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50"></div>
                    {/* Mon */}
                    <div className="p-3 border-r border-slate-100 dark:border-slate-800 text-center flex flex-col items-center justify-center group relative">
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Mon</span>
                        <span className="text-xl font-bold text-slate-800 dark:text-slate-200">16</span>
                    </div>
                    {/* Tue */}
                    <div className="p-3 border-r border-slate-100 dark:border-slate-800 text-center flex flex-col items-center justify-center group relative">
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Tue</span>
                        <span className="text-xl font-bold text-slate-800 dark:text-slate-200">17</span>
                    </div>
                    {/* Wed (Today) */}
                    <div className="p-3 border-r border-slate-100 dark:border-slate-800 text-center flex flex-col items-center justify-center bg-blue-50/30 dark:bg-blue-900/10 relative overflow-hidden">
                        <div className="absolute top-0 w-full h-1 bg-secondary"></div>
                        <span className="text-xs font-bold text-secondary uppercase tracking-wide">Wed</span>
                        <div className="size-8 rounded-full bg-primary text-white flex items-center justify-center mt-1 shadow-md">
                            <span className="text-lg font-bold">18</span>
                        </div>
                    </div>
                    {/* Thu */}
                    <div className="p-3 border-r border-slate-100 dark:border-slate-800 text-center flex flex-col items-center justify-center group relative">
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Thu</span>
                        <span className="text-xl font-bold text-slate-800 dark:text-slate-200">19</span>
                    </div>
                    {/* Fri */}
                    <div className="p-3 border-r border-slate-100 dark:border-slate-800 text-center flex flex-col items-center justify-center group relative">
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Fri</span>
                        <span className="text-xl font-bold text-slate-800 dark:text-slate-200">20</span>
                    </div>
                    {/* Sat */}
                    <div className="p-3 border-r border-slate-100 dark:border-slate-800 text-center flex flex-col items-center justify-center bg-slate-50/30 dark:bg-slate-900/30 group">
                        <span className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wide">Sat</span>
                        <span className="text-xl font-bold text-slate-600 dark:text-slate-400">21</span>
                    </div>
                    {/* Sun */}
                    <div className="p-3 text-center flex flex-col items-center justify-center bg-slate-50/30 dark:bg-slate-900/30 group">
                        <span className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wide">Sun</span>
                        <span className="text-xl font-bold text-slate-600 dark:text-slate-400">22</span>
                    </div>
                </div>

                {/* Scrollable Grid Content */}
                <div className="grid grid-cols-[60px_repeat(7,1fr)] relative min-h-[1000px] flex-1">
                    {/* Time Labels Column */}
                    <div className="border-r border-slate-100 dark:border-slate-800 bg-white dark:bg-background-dark text-xs text-slate-400 font-medium text-right py-2 select-none relative z-10 flex flex-col justify-between" style={{ paddingBottom: '20px' }}>
                        <div className="h-[80px] pr-2 pt-0 w-full text-right border-b border-transparent">08:00</div>
                        <div className="h-[80px] pr-2 pt-0 w-full text-right border-b border-transparent">09:00</div>
                        <div className="h-[80px] pr-2 pt-0 w-full text-right border-b border-transparent">10:00</div>
                        <div className="h-[80px] pr-2 pt-0 w-full text-right border-b border-transparent">11:00</div>
                        <div className="h-[80px] pr-2 pt-0 w-full text-right border-b border-transparent">12:00</div>
                        <div className="h-[80px] pr-2 pt-0 w-full text-right border-b border-transparent">13:00</div>
                        <div className="h-[80px] pr-2 pt-0 w-full text-right border-b border-transparent">14:00</div>
                        <div className="h-[80px] pr-2 pt-0 w-full text-right border-b border-transparent">15:00</div>
                        <div className="h-[80px] pr-2 pt-0 w-full text-right border-b border-transparent">16:00</div>
                        <div className="h-[80px] pr-2 pt-0 w-full text-right border-b border-transparent">17:00</div>
                        <div className="h-[80px] pr-2 pt-0 w-full text-right border-b border-transparent">18:00</div>
                        <div className="h-[80px] pr-2 pt-0 w-full text-right border-b border-transparent">19:00</div>
                        <div className="h-[80px] pr-2 pt-0 w-full text-right border-b border-transparent">20:00</div>
                    </div>

                    {/* Grid Background & Events */}
                    <div
                        className="col-span-7 grid grid-cols-7 relative"
                        style={{
                            backgroundSize: "100% 80px",
                            backgroundImage: "linear-gradient(to bottom, var(--tw-prose-td-borders, #e2e8f0) 1px, transparent 1px)"
                        }}
                    >
                        {/* Current Time Line (Overlay) */}
                        <div className="absolute left-0 right-0 top-[340px] z-10 flex items-center pointer-events-none">
                            <div className="w-full h-px bg-yellow-500 shadow-[0_0_4px_rgba(246,174,45,0.6)]"></div>
                            <div className="absolute -left-1 size-2 rounded-full bg-yellow-500"></div>
                        </div>

                        {/* MONDAY */}
                        <div className="relative border-r border-slate-100 dark:border-slate-800 group hover:bg-slate-50/40 transition-colors">
                            <div onClick={() => setIsModalOpen(true)} className="absolute top-[80px] left-1 right-1 h-[640px] bg-emerald-100/80 border-l-4 border-emerald-500 rounded-md p-2 shadow-sm hover:shadow-md cursor-pointer transition-all hover:scale-[1.02] hover:z-20 group/card">
                                <div className="flex justify-between items-start">
                                    <span className="text-xs font-bold text-emerald-800">Manager</span>
                                </div>
                                <div className="mt-1 flex items-center gap-2">
                                    <div className="size-6 rounded-full bg-emerald-200 text-emerald-700 flex items-center justify-center text-[10px] font-bold">SJ</div>
                                    <span className="text-sm font-semibold text-slate-800 truncate">Sarah J.</span>
                                </div>
                                <div className="mt-1 text-xs text-slate-600">09:00 - 17:00</div>
                            </div>
                        </div>

                        {/* TUESDAY */}
                        <div className="relative border-r border-slate-100 dark:border-slate-800 group hover:bg-slate-50/40 transition-colors">
                            <div className="absolute top-[0px] left-1 right-1 h-[320px] bg-orange-100/80 border-l-4 border-orange-400 rounded-md p-2 shadow-sm hover:shadow-md cursor-pointer transition-all hover:scale-[1.02] hover:z-20 group/card">
                                <div className="flex justify-between items-start">
                                    <span className="text-xs font-bold text-orange-800">Stock</span>
                                </div>
                                <div className="mt-1 flex items-center gap-2">
                                    <div className="size-6 rounded-full bg-orange-200 text-orange-700 flex items-center justify-center text-[10px] font-bold">ER</div>
                                    <span className="text-sm font-semibold text-slate-800 truncate">Emily R.</span>
                                </div>
                                <div className="mt-1 text-xs text-slate-600">08:00 - 12:00</div>
                            </div>
                        </div>

                        {/* WEDNESDAY */}
                        <div className="relative border-r border-slate-100 dark:border-slate-800 bg-blue-50/10 dark:bg-blue-900/5">
                            <div className="absolute top-[160px] left-1 right-1 h-[480px] bg-white border-2 border-red-500 border-l-4 rounded-md p-2 shadow-lg z-20 cursor-pointer group/card">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-1 text-red-600">
                                        <span className="material-symbols-outlined text-[16px] animate-pulse">warning</span>
                                        <span className="text-xs font-bold">Conflict</span>
                                    </div>
                                </div>
                                <div className="mt-2 flex items-center gap-2">
                                    <div className="size-6 rounded-full bg-red-200 text-red-700 flex items-center justify-center text-[10px] font-bold">JD</div>
                                    <span className="text-sm font-semibold text-slate-800 truncate">John D.</span>
                                </div>
                                <div className="mt-1 text-xs text-slate-600">10:00 - 16:00</div>
                            </div>
                        </div>

                        {/* THURSDAY */}
                        <div className="relative border-r border-slate-100 dark:border-slate-800 group hover:bg-slate-50/40 transition-colors"></div>

                        {/* FRIDAY */}
                        <div className="relative border-r border-slate-100 dark:border-slate-800 group hover:bg-slate-50/40 transition-colors">
                            <div className="absolute top-[160px] left-1 right-1 h-[320px] bg-blue-100/90 border-l-4 border-blue-500 rounded-md p-2 shadow-sm cursor-pointer hover:scale-[1.02] transition-all group/card">
                                <div className="flex justify-between items-start">
                                    <span className="text-xs font-bold text-blue-800">Sales</span>
                                </div>
                                <div className="mt-1 flex items-center gap-2">
                                    <div className="size-6 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center text-[10px] font-bold">MT</div>
                                    <span className="text-sm font-semibold text-slate-800 truncate">Mike T.</span>
                                </div>
                                <div className="mt-1 text-xs text-slate-600">10:00 - 14:00</div>
                            </div>
                        </div>

                        {/* SATURDAY */}
                        <div className="relative border-r border-slate-100 dark:border-slate-800 bg-slate-50/20"></div>

                        {/* SUNDAY */}
                        <div className="relative bg-slate-50/20"></div>

                    </div>
                </div>
            </div>

            <AssignStaffShiftModal isOpen={isModalOpen} onClose={setIsModalOpen} />
        </div>
    );
};

export default StaffShiftsPage;
