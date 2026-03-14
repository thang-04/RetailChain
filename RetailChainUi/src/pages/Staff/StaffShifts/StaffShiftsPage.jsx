import React, { useState, useEffect, useCallback, useMemo } from "react";
import AssignStaffShiftModal from "./components/AssignStaffShiftModal";
import CreateShiftModal from "./components/CreateShiftModal";
import shiftService from "@/services/shift.service";
import useAuth from "@/contexts/AuthContext/useAuth";
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, getWeek, addMonths, subMonths, addYears, subYears, startOfYear, endOfYear, eachMonthOfInterval } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

// Hàm helper: lấy số tuần trong năm (ISO)
const getWeekNumber = (date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
};

// Màu sắc cho các ca khác nhau
const SHIFT_COLORS = [
    { bg: "bg-emerald-100/80", border: "border-emerald-500", text: "text-emerald-800", avatar: "bg-emerald-200 text-emerald-700" },
    { bg: "bg-blue-100/90", border: "border-blue-500", text: "text-blue-800", avatar: "bg-blue-200 text-blue-700" },
    { bg: "bg-orange-100/80", border: "border-orange-400", text: "text-orange-800", avatar: "bg-orange-200 text-orange-700" },
    { bg: "bg-purple-100/80", border: "border-purple-500", text: "text-purple-800", avatar: "bg-purple-200 text-purple-700" },
    { bg: "bg-rose-100/80", border: "border-rose-500", text: "text-rose-800", avatar: "bg-rose-200 text-rose-700" },
    { bg: "bg-teal-100/80", border: "border-teal-500", text: "text-teal-800", avatar: "bg-teal-200 text-teal-700" },
];

const getInitials = (name) => {
    if (!name) return "??";
    const parts = name.split(" ");
    if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
};

const StaffShiftsPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreateShiftModalOpen, setIsCreateShiftModalOpen] = useState(false);

    // View mode and Anchor Date
    const [viewMode, setViewMode] = useState("week"); // "week" | "month" | "year"
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(false);

    const { user } = useAuth();
    // Lấy storeId từ user đang đăng nhập
    const storeId = user?.storeId || null;

    // Calculate display range
    const { displayStart, displayEnd, displayDays } = useMemo(() => {
        let start, end;
        if (viewMode === "week") {
            start = startOfWeek(currentDate, { weekStartsOn: 1 });
            end = endOfWeek(currentDate, { weekStartsOn: 1 });
        } else if (viewMode === "month") {
            start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 });
            end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 });
        } else { // year
            start = startOfYear(currentDate);
            end = endOfYear(currentDate);
        }
        return {
            displayStart: start,
            displayEnd: end,
            displayDays: viewMode === "year" ? [] : eachDayOfInterval({ start, end })
        };
    }, [viewMode, currentDate]);

    // Load assignments
    const loadAssignments = useCallback(async () => {
        setLoading(true);
        try {
            const from = format(displayStart, "yyyy-MM-dd");
            const to = format(displayEnd, "yyyy-MM-dd");
            const result = await shiftService.getAssignments(storeId, from, to);
            if (result?.code === 200 && result?.data) {
                setAssignments(result.data);
            } else {
                setAssignments([]);
            }
        } catch (err) {
            console.error("Error loading assignments:", err);
            setAssignments([]);
        } finally {
            setLoading(false);
        }
    }, [displayStart, displayEnd, storeId]);

    useEffect(() => {
        loadAssignments();
    }, [loadAssignments]);

    // Navigation
    const handlePrev = () => {
        if (viewMode === "week") setCurrentDate(subWeeks(currentDate, 1));
        else if (viewMode === "month") setCurrentDate(subMonths(currentDate, 1));
        else setCurrentDate(subYears(currentDate, 1));
    };

    const handleNext = () => {
        if (viewMode === "week") setCurrentDate(addWeeks(currentDate, 1));
        else if (viewMode === "month") setCurrentDate(addMonths(currentDate, 1));
        else setCurrentDate(addYears(currentDate, 1));
    };

    const handleToday = () => {
        setCurrentDate(new Date());
    };

    // Grouping
    const assignmentsByDateKey = {};
    assignments.forEach(a => {
        if (a.status === "CANCELLED") return;
        const dateKey = a.workDate;
        if (!assignmentsByDateKey[dateKey]) assignmentsByDateKey[dateKey] = [];
        assignmentsByDateKey[dateKey].push(a);
    });

    const timeToPixels = (timeStr) => {
        const [h, m] = timeStr.split(":").map(Number);
        return (h - 8) * 80 + (m / 60) * 80;
    };

    const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const headerRange = viewMode === "week"
        ? `${format(startOfWeek(currentDate, { weekStartsOn: 1 }), "MMM d")} - ${format(endOfWeek(currentDate, { weekStartsOn: 1 }), "MMM d, yyyy")}`
        : viewMode === "month" ? format(currentDate, "MMMM yyyy")
            : format(currentDate, "yyyy");

    const totalAssigned = assignments.filter(a => a.status === "ASSIGNED").length;

    return (
        <div className="flex-1 flex flex-col h-full min-w-0 bg-white dark:bg-background-dark relative">
            {/* Header & Controls */}
            <header className="flex-none px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark z-10">
                <div className="flex flex-wrap justify-between items-end gap-4 mb-6">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <h2 className="text-2xl font-bold tracking-tight text-primary dark:text-white">Schedule</h2>
                            <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs px-2 py-1 rounded font-medium border border-slate-200 dark:border-slate-700">
                                {viewMode === "week" ? `Week ${getWeekNumber(currentDate)}` : viewMode === "month" ? "Month View" : "Year View"}
                            </span>
                            {loading && (
                                <span className="material-symbols-outlined text-primary text-[18px] animate-spin">progress_activity</span>
                            )}
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
                            <span className="material-symbols-outlined text-[18px]">event</span>

                            <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                                <PopoverTrigger asChild>
                                    <button className="hover:text-primary transition-colors hover:underline font-medium">
                                        {headerRange}
                                    </button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={currentDate}
                                        onSelect={(date) => {
                                            if (date) {
                                                setCurrentDate(date);
                                                setIsDatePickerOpen(false);
                                            }
                                        }}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsCreateShiftModalOpen(true)}
                            className="flex items-center justify-center gap-2 h-10 px-5 bg-white dark:bg-slate-800 hover:bg-slate-50 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-bold rounded-lg shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <span className="material-symbols-outlined text-[20px]">add_circle</span>
                            Create Shift
                        </button>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center justify-center gap-2 h-10 px-5 bg-primary hover:bg-primary/90 text-white text-sm font-bold rounded-lg shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <span className="material-symbols-outlined text-[20px]">person_add</span>
                            Assign Staff
                        </button>
                    </div>
                </div>
                {/* Toolbar: Nav & Filters */}
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
                            <button onClick={handlePrev} className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-md text-slate-600 dark:text-slate-300 transition-colors">
                                <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                            </button>
                            <button onClick={handleToday} className="px-3 py-1 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 rounded-md transition-colors">
                                Today
                            </button>
                            <button onClick={handleNext} className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-md text-slate-600 dark:text-slate-300 transition-colors">
                                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                            </button>
                        </div>
                        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
                            <button
                                onClick={() => setViewMode("week")}
                                className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all ${viewMode === "week" ? "bg-white dark:bg-slate-700 text-primary shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
                            >
                                Week
                            </button>
                            <button
                                onClick={() => setViewMode("month")}
                                className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all ${viewMode === "month" ? "bg-white dark:bg-slate-700 text-primary shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
                            >
                                Month
                            </button>
                            <button
                                onClick={() => setViewMode("year")}
                                className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all ${viewMode === "year" ? "bg-white dark:bg-slate-700 text-primary shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
                            >
                                Year
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-full border border-emerald-100 dark:border-emerald-800/30">
                            <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
                            <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                                Assigned: {totalAssigned} shift(s) this {viewMode}
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Calendar Grid Area */}
            {viewMode === "week" ? (
                <div className="flex-1 overflow-y-auto custom-scrollbar relative flex flex-col bg-white dark:bg-background-dark">
                    {/* Sticky Header Days */}
                    <div className="sticky top-0 z-20 grid grid-cols-[60px_repeat(7,1fr)] bg-white dark:bg-background-dark border-b border-slate-200 dark:border-slate-700 shadow-sm">
                        <div className="p-4 border-r border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50"></div>
                        {displayDays.map((day, idx) => {
                            const isToday = isSameDay(day, new Date());
                            const isWeekend = idx >= 5;
                            return (
                                <div
                                    key={idx}
                                    className={`p-3 border-r border-slate-100 dark:border-slate-800 text-center flex flex-col items-center justify-center relative overflow-hidden
                                        ${isToday ? "bg-blue-50/30 dark:bg-blue-900/10" : isWeekend ? "bg-slate-50/30 dark:bg-slate-900/30" : "group"}`}
                                >
                                    {isToday && <div className="absolute top-0 w-full h-1 bg-secondary"></div>}
                                    <span className={`text-xs font-${isToday ? "bold" : "medium"} ${isToday ? "text-secondary" : isWeekend ? "text-slate-400 dark:text-slate-500" : "text-slate-500 dark:text-slate-400"} uppercase tracking-wide`}>
                                        {format(day, "EEE")}
                                    </span>
                                    {isToday ? (
                                        <div className="size-8 rounded-full bg-primary text-white flex items-center justify-center mt-1 shadow-md">
                                            <span className="text-lg font-bold">{format(day, "d")}</span>
                                        </div>
                                    ) : (
                                        <span className={`text-xl font-bold ${isWeekend ? "text-slate-600 dark:text-slate-400" : "text-slate-800 dark:text-slate-200"}`}>
                                            {format(day, "d")}
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Scrollable Grid Content */}
                    <div className="grid grid-cols-[60px_repeat(7,1fr)] relative min-h-[1000px] flex-1">
                        {/* Time Labels Column */}
                        <div className="border-r border-slate-100 dark:border-slate-800 bg-white dark:bg-background-dark text-xs text-slate-400 font-medium text-right py-2 select-none relative z-10 flex flex-col justify-between" style={{ paddingBottom: '20px' }}>
                            {Array.from({ length: 13 }, (_, i) => (
                                <div key={i} className="h-[80px] pr-2 pt-0 w-full text-right border-b border-transparent">
                                    {String(8 + i).padStart(2, "0")}:00
                                </div>
                            ))}
                        </div>

                        {/* Grid Background & Events */}
                        <div
                            className="col-span-7 grid grid-cols-7 relative"
                            style={{
                                backgroundSize: "100% 80px",
                                backgroundImage: "linear-gradient(to bottom, var(--tw-prose-td-borders, #e2e8f0) 1px, transparent 1px)"
                            }}
                        >
                            {/* Current Time Line */}
                            {displayDays.some(d => isSameDay(d, new Date())) && (
                                <div
                                    className="absolute left-0 right-0 z-10 flex items-center pointer-events-none"
                                    style={{ top: `${timeToPixels(`${new Date().getHours()}:${new Date().getMinutes()}`)}px` }}
                                >
                                    <div className="w-full h-px bg-yellow-500 shadow-[0_0_4px_rgba(246,174,45,0.6)]"></div>
                                    <div className="absolute -left-1 size-2 rounded-full bg-yellow-500"></div>
                                </div>
                            )}

                            {/* Render 7 columns for Week */}
                            {displayDays.map((day, dayIdx) => {
                                const dateKey = format(day, "yyyy-MM-dd");
                                const dayAssignments = assignmentsByDateKey[dateKey] || [];
                                const isWeekend = dayIdx >= 5;
                                const isToday = isSameDay(day, new Date());

                                const layoutMap = new Map();
                                if (dayAssignments.length > 0) {
                                    const sorted = [...dayAssignments].sort((a, b) => {
                                        if (a.startTime < b.startTime) return -1;
                                        if (a.startTime > b.startTime) return 1;
                                        return a.endTime < b.endTime ? -1 : 1;
                                    });

                                    const groups = [];
                                    let currentGroup = [sorted[0]];
                                    let groupEnd = sorted[0].endTime;

                                    for (let i = 1; i < sorted.length; i++) {
                                        if (sorted[i].startTime < groupEnd) {
                                            currentGroup.push(sorted[i]);
                                            if (sorted[i].endTime > groupEnd) groupEnd = sorted[i].endTime;
                                        } else {
                                            groups.push(currentGroup);
                                            currentGroup = [sorted[i]];
                                            groupEnd = sorted[i].endTime;
                                        }
                                    }
                                    groups.push(currentGroup);

                                    groups.forEach(group => {
                                        const totalCols = group.length;
                                        group.forEach((assignment, colIdx) => {
                                            layoutMap.set(assignment.id, { col: colIdx, totalCols });
                                        });
                                    });
                                }

                                return (
                                    <div
                                        key={dateKey}
                                        className={`relative border-r border-slate-100 dark:border-slate-800
                                            ${isToday ? "bg-blue-50/10 dark:bg-blue-900/5" : isWeekend ? "bg-slate-50/20" : "group hover:bg-slate-50/40 transition-colors"}`}
                                    >
                                        {dayAssignments.map((assignment, aIdx) => {
                                            const color = SHIFT_COLORS[assignment.shiftId % SHIFT_COLORS.length] || SHIFT_COLORS[0];
                                            const top = timeToPixels(assignment.startTime);
                                            const bottom = timeToPixels(assignment.endTime);
                                            const height = Math.max(bottom - top, 40);

                                            const layout = layoutMap.get(assignment.id) || { col: 0, totalCols: 1 };
                                            const widthPercent = 100 / layout.totalCols;
                                            const leftPercent = layout.col * widthPercent;
                                            const GAP = 2;

                                            return (
                                                <div
                                                    key={assignment.id || aIdx}
                                                    className={`absolute ${color.bg} border-l-4 ${color.border} rounded-md p-1.5 shadow-sm hover:shadow-md cursor-pointer transition-all hover:scale-[1.02] hover:z-20 overflow-hidden`}
                                                    style={{
                                                        top: `${top}px`,
                                                        height: `${height}px`,
                                                        left: `calc(${leftPercent}% + ${GAP}px)`,
                                                        width: `calc(${widthPercent}% - ${GAP * 2}px)`,
                                                    }}
                                                    title={`${assignment.userName} — ${assignment.shiftName} (${assignment.startTime} - ${assignment.endTime})`}
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <span className={`text-xs font-bold ${color.text} truncate`}>{assignment.shiftName}</span>
                                                    </div>
                                                    <div className="mt-0.5 flex items-center gap-1">
                                                        <div className={`size-5 flex-shrink-0 rounded-full ${color.avatar} flex items-center justify-center text-[9px] font-bold`}>
                                                            {getInitials(assignment.userName)}
                                                        </div>
                                                        <span className="text-xs font-semibold text-slate-800 truncate">{assignment.userName}</span>
                                                    </div>
                                                    <div className="mt-0.5 text-[10px] text-slate-600">{assignment.startTime} - {assignment.endTime}</div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            ) : viewMode === "month" ? (
                /* Month View */
                <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-900 min-h-0 overflow-hidden p-4">
                    <div className="flex-1 bg-white dark:bg-background-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
                        {/* Days Header */}
                        <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                            {dayNames.map(day => (
                                <div key={day} className="py-2 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                                    {day}
                                </div>
                            ))}
                        </div>
                        {/* Month Grid */}
                        <div className="flex-1 grid grid-cols-7 auto-rows-fr">
                            {displayDays.map((day, i) => {
                                const isToday = isSameDay(day, new Date());
                                const isCurrentMonth = isSameMonth(day, currentDate);
                                const dateKey = format(day, "yyyy-MM-dd");
                                const dayShifts = assignmentsByDateKey[dateKey] || [];

                                return (
                                    <div
                                        key={dateKey}
                                        className={`border-b border-r border-slate-100 dark:border-slate-800 p-2 overflow-hidden flex flex-col transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer
                                            ${!isCurrentMonth ? 'bg-slate-50/50 dark:bg-slate-900/50' : ''}
                                            ${i % 7 === 6 ? 'border-r-0' : ''}
                                        `}
                                    >
                                        <div className="flex justify-between items-center mb-1 drop-shadow-sm">
                                            <span className="text-[10px] font-medium text-slate-400">
                                                {dayShifts.length > 0 && `${dayShifts.length} shift${dayShifts.length > 1 ? 's' : ''}`}
                                            </span>
                                            <span className={`text-sm font-semibold flex items-center justify-center size-7 rounded-full
                                                ${isToday ? 'bg-primary text-white shadow-md' : 'text-slate-700 dark:text-slate-300'}
                                                ${!isCurrentMonth && !isToday ? 'opacity-40' : ''}
                                            `}>
                                                {format(day, "d")}
                                            </span>
                                        </div>
                                        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-1 pr-1">
                                            {dayShifts.map(assignment => {
                                                const color = SHIFT_COLORS[assignment.shiftId % SHIFT_COLORS.length] || SHIFT_COLORS[0];
                                                return (
                                                    <div
                                                        key={assignment.id}
                                                        className={`text-[10px] py-1 px-1.5 rounded truncate font-medium border-l-[3px]
                                                            ${color.bg} ${color.text} ${color.border}
                                                        `}
                                                        title={`${assignment.shiftName}: ${assignment.userName}`}
                                                    >
                                                        {assignment.startTime.substring(0, 5)} {assignment.userName}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            ) : (
                /* Year View - 12 mini month grids */
                <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50 dark:bg-slate-900 p-5">
                    <div className="grid grid-cols-4 gap-4">
                        {eachMonthOfInterval({ start: startOfYear(currentDate), end: endOfYear(currentDate) }).map((monthDate) => {
                            const monthStart = startOfWeek(startOfMonth(monthDate), { weekStartsOn: 1 });
                            const monthEnd = endOfWeek(endOfMonth(monthDate), { weekStartsOn: 1 });
                            const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
                            const monthName = format(monthDate, "MMMM");
                            const totalMonthShifts = assignments.filter(a => {
                                if (a.status === "CANCELLED") return false;
                                const d = new Date(a.workDate);
                                return d.getMonth() === monthDate.getMonth() && d.getFullYear() === monthDate.getFullYear();
                            }).length;

                            return (
                                <div
                                    key={monthName}
                                    className="bg-white dark:bg-background-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                                    onClick={() => { setCurrentDate(monthDate); setViewMode("month"); }}
                                >
                                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                        <span className="font-bold text-slate-800 dark:text-white text-sm">{monthName}</span>
                                        {totalMonthShifts > 0 && (
                                            <span className="text-[10px] font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                                {totalMonthShifts} shifts
                                            </span>
                                        )}
                                    </div>
                                    <div className="p-2">
                                        {/* Mini day headers */}
                                        <div className="grid grid-cols-7 mb-1">
                                            {["M", "T", "W", "T", "F", "S", "S"].map((d, idx) => (
                                                <div key={idx} className="text-center text-[9px] font-semibold text-slate-400 uppercase">{d}</div>
                                            ))}
                                        </div>
                                        {/* Mini day cells */}
                                        <div className="grid grid-cols-7 gap-y-1">
                                            {monthDays.map((day) => {
                                                const isToday = isSameDay(day, new Date());
                                                const isCurrentMonth = isSameMonth(day, monthDate);
                                                const dateKey = format(day, "yyyy-MM-dd");
                                                const hasShifts = (assignmentsByDateKey[dateKey] || []).length > 0;
                                                return (
                                                    <div key={dateKey} className="flex items-center justify-center">
                                                        <span className={`text-[10px] size-5 flex items-center justify-center rounded-full font-medium transition-colors
                                                            ${isToday ? 'bg-primary text-white font-bold' : ''}
                                                            ${!isCurrentMonth ? 'text-slate-300 dark:text-slate-700' : isToday ? '' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}
                                                            ${hasShifts && !isToday && isCurrentMonth ? 'underline decoration-primary decoration-dotted font-bold text-primary' : ''}
                                                        `}>
                                                            {format(day, "d")}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <AssignStaffShiftModal
                isOpen={isModalOpen}
                onClose={setIsModalOpen}
                storeId={storeId}
                onAssignSuccess={loadAssignments}
            />

            <CreateShiftModal
                isOpen={isCreateShiftModalOpen}
                onClose={setIsCreateShiftModalOpen}
                storeId={storeId}
                onCreateSuccess={loadAssignments}
            />
        </div>
    );
};

export default StaffShiftsPage;
