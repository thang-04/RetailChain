// src/services/shift.service.js
// API service cho chức năng quản lý ca làm việc (Shift)

import { axiosPublic } from './api/axiosClient';

const shiftService = {
    // ==================== SHIFT CRUD ====================

    /**
     * Lấy tất cả ca làm
     */
    getAllShifts: async () => {
        const response = await axiosPublic.get('/shifts');
        return response;
    },

    /**
     * Lấy ca làm theo cửa hàng
     * @param {number} storeId
     */
    getShiftsByStore: async (storeId) => {
        const response = await axiosPublic.get(`/shifts/store/${storeId}`);
        return response;
    },

    /**
     * Tạo ca làm mới
     * @param {{ storeId: number, name: string, startTime: string, endTime: string }} data
     */
    createShift: async (data) => {
        const response = await axiosPublic.post('/shifts', data);
        return response;
    },

    // ==================== SHIFT ASSIGNMENT ====================

    /**
     * Phân công ca cho nhân viên
     * @param {{ shiftId: number, userId: number, workDate: string, createdBy: number }} data
     */
    assignShift: async (data) => {
        const response = await axiosPublic.post('/shifts/assign', data);
        return response;
    },

    /**
     * Hủy phân công ca
     * @param {number} assignmentId
     */
    cancelAssignment: async (assignmentId) => {
        const response = await axiosPublic.put(`/shifts/assign/${assignmentId}/cancel`);
        return response;
    },

    /**
     * Lấy danh sách phân công theo cửa hàng và khoảng thời gian
     * @param {number} storeId
     * @param {string} from - Format: yyyy-MM-dd
     * @param {string} to - Format: yyyy-MM-dd
     */
    getAssignments: async (storeId, from, to) => {
        const response = await axiosPublic.get('/shifts/assignments', {
            params: { storeId, from, to }
        });
        return response;
    },

    /**
     * Lấy danh sách phân công theo user
     * @param {number} userId
     */
    getAssignmentsByUser: async (userId) => {
        const response = await axiosPublic.get(`/shifts/assignments/user/${userId}`);
        return response;
    }
};

export default shiftService;
