import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { userService } from "../../../services/user.service";
import storeService from "../../../services/store.service";
import roleService from '../../../services/role.service';

const AddStaffModal = ({ isOpen, onClose, storeId, onSuccess }) => {
    const [activeTab, setActiveTab] = useState('existing'); // 'existing' | 'create'

    // Existing Staff State
    const [staffList, setStaffList] = useState([]);
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [loadingExisting, setLoadingExisting] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSavingExisting, setIsSavingExisting] = useState(false);

    // Create New Staff State
    const [roles, setRoles] = useState([]);
    const [loadingCreate, setLoadingCreate] = useState(false);
    const [createError, setCreateError] = useState('');
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        fullName: '',
        phoneNumber: '',
        roleId: ''
    });

    useEffect(() => {
        if (isOpen) {
            // Reset states
            setActiveTab('existing');
            setSelectedIds(new Set());
            setSearchQuery("");
            setFormData({
                username: '',
                email: '',
                password: '',
                fullName: '',
                phoneNumber: '',
                roleId: ''
            });
            setCreateError('');

            // Fetch existing unassigned
            setLoadingExisting(true);
            userService.getUnassignedStaff()
                .then(res => {
                    setStaffList(res?.data || []);
                })
                .catch(err => console.error("Could not fetch unassigned staff", err))
                .finally(() => setLoadingExisting(false));

            // Fetch roles for creation
            roleService.getAllRoles()
                .then(res => {
                    const rolesData = res?.data || [];
                    const filtered = rolesData.filter(r => r.code === 'STORE_MANAGER' || r.code === 'STAFF');
                    setRoles(filtered);
                })
                .catch(err => console.error("Could not fetch roles", err));
        }
    }, [isOpen]);

    if (!isOpen) return null;

    // --- Tab: Existing ---
    const displayStaff = staffList.filter(s => {
        const search = searchQuery.toLowerCase();
        return (
            (s.fullName || "").toLowerCase().includes(search) ||
            (s.email || "").toLowerCase().includes(search) ||
            (s.username || "").toLowerCase().includes(search)
        );
    });

    const toggleSelection = (id) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setSelectedIds(newSet);
    };

    const handleAssign = async () => {
        if (selectedIds.size === 0) return;
        setIsSavingExisting(true);
        try {
            await storeService.assignStaffToStore(storeId, Array.from(selectedIds));
            if (onSuccess) onSuccess();
            else onClose();
        } catch (error) {
            console.error("Failed to assign staff", error);
            alert("Failed to assign staff. Please try again.");
        } finally {
            setIsSavingExisting(false);
        }
    };

    // --- Tab: Create ---
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRoleChange = (value) => {
        setFormData(prev => ({ ...prev, roleId: value }));
    };

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        setLoadingCreate(true);
        setCreateError('');

        try {
            if (!formData.roleId) throw new Error("Please select a role");

            const payload = {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                fullName: formData.fullName,
                phoneNumber: formData.phoneNumber,
                roleIds: [parseInt(formData.roleId)],
                storeId: storeId
            };

            await userService.createUser(payload);

            if (onSuccess) onSuccess();
            else onClose();
        } catch (err) {
            setCreateError(err.response?.data?.message || err.response?.data || err.message || 'Failed to create user');
        } finally {
            setLoadingCreate(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-[2px] p-4">
            <div className="bg-white dark:bg-[#1a1d21] w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Add Staff to Store</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Assign existing staff or create a new user profile.</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-full p-1 hover:bg-slate-100 dark:hover:bg-slate-800">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                    <button
                        onClick={() => setActiveTab('existing')}
                        className={`flex-1 py-3 text-sm font-medium transition-all ${activeTab === 'existing' ? 'text-primary border-b-2 border-primary bg-white dark:bg-[#1a1d21]' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 border-b-2 border-transparent'}`}
                    >
                        Assign Existing Unassigned Staff
                    </button>
                    <button
                        onClick={() => setActiveTab('create')}
                        className={`flex-1 py-3 text-sm font-medium transition-all ${activeTab === 'create' ? 'text-primary border-b-2 border-primary bg-white dark:bg-[#1a1d21]' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 border-b-2 border-transparent'}`}
                    >
                        Create New Staff Profile
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto min-h-0 bg-white dark:bg-[#1a1d21]">
                    {activeTab === 'existing' && (
                        <div className="flex flex-col h-full">
                            <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800 shrink-0">
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-[20px]">search</span>
                                    <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} autoFocus className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm" placeholder="Search by name, email, or username..." type="text" />
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto min-h-[300px]">
                                {loadingExisting ? (
                                    <div className="p-10 text-center text-slate-500">Loading available staff...</div>
                                ) : (
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="sticky top-0 bg-white dark:bg-[#1a1d21] border-b border-slate-100 dark:border-slate-800 z-10 shadow-sm">
                                                <th className="py-3 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 w-12">
                                                    <input
                                                        className="rounded border-slate-300 dark:border-slate-600 text-primary focus:ring-primary dark:bg-slate-800"
                                                        type="checkbox"
                                                        onChange={(e) => {
                                                            if (e.target.checked) setSelectedIds(new Set(displayStaff.map(s => s.id)));
                                                            else setSelectedIds(new Set());
                                                        }}
                                                        checked={displayStaff.length > 0 && selectedIds.size === displayStaff.length}
                                                    />
                                                </th>
                                                <th className="py-3 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Staff Member</th>
                                                <th className="py-3 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Role</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                            {displayStaff.length > 0 ? displayStaff.map((staff) => (
                                                <tr key={staff.id} onClick={() => toggleSelection(staff.id)} className="group hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer">
                                                    <td className="py-4 px-6" onClick={(e) => e.stopPropagation()}>
                                                        <input
                                                            className="rounded border-slate-300 dark:border-slate-600 text-primary focus:ring-primary dark:bg-slate-800"
                                                            type="checkbox"
                                                            checked={selectedIds.has(staff.id)}
                                                            onChange={() => toggleSelection(staff.id)}
                                                        />
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`flex items-center justify-center size-9 rounded-full text-xs font-bold shrink-0 border bg-blue-100 text-blue-700 border-blue-200`}>
                                                                {(staff.fullName || staff.username || "S").substring(0, 2).toUpperCase()}
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-slate-900 dark:text-white font-semibold text-sm">{staff.fullName || staff.username}</span>
                                                                <span className="text-slate-500 dark:text-slate-400 text-[11px]">{staff.email}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-6 text-slate-600 dark:text-slate-400 text-sm">
                                                        {(staff.roles && staff.roles.length > 0) ? staff.roles.join(', ') : 'Staff'}
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan={3} className="py-10 text-center text-slate-500">No unassigned staff found matching your criteria.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                )}
                            </div>

                            <div className="px-6 py-5 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/20 shrink-0">
                                <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">{selectedIds.size} staff member(s) selected</span>
                                <div className="flex gap-3">
                                    <button onClick={onClose} className="h-10 px-5 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700">
                                        Cancel
                                    </button>
                                    <button onClick={handleAssign} disabled={selectedIds.size === 0 || isSavingExisting} className="h-10 px-5 bg-primary hover:bg-[#1d617a] text-white text-sm font-semibold rounded-lg shadow-sm shadow-primary/30 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50">
                                        <span>{isSavingExisting ? "Assigning..." : "Assign to Store"}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'create' && (
                        <form onSubmit={handleCreateSubmit} className="flex flex-col h-full">
                            <div className="p-6 space-y-4 overflow-y-auto">
                                {createError && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-200">{createError}</div>}

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="username">Username <span className="text-red-500">*</span></Label>
                                        <Input id="username" name="username" value={formData.username} onChange={handleFormChange} required placeholder="e.g. jdoe123" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                                        <Input id="email" name="email" type="email" value={formData.email} onChange={handleFormChange} required placeholder="example@email.com" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
                                    <Input id="password" name="password" type="password" value={formData.password} onChange={handleFormChange} required minLength={6} placeholder="Min 6 characters" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="fullName">Full Name <span className="text-red-500">*</span></Label>
                                        <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleFormChange} required placeholder="John Doe" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phoneNumber">Phone Number</Label>
                                        <Input id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleFormChange} placeholder="(+1) 123 456 7890" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Role <span className="text-red-500">*</span></Label>
                                    <Select value={formData.roleId} onValueChange={handleRoleChange} required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Staff or Store Manager role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {roles.map(r => (
                                                <SelectItem key={r.id} value={r.id.toString()}>
                                                    {r.name === 'STAFF' ? 'Staff' : (r.name === 'STORE_MANAGER' ? 'Store Manager' : r.name)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="mt-auto px-6 py-5 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 bg-slate-50 dark:bg-slate-800/20 shrink-0">
                                <button type="button" onClick={onClose} className="h-10 px-5 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700">
                                    Cancel
                                </button>
                                <button type="submit" disabled={loadingCreate} className="h-10 px-5 bg-primary hover:bg-[#1d617a] text-white text-sm font-semibold rounded-lg shadow-sm shadow-primary/30 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50">
                                    <span>{loadingCreate ? "Creating..." : "Create & Assign"}</span>
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddStaffModal;
