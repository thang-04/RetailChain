import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

import { userService } from '../../services/user.service';
import roleService from '../../services/role.service';
import storeService from '../../services/store.service';
import useAuth from '../../hooks/useAuth';

const CreateUserDialog = ({ isOpen, onClose, onSuccess }) => {
    const { user: currentUser } = useAuth();

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        fullName: '',
        phoneNumber: '',
        roleId: '',
        region: '',
        warehouseId: '',
        storeId: ''
    });

    const [roles, setRoles] = useState([]);
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const isSuperAdmin = currentUser?.roles?.some(r => typeof r === 'string' ? r === 'SUPER_ADMIN' : r.code === 'SUPER_ADMIN');
    const isRegionalAdmin = currentUser?.roles?.some(r => typeof r === 'string' ? r === 'REGIONAL_ADMIN' : r.code === 'REGIONAL_ADMIN');
    const isStoreManager = currentUser?.roles?.some(r => typeof r === 'string' ? r === 'STORE_MANAGER' : r.code === 'STORE_MANAGER');

    useEffect(() => {
        if (isOpen) {
            fetchData();
            // Reset form
            setFormData({
                username: '',
                email: '',
                password: '',
                fullName: '',
                phoneNumber: '',
                roleId: '',
                region: '',
                warehouseId: '',
                storeId: ''
            });
            setError('');
        }
    }, [isOpen]);

    const fetchData = async () => {
        try {
            const rolesRes = await roleService.getAllRoles();
            const rolesData = rolesRes.data || [];

            // Filter roles based on creator's hierarchy
            let allowedRoles = [];
            if (isSuperAdmin) {
                allowedRoles = rolesData.filter(r => r.code !== 'SUPER_ADMIN');
            } else if (isRegionalAdmin) {
                allowedRoles = rolesData.filter(r => ['STORE_MANAGER', 'STAFF'].includes(r.code));
            } else if (isStoreManager) {
                allowedRoles = rolesData.filter(r => r.code === 'STAFF');
            }
            setRoles(allowedRoles);

            if (isSuperAdmin || isRegionalAdmin) {
                const storesRes = await storeService.getAllStores();
                setStores(storesRes);
            }
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
                username: formData.username,
                email: formData.email,
                password: formData.password,
                fullName: formData.fullName,
                phoneNumber: formData.phoneNumber,
                roleIds: [parseInt(formData.roleId)]
            };

            // Apply scope based on selected role
            if (selectedRole?.code === 'REGIONAL_ADMIN') {
                if (!formData.region) {
                    throw new Error('Region is required for Regional Admin');
                }
                payload.region = formData.region;
                // Optionally add warehouseId if requested via form
            } else if (selectedRole?.code === 'STORE_MANAGER') {
                if (!formData.storeId) {
                    throw new Error('Store is required for Store Manager');
                }
                payload.storeId = parseInt(formData.storeId);
            } // STAFF auto-inherits storeId from manager in backend

            await userService.createUser(payload);
            onSuccess();
            onClose();
        } catch (err) {
            setError(err.response?.data || err.message || 'Failed to create user');
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
                        <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
                        <Input id="password" name="password" type="password" value={formData.password} onChange={handleChange} required minLength={6} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name <span className="text-red-500">*</span></Label>
                        <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phoneNumber">Phone Number</Label>
                        <Input id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
                    </div>

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

                    {/* Conditional Scope Fields */}
                    {selectedRoleObj?.code === 'REGIONAL_ADMIN' && (
                        <div className="space-y-2">
                            <Label>Region <span className="text-red-500">*</span></Label>
                            <Select value={formData.region} onValueChange={(val) => handleSelectChange('region', val)} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select region" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="NORTH">Miền Bắc</SelectItem>
                                    <SelectItem value="CENTRAL">Miền Trung</SelectItem>
                                    <SelectItem value="SOUTH">Miền Nam</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {selectedRoleObj?.code === 'STORE_MANAGER' && (
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
