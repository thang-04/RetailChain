import React, { useState, useEffect } from 'react';
import { userService } from '../../services/user.service';
import roleService from '../../services/role.service';
import storeService from '../../services/store.service';


// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

// Icons
import { Search, Plus, Edit2, ShieldAlert, ShieldCheck } from 'lucide-react';

import CreateUserDialog from './CreateUserDialog';
import EditUserDialog from './EditUserDialog';
import ConfirmModal from '@/components/ui/confirmModal';

const UserManagementPage = () => {


    // State for data
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    // State for dialogs
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState(null);

    // State for confirmation modal
    const [confirmConfig, setConfirmConfig] = useState({
        isOpen: false,
        userId: null,
        userFullName: '',
        isBlocking: true
    });

    // Fetch users on mount
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await userService.getAllUsers();
            setUsers(response.data || []);
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('Không thể tải danh sách người dùng');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleBlock = (user) => {
        setConfirmConfig({
            isOpen: true,
            userId: user.id,
            userFullName: user.fullName || user.username,
            isBlocking: user.status === 1
        });
    };

    const executeToggleBlock = async () => {
        const { userId } = confirmConfig;
        try {
            await userService.toggleBlock(userId);
            setConfirmConfig(prev => ({ ...prev, isOpen: false }));
            fetchUsers();
        } catch (err) {
            console.error('Error toggling block status:', err);
            setError('Không thể cập nhật trạng thái người dùng');
        }
    };



    const formatRole = (roleString) => {
        if (!roleString) return 'Không xác định';
        return roleString.split('_').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');
    };

    const filteredUsers = users.filter(u =>
        u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.username?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Quản lý người dùng</h1>
                    <p className="text-muted-foreground">
                        Quản lý tài khoản cấp dưới và phạm vi truy cập của họ.
                    </p>
                </div>
                <Button onClick={() => setIsCreateOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Tạo người dùng
                </Button>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Tìm người dùng theo tên hoặc email..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Thông tin người dùng</TableHead>
                            <TableHead>Vai trò</TableHead>
                            <TableHead>Phạm vi</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead className="text-right">Thao tác</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    Đang tải danh sách người dùng...
                                </TableCell>
                            </TableRow>
                        ) : filteredUsers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    Không tìm thấy người dùng trong phạm vi quản lý.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredUsers.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{user.fullName || user.username}</span>
                                            <span className="text-sm text-muted-foreground">{user.email}</span>
                                            <span className="text-xs text-muted-foreground">{user.phoneNumber}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {user.roles?.map(role => (
                                                <Badge key={role} variant="secondary">
                                                    {formatRole(role)}
                                                </Badge>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1 text-sm">
                                            {user.storeId && (
                                                <span className="text-muted-foreground">Cửa hàng: <span className="text-foreground font-medium">{user.storeId}</span></span>
                                            )}
                                            {!user.storeId && (
                                                <span className="text-muted-foreground italic">Toàn hệ thống</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={user.status === 1 ? 'default' : 'destructive'}>
                                            {user.status === 1 ? 'Hoạt động' : 'Bị khóa'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                title="Chỉnh sửa người dùng"
                                                onClick={() => {
                                                    setUserToEdit(user);
                                                    setIsEditOpen(true);
                                                }}
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </Button>

                                            <Button
                                                variant={user.status === 1 ? "outline" : "default"}
                                                size="icon"
                                                title={user.status === 1 ? "Khóa người dùng" : "Mở khóa người dùng"}
                                                onClick={() => handleToggleBlock(user)}
                                                className={user.status === 1 ? "text-red-500 hover:text-red-600 hover:bg-red-50" : "bg-green-600 hover:bg-green-700"}
                                            >
                                                {user.status === 1 ? <ShieldAlert className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <CreateUserDialog
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onSuccess={fetchUsers}
            />

            <EditUserDialog
                isOpen={isEditOpen}
                onClose={() => {
                    setIsEditOpen(false);
                    setUserToEdit(null);
                }}
                onSuccess={fetchUsers}
                userToEdit={userToEdit}
            />

            <ConfirmModal
                isOpen={confirmConfig.isOpen}
                onClose={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))}
                onConfirm={executeToggleBlock}
                title={confirmConfig.isBlocking ? "Khóa người dùng" : "Mở khóa người dùng"}
                message={
                    confirmConfig.isBlocking
                        ? `Bạn có chắc chắn muốn khóa người dùng "${confirmConfig.userFullName}" không? Người dùng này sẽ không thể đăng nhập vào hệ thống.`
                        : `Bạn có chắc chắn muốn mở khóa cho người dùng "${confirmConfig.userFullName}" không?`
                }
                confirmText={confirmConfig.isBlocking ? "Khóa" : "Mở khóa"}
                variant={confirmConfig.isBlocking ? "danger" : "success"}
            />
        </div>
    );
};

export default UserManagementPage;
