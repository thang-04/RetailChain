import React, { useState, useEffect } from 'react';
import { userService } from '../../services/user.service';
import roleService from '../../services/role.service';
import storeService from '../../services/store.service';
import useAuth from '../../hooks/useAuth';

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

const UserManagementPage = () => {
    const { user: currentUser } = useAuth();

    // State for data
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    // State for dialogs
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState(null);

    // Fetch users on mount
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await userService.getAllUsers();
            // Filter out the current user from the list
            const otherUsers = response.data?.filter(u => u.id !== currentUser?.id) || [];
            setUsers(otherUsers);
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleBlock = async (userId, currentStatus) => {
        try {
            await userService.toggleBlock(userId);
            fetchUsers(); // Refresh the list
        } catch (err) {
            console.error('Error toggling block status:', err);
            alert('Failed to update user status');
        }
    };

    const isSuperAdmin = currentUser?.roles?.some(r => {
        const roleName = typeof r === 'string' ? r : (r.name || r.code);
        return roleName === 'SUPER_ADMIN';
    });

    const formatRole = (roleString) => {
        if (!roleString) return 'Unknown';
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
                    <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
                    <p className="text-muted-foreground">
                        Manage your subordinate accounts and their scopes.
                    </p>
                </div>
                <Button onClick={() => setIsCreateOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create User
                </Button>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search users by name or email..."
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
                            <TableHead>User Info</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Scope</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    Loading users...
                                </TableCell>
                            </TableRow>
                        ) : filteredUsers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    No users found in your scope.
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
                                            {user.region && (
                                                <span className="text-muted-foreground">Region: <span className="text-foreground font-medium">{user.region}</span></span>
                                            )}
                                            {user.warehouseId && (
                                                <span className="text-muted-foreground">Warehouse ID: <span className="text-foreground font-medium">{user.warehouseId}</span></span>
                                            )}
                                            {user.storeId && (
                                                <span className="text-muted-foreground">Store ID: <span className="text-foreground font-medium">{user.storeId}</span></span>
                                            )}
                                            {!user.region && !user.warehouseId && !user.storeId && (
                                                <span className="text-muted-foreground italic">Global Access</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={user.status === 1 ? 'default' : 'destructive'}>
                                            {user.status === 1 ? 'Active' : 'Blocked'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                title="Edit User"
                                                onClick={() => {
                                                    setUserToEdit(user);
                                                    setIsEditOpen(true);
                                                }}
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </Button>

                                            {isSuperAdmin && (
                                                <Button
                                                    variant={user.status === 1 ? "outline" : "default"}
                                                    size="icon"
                                                    title={user.status === 1 ? "Block User" : "Unblock User"}
                                                    onClick={() => handleToggleBlock(user.id, user.status)}
                                                    className={user.status === 1 ? "text-red-500 hover:text-red-600 hover:bg-red-50" : "bg-green-600 hover:bg-green-700"}
                                                >
                                                    {user.status === 1 ? <ShieldAlert className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
                                                </Button>
                                            )}
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
        </div>
    );
};

export default UserManagementPage;
