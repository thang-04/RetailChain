import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import AssignStaffShiftModal from "./components/AssignStaffShiftModal";
import CreateShiftModal from "./components/CreateShiftModal";
import shiftService from "@/services/shift.service";
import storeService from "@/services/store.service";
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
    const { id: urlStoreId } = useParams();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreateShiftModalOpen, setIsCreateShiftModalOpen] = useState(false);

    // View mode and Anchor Date
    const [viewMode, setViewMode] = useState("week"); // "week" | "month" | "year"
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

    const [assignments, setAssignments] = useState([]);
    const [shiftTypes, setShiftTypes] = useState([]); // Danh sách các loại ca (Shift entity)
    const [loading, setLoading] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [storeDetail, setStoreDetail] = useState(null);
    const [stores, setStores] = useState([]); // Danh sách toàn bộ cửa hàng (cho Super Admin chọn)
    const [storesLoading, setStoresLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const { user, isSuperAdmin } = useAuth();
    const navigate = useNavigate();
    // Lấy storeId từ URL hoặc từ user đang đăng nhập
    const storeId = urlStoreId || user?.storeId || null;

    // Load danh sách cửa hàng cho Super Admin
    useEffect(() => {
        const fetchAllStores = async () => {
            if (!storeId && isSuperAdmin()) {
                setStoresLoading(true);
                try {
                    const data = await storeService.getAllStores();
                    setStores(data || []);
                } catch (err) {
                    console.error("Error fetching all stores:", err);
                } finally {
                    setStoresLoading(false);
                }
            }
        };
        fetchAllStores();
    }, [storeId, isSuperAdmin]);

    const filteredStores = useMemo(() => {
        return stores.filter(s =>
            s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.id.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [stores, searchTerm]);

    const handleStoreSelect = (code) => {
        navigate(`/store/${code}/shifts`);
    };

    // Load các loại ca của cửa hàng
    const loadShiftTypes = useCallback(async () => {
        const numericId = storeDetail?.dbId || (typeof storeId === 'number' ? storeId : null);
        if (!numericId) return;
        try {
            const result = await shiftService.getShiftsByStore(numericId);
            if (result?.code === 200 && result?.data) {
                setShiftTypes(result.data);
            }
        } catch (err) {
            console.error("Error loading shift types:", err);
        }
    }, [storeDetail?.dbId, storeId]);

    // Import ca mẫu từ hệ thống
    const handleInitializeTemplates = async () => {
        const numericId = storeDetail?.dbId || (typeof storeId === 'number' ? storeId : null);
        if (!numericId || isImporting) return;

        setIsImporting(true);
        try {
            // 1. Lấy danh sách mẫu từ hệ thống
            const templatesRes = await shiftService.getTemplates();
            if (templatesRes?.code === 200 && templatesRes?.data?.length > 0) {
                const templateIds = templatesRes.data.map(t => t.id);
                // 2. Import vào cửa hàng hiện tại
                const importRes = await shiftService.importTemplates(numericId, templateIds);
                if (importRes?.code === 200) {
                    await loadShiftTypes();
                    await loadAssignments();
                }
            }
        } catch (err) {
            console.error("Error initializing templates:", err);
        } finally {
            setIsImporting(false);
        }
    };

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
        const numericId = storeDetail?.dbId || (typeof storeId === 'number' ? storeId : null);
        if (!numericId) {
            setAssignments([]);
            return;
        }
        setLoading(true);
        try {
            const from = format(displayStart, "yyyy-MM-dd");
            const to = format(displayEnd, "yyyy-MM-dd");
            const result = await shiftService.getAssignments(numericId, from, to);
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
    }, [displayStart, displayEnd, storeDetail?.dbId, storeId]);

    // Fetch store details
    useEffect(() => {
        const fetchStoreDetail = async () => {
            if (storeId) {
                try {
                    const res = await storeService.getStoreById(storeId);
                    if (res) {
                        setStoreDetail(res);
                    }
                } catch (err) {
                    console.error("Error fetching store detail:", err);
                }
            }
        };
        fetchStoreDetail();
    }, [storeId]);

    useEffect(() => {
        loadAssignments();
        loadShiftTypes();
    }, [loadAssignments, loadShiftTypes]);

    if (!storeId && isSuperAdmin()) {
        return (
            <div className="flex-1 flex flex-col items-center bg-slate-50 p-6 min-h-full">
                <div className="w-full max-w-5xl">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-slate-800 mb-2 font-display">Chọn cửa hàng</h2>
                        <p className="text-slate-600">Vui lòng chọn một cửa hàng để quản lý và phân công lịch làm việc cho nhân viên.</p>
                    </div>

                    {/* Search & Stats */}
                    <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="relative w-full md:w-96 group">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">search</span>
                            <input
                                type="text"
                                placeholder="Tìm theo tên hoặc mã cửa hàng..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all"
                            />
                        </div>
                        <div className="text-sm font-medium text-slate-500 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
                            Đang hiển thị <span className="text-primary font-bold">{filteredStores.length}</span> cửa hàng
                        </div>
                    </div>

                    {/* Stores Grid */}
                    {storesLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm animate-pulse">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 bg-slate-100 rounded-xl"></div>
                                        <div className="flex-1">
                                            <div className="h-4 bg-slate-100 rounded w-2/3 mb-2"></div>
                                            <div className="h-3 bg-slate-100 rounded w-1/3"></div>
                                        </div>
                                    </div>
                                    <div className="h-4 bg-slate-100 rounded w-full mb-3"></div>
                                    <div className="h-10 bg-slate-50 rounded-xl w-full"></div>
                                </div>
                            ))}
                        </div>
                    ) : filteredStores.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredStores.map(store => (
                                <div
                                    key={store.id}
                                    onClick={() => handleStoreSelect(store.id)}
                                    className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
                                >
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                            <span className="material-symbols-outlined">storefront</span>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-slate-800 leading-tight group-hover:text-primary transition-colors">{store.name}</h3>
                                            <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">{store.id}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-slate-500 text-sm mb-6 line-clamp-1">
                                        <span className="material-symbols-outlined text-[18px] opacity-70">location_on</span>
                                        {store.address}
                                    </div>

                                    <button className="w-full py-2.5 bg-slate-50 text-slate-600 font-bold text-sm rounded-xl group-hover:bg-primary group-hover:text-white transition-all flex items-center justify-center gap-2">
                                        Chọn cửa hàng
                                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white p-12 rounded-3xl border border-slate-100 shadow-sm text-center">
                            <span className="material-symbols-outlined text-5xl text-slate-200 mb-4 uppercase">search_off</span>
                            <h3 className="text-xl font-bold text-slate-700 mb-1 uppercase">Không tìm thấy cửa hàng</h3>
                            <p className="text-slate-500">Thử tìm kiếm với tên hoặc mã khác</p>
                            <button
                                onClick={() => setSearchTerm("")}
                                className="mt-4 text-primary font-bold hover:underline"
                            >
                                Xóa tìm kiếm
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

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
                {/* Banner Thông báo nếu chưa có ca làm */}
                {!loading && storeId && shiftTypes.length === 0 && (
                    <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3 text-amber-800 dark:text-amber-300">
                            <span className="material-symbols-outlined text-2xl">info</span>
                            <div className="text-sm">
                                <p className="font-bold">Cửa hàng chưa có danh mục ca làm việc</p>
                                <p className="opacity-80">Bạn cần khởi tạo các loại ca (Sáng, Chiều, Đêm) từ mẫu hệ thống để bắt đầu phân công.</p>
                            </div>
                        </div>
                        <button
                            onClick={handleInitializeTemplates}
                            disabled={isImporting}
                            className="flex items-center gap-2 px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold rounded-lg transition-all shadow-md shadow-amber-600/20 disabled:opacity-50"
                        >
                            {isImporting ? (
                                <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                            ) : (
                                <span className="material-symbols-outlined text-sm">auto_fix</span>
                            )}
                            Khởi tạo từ mẫu hệ thống
                        </button>
                    </div>
                )}

                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-6">
                    <div className="flex flex-col gap-2 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            {storeDetail && (
                                <Link to={`/store/${storeId}`} className="text-secondary hover:underline flex items-center gap-1 text-sm font-semibold whitespace-nowrap">
                                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                                    {storeDetail.name}
                                </Link>
                            )}
                            <div className="flex items-center gap-2 flex-wrap">
                                <h2 className="text-2xl font-bold tracking-tight text-primary dark:text-white whitespace-nowrap">Thống kê ca làm</h2>
                                <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs px-2 py-1 rounded font-medium border border-slate-200 dark:border-slate-700 whitespace-nowrap">
                                    {viewMode === "week" ? `Week ${getWeekNumber(currentDate)}` : viewMode === "month" ? "Month View" : "Year View"}
                                </span>
                                {storeDetail && (
                                    <span className="bg-secondary/10 text-secondary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-secondary/20 whitespace-nowrap">
                                        Store {storeDetail.code}
                                    </span>
                                )}
                                {loading && (
                                    <span className="material-symbols-outlined text-primary text-[18px] animate-spin">progress_activity</span>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
                            <span className="material-symbols-outlined text-[18px]">event</span>

                            <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                                <PopoverTrigger asChild>
                                    <button className="hover:text-primary transition-colors hover:underline font-medium whitespace-nowrap">
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
                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            onClick={() => setIsCreateShiftModalOpen(true)}
                            disabled={!storeDetail?.dbId && typeof storeId !== 'number'}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 h-10 px-5 bg-white dark:bg-slate-800 hover:bg-slate-50 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-bold rounded-lg shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 whitespace-nowrap"
                        >
                            <span className="material-symbols-outlined text-[20px]">add_circle</span>
                            Tạo ca làm mới
                        </button>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            disabled={!storeDetail?.dbId && typeof storeId !== 'number'}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 h-10 px-5 bg-primary hover:bg-primary/90 text-white text-sm font-bold rounded-lg shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 whitespace-nowrap"
                        >
                            <span className="material-symbols-outlined text-[20px]">person_add</span>
                            Phân công nhân viên
                        </button>
                    </div>
                </div>
                {/* Toolbar: Nav & Filters */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-4">
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
                <div className="flex-1 overflow-auto custom-scrollbar relative flex flex-col bg-white dark:bg-background-dark min-w-0">
                    <div className="min-w-[800px] flex flex-col flex-1">
                        {/* Sticky Header Days */}
                        <div className="sticky top-0 z-30 grid grid-cols-[60px_repeat(7,1fr)] bg-white dark:bg-background-dark border-b border-slate-200 dark:border-slate-700 shadow-sm">
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
                </div>
            ) : viewMode === "month" ? (
                /* Month View */
                <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-900 min-h-0 overflow-auto p-4 custom-scrollbar">
                    <div className="min-w-[800px] flex-1 bg-white dark:bg-background-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-full">
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
                onClose={() => setIsModalOpen(false)}
                storeId={storeDetail?.dbId || storeId}
                onAssignSuccess={loadAssignments}
            />

            <CreateShiftModal
                isOpen={isCreateShiftModalOpen}
                onClose={() => setIsCreateShiftModalOpen(false)}
                storeId={storeDetail?.dbId || storeId}
                onCreateSuccess={() => {
                    loadShiftTypes();
                    loadAssignments();
                }}
            />
        </div>
    );
};

export default StaffShiftsPage;
