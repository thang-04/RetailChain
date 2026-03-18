// src/hooks/useCurrentLocation.js
// Hook để lấy vị trí GPS hiện tại của user

import { useState, useCallback } from 'react';

const useCurrentLocation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);

  const getCurrentPosition = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Trình duyệt không hỗ trợ GPS'));
        return;
      }

      setLoading(true);
      setError(null);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          setLocation({ latitude, longitude, accuracy });
          setLoading(false);
          resolve({ latitude, longitude, accuracy });
        },
        (err) => {
          let errorMessage = 'Không lấy được vị trí';
          
          switch (err.code) {
            case err.PERMISSION_DENIED:
              errorMessage = 'Bạn đã từ chối quyền truy cập vị trí. Vui lòng cho phép trong cài đặt trình duyệt.';
              break;
            case err.POSITION_UNAVAILABLE:
              errorMessage = 'Thông tin vị trí không khả dụng';
              break;
            case err.TIMEOUT:
              errorMessage = 'Hết thời gian chờ. Vui lòng thử lại.';
              break;
            default:
              errorMessage = err.message || 'Lỗi không xác định';
          }
          
          setError(errorMessage);
          setLoading(false);
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 60000
        }
      );
    }, []);
  }, []);

  const getLocation = useCallback(async () => {
    try {
      return await getCurrentPosition();
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, [getCurrentPosition]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    location,
    getLocation,
    clearError
  };
};

export default useCurrentLocation;
