import { axiosPrivate } from './api/axiosClient';

const roleService = {
    // Lấy danh sách tất cả roles
    getAllRoles: async () => {
        return axiosPrivate.get('/roles');
    },

    // Lấy chi tiết role theo ID
    getRoleById: async (id) => {
        return axiosPrivate.get(`/roles/${id}`);
    },

    // Tạo role mới
    createRole: async (data) => {
        return axiosPrivate.post('/roles', data);
    },

    // Cập nhật role
    updateRole: async (id, data) => {
        return axiosPrivate.put(`/roles/${id}`, data);
    },

    // Xóa role
    deleteRole: async (id) => {
        return axiosPrivate.delete(`/roles/${id}`);
    },

    // Lấy danh sách tất cả permissions
    getAllPermissions: async () => {
        return axiosPrivate.get('/permissions');
    },
};

export default roleService;
