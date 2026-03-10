import React, { useState, useEffect, useCallback } from "react";
import AssignStaffShiftModal from "./components/AssignStaffShiftModal";
import shiftService from "@/services/shift.service";

// Hàm helper: lấy ngày đầu tuần (Monday) từ ngày bất kỳ
const getMonday = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
};

// Hàm helper: format ngày thành yyyy-MM-dd
const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
};

// Hàm helper: lấy số tuần trong năm
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

// Lấy initials từ tên
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
    const [currentMonday, setCurrentMonday] = useState(getMonday(new Date()));
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(false);

    // TODO: Lấy storeId từ context/route. Tạm dùng 1
    const storeId = 1;

    // Tính ngày trong tuần
    const weekDays = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(currentMonday);
        d.setDate(d.getDate() + i);
        return d;
    });

    const sunday = weekDays[6];
    const weekNumber = getWeekNumber(currentMonday);

    // Kiểm tra ngày hôm nay
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayIndex = weekDays.findIndex(d =>
        d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear()
    );

    // Tải danh sách ca phân công
    const loadAssignments = useCallback(async () => {
        setLoading(true);
        try {
            const from = formatDate(currentMonday);
            const to = formatDate(sunday);
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
    }, [currentMonday, storeId]);

    useEffect(() => {
        loadAssignments();
    }, [loadAssignments]);

    // Navigation
    const goToPrevWeek = () => {
        const prev = new Date(currentMonday);
        prev.setDate(prev.getDate() - 7);
        setCurrentMonday(prev);
    };

    const goToNextWeek = () => {
        const next = new Date(currentMonday);
        next.setDate(next.getDate() + 7);
        setCurrentMonday(next);
    };

    const goToToday = () => {
        setCurrentMonday(getMonday(new Date()));
    };

    // Nhóm assignments theo ngày (dayOfWeek index 0=Mon, 6=Sun)
    const assignmentsByDay = {};
    assignments.forEach(a => {
        if (a.status === "CANCELLED") return; // Bỏ qua ca đã hủy
        const aDate = new Date(a.workDate);
        const dayIndex = weekDays.findIndex(d =>
            d.getDate() === aDate.getDate() &&
            d.getMonth() === aDate.getMonth() &&
            d.getFullYear() === aDate.getFullYear()
        );
        if (dayIndex >= 0) {
            if (!assignmentsByDay[dayIndex]) assignmentsByDay[dayIndex] = [];
            assignmentsByDay[dayIndex].push(a);
        }
    });

    // Tính vị trí và height dựa trên thời gian
    const timeToPixels = (timeStr) => {
        const [h, m] = timeStr.split(":").map(Number);
        return (h - 8) * 80 + (m / 60) * 80; // 80px per hour, starts at 08:00
    };

    const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Format header ngày
    const headerRange = `${monthNames[currentMonday.getMonth()]} ${currentMonday.getDate()} - ${monthNames[sunday.getMonth()]} ${sunday.getDate()}, ${sunday.getFullYear()}`;

    // Đếm coverage
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
                                Week {weekNumber}
                            </span>
                            {loading && (
                                <span className="material-symbols-outlined text-primary text-[18px] animate-spin">progress_activity</span>
                            )}
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
                            <span className="material-symbols-outlined text-[18px]">event</span>
                            {headerRange}
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
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
                        <button onClick={goToPrevWeek} className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-md text-slate-600 dark:text-slate-300 transition-colors">
                            <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                        </button>
                        <button onClick={goToToday} className="px-3 py-1 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 rounded-md transition-colors">
                            Today
                        </button>
                        <button onClick={goToNextWeek} className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-md text-slate-600 dark:text-slate-300 transition-colors">
                            <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                        </button>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-full border border-emerald-100 dark:border-emerald-800/30">
                            <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
                            <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                                Assigned: {totalAssigned} shift(s) this week
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Calendar Grid Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar relative flex flex-col bg-white dark:bg-background-dark">
                {/* Sticky Header Days */}
                <div className="sticky top-0 z-20 grid grid-cols-[60px_repeat(7,1fr)] bg-white dark:bg-background-dark border-b border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="p-4 border-r border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50"></div>
                    {weekDays.map((day, idx) => {
                        const isToday = idx === todayIndex;
                        const isWeekend = idx >= 5;
                        return (
                            <div
                                key={idx}
                                className={`p-3 border-r border-slate-100 dark:border-slate-800 text-center flex flex-col items-center justify-center relative overflow-hidden
                                    ${isToday ? "bg-blue-50/30 dark:bg-blue-900/10" : isWeekend ? "bg-slate-50/30 dark:bg-slate-900/30" : "group"}`}
                            >
                                {isToday && <div className="absolute top-0 w-full h-1 bg-secondary"></div>}
                                <span className={`text-xs font-${isToday ? "bold" : "medium"} ${isToday ? "text-secondary" : isWeekend ? "text-slate-400 dark:text-slate-500" : "text-slate-500 dark:text-slate-400"} uppercase tracking-wide`}>
                                    {dayNames[idx]}
                                </span>
                                {isToday ? (
                                    <div className="size-8 rounded-full bg-primary text-white flex items-center justify-center mt-1 shadow-md">
                                        <span className="text-lg font-bold">{day.getDate()}</span>
                                    </div>
                                ) : (
                                    <span className={`text-xl font-bold ${isWeekend ? "text-slate-600 dark:text-slate-400" : "text-slate-800 dark:text-slate-200"}`}>
                                        {day.getDate()}
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
                        {todayIndex >= 0 && (
                            <div
                                className="absolute left-0 right-0 z-10 flex items-center pointer-events-none"
                                style={{ top: `${timeToPixels(`${new Date().getHours()}:${new Date().getMinutes()}`)}px` }}
                            >
                                <div className="w-full h-px bg-yellow-500 shadow-[0_0_4px_rgba(246,174,45,0.6)]"></div>
                                <div className="absolute -left-1 size-2 rounded-full bg-yellow-500"></div>
                            </div>
                        )}

                        {/* Render 7 columns */}
                        {weekDays.map((_, dayIdx) => {
                            const dayAssignments = assignmentsByDay[dayIdx] || [];
                            const isWeekend = dayIdx >= 5;
                            const isToday = dayIdx === todayIndex;

                            // --- Overlap layout: compute column index & total columns for each assignment ---
                            const layoutMap = new Map(); // assignmentId -> { col, totalCols }
                            if (dayAssignments.length > 0) {
                                // Sort by start time, then by end time
                                const sorted = [...dayAssignments].sort((a, b) => {
                                    if (a.startTime < b.startTime) return -1;
                                    if (a.startTime > b.startTime) return 1;
                                    return a.endTime < b.endTime ? -1 : 1;
                                });

                                // Build overlap groups (connected components of overlapping intervals)
                                const groups = [];
                                let currentGroup = [sorted[0]];
                                let groupEnd = sorted[0].endTime;

                                for (let i = 1; i < sorted.length; i++) {
                                    if (sorted[i].startTime < groupEnd) {
                                        // overlaps with current group
                                        currentGroup.push(sorted[i]);
                                        if (sorted[i].endTime > groupEnd) groupEnd = sorted[i].endTime;
                                    } else {
                                        groups.push(currentGroup);
                                        currentGroup = [sorted[i]];
                                        groupEnd = sorted[i].endTime;
                                    }
                                }
                                groups.push(currentGroup);

                                // Assign column positions within each group
                                groups.forEach(group => {
                                    const totalCols = group.length;
                                    group.forEach((assignment, colIdx) => {
                                        layoutMap.set(assignment.id, { col: colIdx, totalCols });
                                    });
                                });
                            }

                            return (
                                <div
                                    key={dayIdx}
                                    className={`relative border-r border-slate-100 dark:border-slate-800
                                        ${isToday ? "bg-blue-50/10 dark:bg-blue-900/5" : isWeekend ? "bg-slate-50/20" : "group hover:bg-slate-50/40 transition-colors"}`}
                                >
                                    {dayAssignments.map((assignment, aIdx) => {
                                        const color = SHIFT_COLORS[assignment.shiftId % SHIFT_COLORS.length] || SHIFT_COLORS[0];
                                        const top = timeToPixels(assignment.startTime);
                                        const bottom = timeToPixels(assignment.endTime);
                                        const height = Math.max(bottom - top, 40);

                                        // Get overlap layout info
                                        const layout = layoutMap.get(assignment.id) || { col: 0, totalCols: 1 };
                                        const widthPercent = 100 / layout.totalCols;
                                        const leftPercent = layout.col * widthPercent;
                                        const GAP = 2; // px gap between side-by-side items

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

            <AssignStaffShiftModal
                isOpen={isModalOpen}
                onClose={setIsModalOpen}
                storeId={storeId}
                onAssignSuccess={loadAssignments}
            />
        </div>
    );
};

export default StaffShiftsPage;
