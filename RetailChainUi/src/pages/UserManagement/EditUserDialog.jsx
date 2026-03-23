import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

import { userService } from '../../services/user.service';
import roleService from '../../services/role.service';
import storeService from '../../services/store.service';
import useAuth from '../../contexts/AuthContext/useAuth';


const EditUserDialog = ({ isOpen, onClose, onSuccess, userToEdit }) => {

    const { isSuperAdmin, isStoreManager } = useAuth();

    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        roleId: '',
        storeId: ''
    });

    const [roles, setRoles] = useState([]);
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');



    useEffect(() => {
        if (isOpen && userToEdit) {
            fetchData();
            // Find roleId for the user's primary role
            let currentRoleId = '';
            if (userToEdit.roles && userToEdit.roles.length > 0) {
                // We'll map the role string to ID after roles are fetched
            }

            setFormData({
                fullName: userToEdit.fullName || '',
                phoneNumber: userToEdit.phoneNumber || '',
                roleId: '', // Will be set after roles fetch
                storeId: userToEdit.storeId ? userToEdit.storeId.toString() : ''
            });
            setError('');
        }
    }, [isOpen, userToEdit]);

    const fetchData = async () => {
        try {
            const rolesRes = await roleService.getAllRoles();
            const rolesData = rolesRes.data || [];

            // Filter roles based on current user's authority
            let filteredRoles = [];
            if (isSuperAdmin()) {
                // SuperAdmin can manage both Store Managers and Staff
                filteredRoles = rolesData.filter(r => r.code === 'STORE_MANAGER' || r.code === 'STAFF');
            } else if (isStoreManager()) {
                // Store Manager can only manage Staff
                filteredRoles = rolesData.filter(r => r.code === 'STAFF');
            }
            setRoles(filteredRoles);

            // Match user's role to fetch ID
            if (userToEdit?.roles?.[0]) {
                const matchingRole = rolesData.find(r => r.name === userToEdit.roles[0] || r.code === userToEdit.roles[0]);
                if (matchingRole) {
                    setFormData(prev => ({ ...prev, roleId: matchingRole.id.toString() }));
                }
            }

            const storesRes = await storeService.getAllStores();
            setStores(storesRes);
        } catch (err) {
            console.error('Failed to load form data:', err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const selectedRole = roles.find(r => r.id.toString() === formData.roleId);

            const payload = {
                fullName: formData.fullName,
                phoneNumber: formData.phoneNumber,
                roleIds: formData.roleId ? [parseInt(formData.roleId)] : undefined
            };

            // Apply scope based on selected role
            if (selectedRole?.code === 'STORE_MANAGER' || selectedRole?.code === 'STAFF') {
                payload.storeId = formData.storeId ? parseInt(formData.storeId) : null;
            }

            await userService.updateUser(userToEdit.id, payload);
            onSuccess();
            onClose();
        } catch (err) {
            setError(err.response?.data || err.message || 'Không thể cập nhật người dùng');
        } finally {
            setLoading(false);
        }
    };

    const selectedRoleObj = roles.find(r => r.id.toString() === formData.roleId);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] sm:max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Chỉnh sửa người dùng: {userToEdit?.username}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    {error && <div className="text-red-500 text-sm bg-red-50 p-2 rounded">{error}</div>}

                    <div className="space-y-2">
                        <Label htmlFor="fullName">Họ và tên <span className="text-red-500">*</span></Label>
                        <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phoneNumber">Số điện thoại</Label>
                        <Input id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
                    </div>

                    <div className="space-y-2">
                        <Label>Vai trò <span className="text-red-500">*</span></Label>
                        <Select value={formData.roleId} onValueChange={(val) => handleSelectChange('roleId', val)} required>
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn vai trò" />
                            </SelectTrigger>
                            <SelectContent>
                                {roles.map(r => (
                                    <SelectItem key={r.id} value={r.id.toString()}>{r.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>



                    {(selectedRoleObj?.code === 'STORE_MANAGER' || selectedRoleObj?.code === 'STAFF') && (
                        <div className="space-y-2">
                            <Label>Gán cửa hàng</Label>
                            <Select value={formData.storeId} onValueChange={(val) => handleSelectChange('storeId', val)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn cửa hàng" />
                                </SelectTrigger>
                                <SelectContent>
                                    {stores.map(s => (
                                        <SelectItem key={s.dbId || s.id} value={(s.dbId || s.id).toString()}>{s.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    <DialogFooter className="mt-6">
                        <Button type="button" variant="outline" onClick={onClose}>Hủy</Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditUserDialog;
