import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import roleService from '../../services/role.service';
import useAuth from '../../contexts/AuthContext/useAuth';

// Helper: Nhóm permissions theo category (phần trước dấu _ cuối cùng)
const groupPermissions = (permissions) => {
    const groups = {};
    permissions.forEach((perm) => {
        const name = perm.name || perm.code || '';
        const parts = name.split('_');
        // Category = tất cả phần trước action cuối cùng (vd: STORE_MANAGER_VIEW -> STORE_MANAGER)
        const category = parts.length >= 2 ? parts.slice(0, -1).join('_') : name;
        if (!groups[category]) {
            groups[category] = [];
        }
        groups[category].push(perm);
    });
    return groups;
};

// Helper: Format tên category từ SNAKE_CASE sang Title Case
const formatCategory = (cat) => {
    const categoryMap = {
        SUPER_ADMIN: 'Quản trị tối cao',
        REGIONAL_ADMIN: 'Quản lý khu vực',
        STORE_MANAGER: 'Quản lý cửa hàng',
        STAFF: 'Nhân viên',
        PROFILE: 'Hồ sơ',
        PASSWORD: 'Mật khẩu',
        STORE_SCOPE: 'Phạm vi cửa hàng',
        REGIONAL_ADMIN_SCOPE: 'Phạm vi khu vực',
        WAREHOUSE_SCOPE: 'Phạm vi kho',
        PERMISSION: 'Quyền hạn',
        ROLE: 'Vai trò',
        USER: 'Người dùng',
        STORE: 'Cửa hàng',
        WAREHOUSE: 'Kho',
        INVENTORY: 'Tồn kho',
        PRODUCT: 'Sản phẩm',
        ORDER: 'Đơn hàng',
        REPORT: 'Báo cáo',
        SUPPLIER: 'Nhà cung cấp',
        ATTENDANCE: 'Chấm công',
        SHIFT: 'Ca làm việc',
    };

    if (categoryMap[cat]) {
        return categoryMap[cat];
    }

    return cat
        .split('_')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');
};

// Helper: Format tên permission
const formatPermissionName = (name) => {
    const parts = (name || '').split('_');
    const action = parts[parts.length - 1];
    const actionMap = {
        VIEW: 'Xem',
        CREATE: 'Tạo',
        UPDATE: 'Cập nhật',
        DELETE: 'Xóa',
        ASSIGN: 'Phân công',
        APPROVE: 'Duyệt',
        EXPORT: 'Xuất',
        IMPORT: 'Nhập',
        MANAGE: 'Quản lý',
        BLOCK: 'Khóa',
        UNBLOCK: 'Mở khóa',
        CHECKIN: 'Chấm công vào',
        CHECKOUT: 'Chấm công ra',
    };

    return actionMap[action?.toUpperCase()] || (action.charAt(0).toUpperCase() + action.slice(1).toLowerCase());
};

// Helper: Lấy mô tả permission
const getPermissionDesc = (name) => {
    const parts = (name || '').split('_');
    const action = formatPermissionName(name).toLowerCase();
    const resource = parts.slice(0, -1).join(' ').toLowerCase();
    return `Cho phép ${action} ${resource}`;
};

// Icon cho từng category
const getCategoryIcon = (cat) => {
    const iconMap = {
        PROFILE: 'person',
        PASSWORD: 'lock',
        STAFF: 'badge',
        STORE_MANAGER: 'manage_accounts',
        STORE_SCOPE: 'assignment',
        REGIONAL_ADMIN: 'supervisor_account',
        WAREHOUSE_SCOPE: 'assignment_ind',
        PERMISSION: 'admin_panel_settings',
        ROLE: 'shield_person',
        USER: 'group',
        STORE: 'storefront',
        WAREHOUSE: 'warehouse',
        INVENTORY: 'inventory',
        PRODUCT: 'inventory_2',
        ORDER: 'shopping_cart',
        REPORT: 'bar_chart',
        SUPPLIER: 'local_shipping',
    };
    return iconMap[cat] || 'settings';
};

