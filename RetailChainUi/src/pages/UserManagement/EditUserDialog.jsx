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

const EditUserDialog = ({ isOpen, onClose, onSuccess, userToEdit }) => {
    const { user: currentUser } = useAuth();

    const [formData, setFormData] = useState({
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
                region: userToEdit.region || '',
                warehouseId: userToEdit.warehouseId ? userToEdit.warehouseId.toString() : '',
                storeId: userToEdit.storeId ? userToEdit.storeId.toString() : ''
            });
            setError('');
        }
    }, [isOpen, userToEdit]);

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

            // Match user's role to fetch ID
            if (userToEdit?.roles?.[0]) {
                const matchingRole = rolesData.find(r => r.name === userToEdit.roles[0] || r.code === userToEdit.roles[0]);
                if (matchingRole) {
                    setFormData(prev => ({ ...prev, roleId: matchingRole.id.toString() }));
                }
            }

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
                fullName: formData.fullName,
                phoneNumber: formData.phoneNumber,
                roleIds: formData.roleId ? [parseInt(formData.roleId)] : undefined
            };

            // Apply scope based on selected role
            if (selectedRole?.code === 'REGIONAL_ADMIN') {
                payload.region = formData.region || null;
                payload.storeId = null;
            } else if (selectedRole?.code === 'STORE_MANAGER' || selectedRole?.code === 'STAFF') {
                payload.storeId = formData.storeId ? parseInt(formData.storeId) : null;
                payload.region = null;
            }

            await userService.updateUser(userToEdit.id, payload);
            onSuccess();
            onClose();
        } catch (err) {
            setError(err.response?.data || err.message || 'Failed to update user');
        } finally {
            setLoading(false);
        }
    };

    const selectedRoleObj = roles.find(r => r.id.toString() === formData.roleId);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] sm:max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit User: {userToEdit?.username}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    {error && <div className="text-red-500 text-sm bg-red-50 p-2 rounded">{error}</div>}

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
                            <Label>Region</Label>
                            <Select value={formData.region} onValueChange={(val) => handleSelectChange('region', val)}>
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

                    {(selectedRoleObj?.code === 'STORE_MANAGER' || selectedRoleObj?.code === 'STAFF') && (
                        <div className="space-y-2">
                            <Label>Assign Store</Label>
                            <Select value={formData.storeId} onValueChange={(val) => handleSelectChange('storeId', val)}>
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
                            {loading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditUserDialog;
