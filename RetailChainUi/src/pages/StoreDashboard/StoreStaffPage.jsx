import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import storeService from "../../services/store.service";
import AddStaffModal from "./components/AddStaffModal";
import StaffDetailModal from "./components/StaffDetailModal";

const StoreStaffPage = () => {
    const { id } = useParams();
    const [staffList, setStaffList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [storeDbId, setStoreDbId] = useState(null);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [modalMode, setModalMode] = useState('view'); // 'view' | 'update'

    // Filter states
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedRole, setSelectedRole] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("All");

    const getRoleLabel = (role) => {
        const roleMap = {
            STAFF: 'Nhân viên',
            STORE_MANAGER: 'Quản lý cửa hàng',
        };

        return roleMap[role] || role;
    };

    const getStatusLabel = (status) => {
        const statusMap = {
            All: 'Tất cả',
            Active: 'Đang làm việc',
            "On Leave": 'Tạm nghỉ',
            Inactive: 'Ngừng hoạt động',
        };

        return statusMap[status] || status;
    };

    const fetchStaff = async () => {
        setLoading(true);
        try {
            const data = await storeService.getStoreById(id);
            setStaffList(data.staff || []);
            setStoreDbId(data.dbId || data.id); // capture DB numeric ID
        } catch (error) {
            console.error("Failed to fetch staff list:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStaff();
    }, [id]);

    const uniqueRoles = [...new Set(staffList.map(staff => staff.role).filter(Boolean))];

    const openModal = (staff, mode) => {
        setSelectedStaff(staff);
        setModalMode(mode);
    };

    const handleSave = async (updatedStaff) => {
        const statusMap = {
            "Active": 1,
            "Inactive": 0,
            "On Leave": 2
        };

        // Sao lưu list cũ để rollback nếu lỗi
        const originalList = [...staffList];

        // Optimistic Update: Cập nhật UI ngay lập tức
        setStaffList(prev => prev.map(s => {
            if (s.id === updatedStaff.id) {
                // Ta cần tính toán lại màu sắc dựa trên status mới để đồng bộ với logic backend
                const isStatus1 = updatedStaff.status === "Active";
                const isStatus2 = updatedStaff.status === "On Leave";
                
                return { 
                    ...s, 
                    status: updatedStaff.status,
                    statusColor: isStatus1 ? "text-emerald-700 bg-emerald-50" : (isStatus2 ? "text-amber-700 bg-amber-50" : "text-red-700 bg-red-50"),
                    dotColor: isStatus1 ? "bg-emerald-500" : (isStatus2 ? "bg-amber-500" : "bg-red-500")
                };
            }
            return s;
        }));

        try {
            await storeService.updateStaffStatus(updatedStaff.id, {
                status: statusMap[updatedStaff.status] ?? 1
            });
            // Không cần gọi fetchStaff() làm reload cả list, dữ liệu UI đã khớp với backend
        } catch (error) {
            console.error("Lưu thông tin nhân viên thất bại:", error);
            setStaffList(originalList); // Rollback
            alert("Không thể cập nhật trạng thái nhân viên.");
        }
    };

    if (loading) {
        return <div className="p-10 text-center">Đang tải dữ liệu nhân viên...</div>;
    }

    // Filter logic
    const filteredStaff = staffList.filter(staff => {
        const matchesSearch = staff.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            staff.email?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = selectedRole === "" || typeof staff.role === "string" && staff.role === selectedRole;
        const matchesStatus = selectedStatus === "All" || staff.status === selectedStatus;

        return matchesSearch && matchesRole && matchesStatus;
    });

    return (
        <div className="max-w-[1200px] mx-auto flex flex-col gap-6 font-display text-slate-900 dark:text-white antialiased">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-sm">
                <a className="text-slate-500 hover:text-primary transition-colors font-medium" href={`/store/${id}`}>Cửa hàng {id}</a>
                <span className="text-slate-300 material-symbols-outlined text-[16px]">chevron_right</span>
                <span className="text-slate-900 dark:text-white font-medium">Quản lý nhân viên</span>
            </div>

            {/* Page Heading & Actions */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight">Nhân sự cửa hàng</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Quản lý vai trò, quyền truy cập và lịch làm việc của nhân viên.</p>
                </div>
                <Button
                    onClick={() => setIsAddModalOpen(true)}
                    className="group flex items-center justify-center gap-2 h-10 px-5 bg-primary hover:bg-[#1d617a] text-white text-sm font-semibold rounded-lg shadow-sm shadow-primary/30 transition-all active:scale-95"
                >
                    <span className="material-symbols-outlined text-[20px]">add</span>
                    <span>Thêm nhân sự</span>
                </Button>
            </div>

            {/* Content Card */}
            <div className="flex flex-col bg-white dark:bg-[#1a1d21] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                {/* Filters Toolbar */}
                <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
                    {/* Search & Role Filter */}
                    <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                        <div className="relative w-full sm:w-72">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-[20px]">search</span>
                            <input
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                placeholder="Tìm nhân viên theo tên hoặc email..."
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="relative w-full sm:w-48">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-[20px]">filter_list</span>
                            <select
                                className="w-full pl-10 pr-8 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none cursor-pointer transition-all"
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value)}
                            >
                                <option value="">Tất cả vai trò</option>
                                {uniqueRoles.map(role => (
                                    <option key={role} value={role}>{getRoleLabel(role)}</option>
                                ))}
                            </select>
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-[20px] pointer-events-none">expand_more</span>
                        </div>
                    </div>
                    {/* Status Chips */}
                    <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 lg:pb-0">
                        {['All', 'Active', 'On Leave', 'Inactive'].map(status => (
                            <button
                                key={status}
                                onClick={() => setSelectedStatus(status)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${selectedStatus === status
                                    ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white'
                                    : 'border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-medium hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-900 dark:hover:text-slate-200'
                                    }`}
                            >
                                {selectedStatus === status && <span className="material-symbols-outlined text-[16px]">check_circle</span>}
                                {getStatusLabel(status)}
                            </button>
                        ))}
                    </div>
                </div>
                {/* Data Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                                <th className="py-4 px-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 w-12">#</th>
                                <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 w-[35%]">Nhân viên</th>
                                <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 w-[15%]">Vai trò</th>
                                <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 w-[25%]">Email</th>
                                <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 w-[15%]">Trạng thái</th>
                                <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 w-[10%] text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {filteredStaff.length > 0 ? (
                                filteredStaff.map((staff, index) => (
                                    <tr
                                        key={staff.id}
                                        onClick={() => openModal(staff, 'view')}
                                        className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-100 dark:border-slate-800/50 cursor-pointer"
                                    >
                                        <td className="py-4 px-4 text-slate-400 text-sm">{index + 1}</td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-4">
                                                {staff.image ? (
                                                    <div className="size-10 rounded-full bg-cover bg-center shrink-0 border border-slate-100 dark:border-slate-700" style={{ backgroundImage: `url("${staff.image}")` }}></div>
                                                ) : (
                                                    <div className={`flex items-center justify-center size-10 rounded-full text-sm font-bold shrink-0 border ${staff.initialsColor}`}>{staff.initials}</div>
                                                )}
                                                <span className="text-slate-900 dark:text-white font-semibold">{staff.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="inline-flex items-center px-2.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium">
                                                {getRoleLabel(staff.role)}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-slate-500 dark:text-slate-400 text-xs">
                                            {staff.email || '—'}
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${staff.statusColor}`}>
                                                <span className={`size-1.5 rounded-full ${staff.dotColor}`}></span>
                                                {getStatusLabel(staff.status)}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openModal(staff, 'update');
                                                }}
                                                className="text-slate-400 hover:text-primary p-2 rounded-lg hover:bg-primary/10 transition-colors"
                                                title="Cập nhật trạng thái"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">edit</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center text-slate-500 dark:text-slate-400">
                                        Không tìm thấy nhân viên nào
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Pagination */}
                <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Hiển thị <span className="font-semibold text-slate-900 dark:text-white">{filteredStaff.length > 0 ? 1 : 0}-{filteredStaff.length}</span> trên tổng <span className="font-semibold text-slate-900 dark:text-white">{staffList.length}</span> nhân sự</p>
                    <div className="flex gap-2">
                        <button className="flex items-center justify-center px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" disabled="">
                            Trước
                        </button>
                        <button className="flex items-center justify-center px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                            Sau
                        </button>
                    </div>
                </div>
            </div>

            <AddStaffModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                storeId={storeDbId || id}
                onSuccess={() => {
                    setIsAddModalOpen(false);
                    fetchStaff();
                }}
            />

            <StaffDetailModal
                staff={selectedStaff}
                mode={modalMode}
                onClose={() => setSelectedStaff(null)}
                onSave={handleSave}
            />
        </div>
    );
};

export default StoreStaffPage;