// Role description map
const getRoleDescription = (code) => {
    const descMap = {
        SUPER_ADMIN: 'Toàn quyền truy cập vào mọi phân hệ và cấu hình hệ thống.',
        REGIONAL_ADMIN: 'Quản lý cửa hàng và kho trong khu vực được phân công.',
        STORE_MANAGER: 'Quản lý nhân sự và vận hành cửa hàng.',
        STAFF: 'Thực hiện các tác vụ cơ bản và tự phục vụ trên hệ thống.',
    };
    return descMap[code] || '';
};

const RolePermissionPage = () => {
    const { isSuperAdmin } = useAuth();
    const isCurrentUserAdmin = isSuperAdmin();
    const [roles, setRoles] = useState([]);
    const [allPermissions, setAllPermissions] = useState([]);
    const [selectedRole, setSelectedRole] = useState(null);
    const [editedPermissions, setEditedPermissions] = useState(new Set());
    const [originalPermissions, setOriginalPermissions] = useState(new Set());
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    // Fetch roles và permissions
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const [rolesRes, permsRes] = await Promise.all([
                roleService.getAllRoles(),
                roleService.getAllPermissions(),
            ]);

            const rolesData = rolesRes?.code === 200 ? rolesRes.data : [];
            const permsData = permsRes?.code === 200 ? permsRes.data : [];

            setRoles(Array.isArray(rolesData) ? rolesData : []);
            setAllPermissions(Array.isArray(permsData) ? permsData : []);

            // Auto-select first role
            if (Array.isArray(rolesData) && rolesData.length > 0 && !selectedRole) {
                selectRole(rolesData[0]);
            }
        } catch (err) {
            console.error('Error fetching roles/permissions:', err);
            setError('Không thể tải dữ liệu. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Chọn role -> load permissions của role đó
    const selectRole = (role) => {
        setSelectedRole(role);
        setSuccessMsg('');
        const permIds = new Set(
            (role.permissions || []).map((p) => p.id || p)
        );
        setEditedPermissions(new Set(permIds));
        setOriginalPermissions(new Set(permIds));
    };

    // Toggle permission
    const togglePermission = (permId) => {
        setEditedPermissions((prev) => {
            const next = new Set(prev);
            if (next.has(permId)) {
                next.delete(permId);
            } else {
                next.add(permId);
            }
            return next;
        });
    };

    // Check xem có thay đổi gì không
    const hasChanges = () => {
        if (editedPermissions.size !== originalPermissions.size) return true;
        for (const id of editedPermissions) {
            if (!originalPermissions.has(id)) return true;
        }
        return false;
    };

    // Lưu thay đổi
    const handleSave = async () => {
        if (!selectedRole || !hasChanges()) return;
        setSaving(true);
        setError('');
        setSuccessMsg('');
        try {
            const response = await roleService.updateRole(selectedRole.id, {
                name: selectedRole.name,
                description: selectedRole.description,
                permissionIds: Array.from(editedPermissions),
            });

            if (response?.code === 200) {
                setSuccessMsg('Đã lưu thay đổi thành công!');
                setOriginalPermissions(new Set(editedPermissions));
                // Refresh data
                await fetchData();
                // Re-select the role to update UI
                const updated = response.data;
                if (updated) selectRole(updated);
            } else {
                setError(response?.desc || 'Lưu thất bại');
            }
        } catch (err) {
            console.error('Error saving role:', err);
            setError(err.message || 'Lưu thất bại. Vui lòng thử lại.');
        } finally {
            setSaving(false);
        }
    };

    // Hủy thay đổi
    const handleDiscard = () => {
        setEditedPermissions(new Set(originalPermissions));
        setSuccessMsg('');
    };

    // Lọc roles theo search
    const filteredRoles = roles.filter((role) =>
        (role.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (role.code || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Nhóm permissions theo category
    // Filter out sensitive permissions (ROLE, PERMISSION) for non-SUPER_ADMIN roles
    const displayPermissions = allPermissions.filter(perm => {
        if (selectedRole?.code === 'SUPER_ADMIN') return true;
        const code = (perm.code || perm.name || '').toUpperCase();
        return !code.includes('ROLE') && !code.includes('PERMISSION');
    });

    const groupedPermissions = groupPermissions(displayPermissions);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-3">
                    <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
                    <p className="text-text-muted">Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-full gap-0 overflow-hidden">
            {/* ===== LEFT PANEL: Role List ===== */}
            <div className="w-72 flex-shrink-0 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-lg font-bold text-text-main dark:text-white">Vai trò</h2>
                    </div>
                    {/* Search */}
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-text-muted pointer-events-none">
                            <span className="material-symbols-outlined text-[18px]">search</span>
                        </span>
                        <Input
                            className="pl-9 text-sm bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-600"
                            placeholder="Tìm vai trò..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Role Cards */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                    {filteredRoles.map((role) => {
                        const isSelected = selectedRole?.id === role.id;
                        return (
                            <div
                                key={role.id}
                                onClick={() => selectRole(role)}
                                className={cn(
                                    'p-3 rounded-lg cursor-pointer border-2 transition-all duration-200',
                                    isSelected
                                        ? 'border-primary bg-primary/5 dark:bg-primary/10'
                                        : 'border-transparent bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750'
                                )}
                            >
                                {isSelected && (
                                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                                        Đang chọn
                                    </span>
                                )}
                                <div className="flex items-center justify-between mt-1">
                                    <h3 className={cn('text-sm font-semibold', isSelected ? 'text-text-main dark:text-white' : 'text-text-main dark:text-gray-200')}>
                                        {formatCategory(role.name || role.code || '')}
                                    </h3>
                                    <span className={cn(
                                        'material-symbols-outlined text-[20px]',
                                        isSelected ? 'text-primary' : 'text-text-muted'
                                    )}>
                                        shield_person
                                    </span>
                                </div>
                                <p className="text-xs text-text-muted dark:text-gray-400 mt-1 line-clamp-2">
                                    {role.description || getRoleDescription(role.code || role.name)}
                                </p>
                                <div className="flex items-center justify-between mt-2">
                                    <span className="text-xs text-text-muted dark:text-gray-400">
                                        {(role.permissions || []).length} quyền
                                    </span>
                                    {isSelected ? (
                                        <span className="text-xs font-medium text-primary">Đang dùng</span>
                                    ) : (
                                        <span className="text-xs font-medium text-primary cursor-pointer hover:underline">Quản lý</span>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    {filteredRoles.length === 0 && (
                        <div className="text-center py-8 text-text-muted">
                            <span className="material-symbols-outlined text-3xl mb-2 block">search_off</span>
                            <p className="text-sm">Không tìm thấy vai trò nào</p>
                        </div>
                    )}
                </div>
            </div>

            {/* ===== RIGHT PANEL: Permission Grid ===== */}
            <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-950 overflow-hidden">
                {selectedRole ? (
                    <>
                        {/* Header */}
                        <div className="px-6 py-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="material-symbols-outlined text-primary text-[20px]">shield_person</span>
                                        <span className="text-xs font-bold text-primary uppercase tracking-wider">Cấu hình vai trò</span>
                                    </div>
                                    <h2 className="text-xl font-bold text-text-main dark:text-white">
                                        {formatCategory(selectedRole.name || selectedRole.code || '')} quyền hạn
                                        {selectedRole?.code === 'SUPER_ADMIN' && (
                                            <span className="ml-3 px-2 py-0.5 text-[10px] bg-primary/10 text-primary border border-primary/20 rounded uppercase tracking-wider">
                                                Vai trò cố định
                                            </span>
                                        )}
                                    </h2>
                                    <p className="text-sm text-text-muted dark:text-gray-400 mt-0.5">
                                        Cấu hình những gì người dùng thuộc vai trò {formatCategory(selectedRole.name || '')} được xem và thao tác.
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    {isCurrentUserAdmin && (
                                        <>
                                            <Button
                                                variant="outline"
                                                onClick={handleDiscard}
                                                disabled={!hasChanges() || saving || selectedRole?.code === 'SUPER_ADMIN'}
                                            >
                                                Hoàn tác
                                            </Button>
                                            <Button
                                                onClick={handleSave}
                                                disabled={!hasChanges() || saving || selectedRole?.code === 'SUPER_ADMIN'}
                                                className="bg-primary hover:bg-primary/90"
                                            >
                                                {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>

                        {/* Info Messages */}
                        <div className="px-6 py-2 border-b border-gray-100 dark:border-gray-800">
                            {selectedRole?.code === 'SUPER_ADMIN' ? (
                                <div className="p-2 text-xs text-blue-600 bg-blue-50 rounded-md dark:bg-blue-900/20 dark:text-blue-400 border border-blue-100 dark:border-blue-800">
                                    <span className="font-bold uppercase mr-2">Lưu ý:</span> Vai trò Super Admin là mặc định và không thể thay đổi để đảm bảo an toàn hệ thống.
                                </div>
                            ) : !isCurrentUserAdmin ? (
                                <div className="p-2 text-xs text-amber-600 bg-amber-50 rounded-md dark:bg-amber-900/20 dark:text-amber-400 border border-amber-100 dark:border-amber-800">
                                    <span className="font-bold uppercase mr-2">Chỉ xem:</span> Chỉ Super Admin mới có quyền chỉnh sửa phân quyền.
                                </div>
                            ) : (
                                <div className="p-2 text-xs text-blue-600 bg-blue-50 rounded-md dark:bg-blue-900/20 dark:text-blue-400 border border-blue-100 dark:border-blue-800">
                                    <span className="font-bold uppercase mr-2">Gợi ý:</span> Các quyền quản lý vai trò nhạy cảm đã được ẩn để tránh sai sót.
                                </div>
                            )}
                        </div>

                        {/* Messages */}
                        {error && (
                                <div className="mt-3 p-2 text-sm text-red-600 bg-red-50 rounded-md dark:bg-red-900/20 dark:text-red-400">
                                    {error}
                                </div>
                            )}
                            {successMsg && (
                                <div className="mt-3 p-2 text-sm text-green-600 bg-green-50 rounded-md dark:bg-green-900/20 dark:text-green-400">
                                    {successMsg}
                                </div>
                            )}
                        </div>

                        {/* Permission Groups */}
                        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
                            {Object.entries(groupedPermissions).map(([category, perms]) => (
                                <div key={category}>
                                    {/* Category Header */}
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="material-symbols-outlined text-text-muted text-[22px]">
                                            {getCategoryIcon(category)}
                                        </span>
                                        <h3 className="text-sm font-bold text-text-main dark:text-white uppercase tracking-wide">
                                            {formatCategory(category)}
                                        </h3>
                                    </div>

                                    {/* Permission Cards Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                                        {perms.map((perm) => {
                                            const isChecked = editedPermissions.has(perm.id);
                                            return (
                                                <label
                                                    key={perm.id}
                                                    className={cn(
                                                        'flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-150',
                                                        isChecked
                                                            ? 'border-primary/30 bg-primary/5 dark:bg-primary/10'
                                                            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-gray-300'
                                                    )}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={isChecked}
                                                        onChange={() => togglePermission(perm.id)}
                                                        disabled={!isCurrentUserAdmin || selectedRole?.code === 'SUPER_ADMIN'}
                                                        className="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary accent-primary disabled:opacity-50 cursor-not-allowed"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-text-main dark:text-white">
                                                            {formatPermissionName(perm.name || perm.code)}
                                                        </p>
                                                        <p className="text-xs text-text-muted dark:text-gray-400 mt-0.5">
                                                            {perm.description || getPermissionDesc(perm.name || perm.code)}
                                                        </p>
                                                    </div>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-text-muted">
                        <div className="text-center">
                            <span className="material-symbols-outlined text-5xl mb-3 block">shield_person</span>
                            <p className="text-lg font-medium">Chọn một vai trò để quản lý quyền</p>
                            <p className="text-sm mt-1">Chọn vai trò ở cột bên trái để xem và chỉnh sửa quyền hạn.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RolePermissionPage;
