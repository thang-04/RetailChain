// src/services/attendance.service.js
// Service cho chức năng chấm công (Attendance)

import { axiosPrivate } from './api/axiosClient';

const attendanceService = {
  /**
   * Check-in với GPS
   * @param {number} latitude
   * @param {number} longitude
   * @param {string} note
   */
  checkin: async (latitude, longitude, note = '') => {
    const response = await axiosPrivate.post('/attendance/checkin', {
      latitude,
      longitude,
      note
    });
    return response;
  },

  /**
   * Check-out với GPS
   * @param {number} latitude
   * @param {number} longitude
   * @param {string} note
   */
  checkout: async (latitude, longitude, note = '') => {
    const response = await axiosPrivate.post('/attendance/checkout', {
      latitude,
      longitude,
      note
    });
    return response;
  },

  /**
   * Lấy lịch sử chấm công của user hiện tại
   * @param {string} from - Format: yyyy-MM-dd
   * @param {string} to - Format: yyyy-MM-dd
   * @param {number} page
   * @param {number} limit
   */
  getMyHistory: async (from, to, page = 0, limit = 30) => {
    const response = await axiosPrivate.get('/attendance/my-history', {
      params: { from, to, page, limit }
    });
    return response;
  },

  /**
   * Lấy lịch sử chấm công của một user (Manager/Admin)
   * @param {number} userId
   * @param {number} storeId
   * @param {string} from
   * @param {string} to
   */
  getUserHistory: async (userId, storeId, from, to) => {
    const response = await axiosPrivate.get(`/attendance/user/${userId}`, {
      params: { storeId, from, to }
    });
    return response;
  },

  /**
   * Lấy attendance của store theo ngày
   * @param {number} storeId
   * @param {string} date - Format: yyyy-MM-dd
   * @param {string} status - Filter theo status (ONTIME, LATE, EARLY_LEAVE, FORGOT)
   */
  getStoreAttendance: async (storeId, date, status = '') => {
    const response = await axiosPrivate.get(`/attendance/store/${storeId}`, {
      params: { date, status }
    });
    return response;
  },

  /**
   * Lấy dashboard attendance của store
   * @param {number} storeId
   * @param {string} date - Format: yyyy-MM-dd
   */
  getDashboard: async (storeId, date) => {
    const response = await axiosPrivate.get(`/attendance/dashboard/${storeId}`, {
      params: { date }
    });
    return response;
  },

  /**
   * Lấy dashboard tất cả các store (Admin)
   * @param {string} region
   */
  getAllDashboard: async (region = '') => {
    const response = await axiosPrivate.get('/attendance/dashboard/all', {
      params: { region }
    });
    return response;
  },

  /**
   * Chỉnh sửa attendance thủ công (Manager/Admin)
   * @param {number} id - ID của attendance record
   * @param {string} newCheckInTime - Format: HH:mm
   * @param {string} newCheckOutTime - Format: HH:mm
   * @param {string} reason - Lý do chỉnh sửa
   */
  editAttendance: async (id, newCheckInTime, newCheckOutTime, reason) => {
    const response = await axiosPrivate.put(`/attendance/${id}/edit`, {
      newCheckInTime,
      newCheckOutTime,
      reason
    });
    return response;
  },

  /**
   * Tạo attendance thủ công (Manager/Admin)
   * @param {number} userId
   * @param {number} latitude
   * @param {number} longitude
   * @param {string} note
   */
  createManualAttendance: async (userId, latitude, longitude, note = '') => {
    const response = await axiosPrivate.post('/attendance/manual', {
      userId,
      latitude,
      longitude,
      note
    }, {
      params: { userId }
    });
    return response;
  }
};

export default attendanceService;
