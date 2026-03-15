import { axiosPrivate } from './api/axiosClient';

const USER_API_URL = '/user';

export const userService = {
    /**
     * Get all users (filtered by backend based on role)
     */
    getAllUsers: async () => {
        return await axiosPrivate.get(USER_API_URL);
    },

    /**
     * Get unassigned staff
     */
    getUnassignedStaff: async () => {
        return await axiosPrivate.get(`${USER_API_URL}/unassigned-staff`);
    },

    /**
     * Get user by ID
     */
    getUserById: async (id) => {
        return await axiosPrivate.get(`${USER_API_URL}/${id}`);
    },

    /**
     * Create a new user
     * @param {Object} userData - { username, email, password, fullName, phone, roleIds, region, warehouseId, storeId }
     */
    createUser: async (userData) => {
        return await axiosPrivate.post(USER_API_URL, userData);
    },

    /**
     * Update an existing user
     * @param {number} id - User ID
     * @param {Object} userData - { fullName, phoneNumber, roleIds, region, warehouseId, storeId }
     */
    updateUser: async (id, userData) => {
        return await axiosPrivate.put(`${USER_API_URL}/${id}`, userData);
    },

    /**
     * Delete a user
     */
    deleteUser: async (id) => {
        return await axiosPrivate.delete(`${USER_API_URL}/${id}`);
    },

    /**
     * Toggle block status of a user
     */
    toggleBlock: async (id) => {
        return await axiosPrivate.patch(`${USER_API_URL}/${id}/block`);
    }
};
