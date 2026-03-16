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


const CreateUserDialog = ({ isOpen, onClose, onSuccess }) => {

    const { isSuperAdmin, isStoreManager } = useAuth();

    const [formData, setFormData] = useState({
        username: '',
        email: '',
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
        if (isOpen) {
            fetchData();
            // Reset form
            setFormData({
                username: '',
                email: '',
                fullName: '',
                phoneNumber: '',
                roleId: '',
                storeId: ''
            });
            setError('');
        }
    }, [isOpen]);

    const fetchData = async () => {
        try {
            const rolesRes = await roleService.getAllRoles();
            const rolesData = rolesRes.data || [];

            let filteredRoles = [];
            if (isSuperAdmin()) {
                filteredRoles = rolesData.filter(r => r.code === 'STORE_MANAGER' || r.code === 'STAFF');
            } else if (isStoreManager()) {
                filteredRoles = rolesData.filter(r => r.code === 'STAFF');
            }
            setRoles(filteredRoles);

            // Auto-select if only one role
            if (filteredRoles.length === 1) {
                setFormData(prev => ({ ...prev, roleId: filteredRoles[0].id.toString() }));
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
            const payload = {
                username: formData.username,
                email: formData.email,
                fullName: formData.fullName,
                phoneNumber: formData.phoneNumber,
            };

            const selectedRole = roles.find(r => r.id.toString() === formData.roleId);
            if (!selectedRole) {
                throw new Error('Please select a valid role');
            }
            payload.roleIds = [parseInt(formData.roleId)];

            if (isSuperAdmin()) {
                if (selectedRole.code === 'STORE_MANAGER' || selectedRole.code === 'STAFF') {
                    if (!formData.storeId) {
                        throw new Error('Store is required');
                    }
                    payload.storeId = parseInt(formData.storeId);
                }
            }
            // For StoreManager, backend will automatically assign their storeId if not provided
            // or we could explicitly send it if we had it in the form.

            await userService.createUser(payload);
            onSuccess();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data || err.message || 'Failed to create user');
        } finally {
            setLoading(false);
        }
    };

    const selectedRoleObj = roles.find(r => r.id.toString() === formData.roleId);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] sm:max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create New User</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    {error && <div className="text-red-500 text-sm bg-red-50 p-2 rounded">{error}</div>}

                    <div className="space-y-2">
                        <Label htmlFor="username">Username <span className="text-red-500">*</span></Label>
                        <Input id="username" name="username" value={formData.username} onChange={handleChange} required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                        <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name <span className="text-red-500">*</span></Label>
                        <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phoneNumber">Phone Number</Label>
                        <Input id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
                    </div>

                    {isSuperAdmin() && (
                        <div className="space-y-2">
                            <Label>Role <span className="text-red-500">*</span></Label>
                            <Select value={formData.roleId} onValueChange={(val) => handleSelectChange('roleId', val)} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    {roles.map(r => (
                                        <SelectItem key={r.id} value={r.id.toString()}>{r.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}


                    {isSuperAdmin() && (selectedRoleObj?.code === 'STORE_MANAGER' || selectedRoleObj?.code === 'STAFF') && (
                        <div className="space-y-2">
                            <Label>Assign Store <span className="text-red-500">*</span></Label>
                            <Select value={formData.storeId} onValueChange={(val) => handleSelectChange('storeId', val)} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a store" />
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
                        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Creating...' : 'Create User'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateUserDialog;
