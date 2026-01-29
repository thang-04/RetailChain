import { useState } from 'react';

const useGeoLocation = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Search coordinates from location name (Geocoding)
    const searchLocation = async (query) => {
        if (!query.trim()) return null;
        
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`);
            const data = await response.json();
            
            if (data && data.length > 0) {
                const { lat, lon, display_name } = data[0];
                return {
                    lat: parseFloat(lat),
                    lng: parseFloat(lon),
                    displayName: display_name
                };
            }
            return null;
        } catch (err) {
            console.error("Geocoding failed:", err);
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Get address from coordinates (Reverse Geocoding)
    const getAddressFromCoords = async (lat, lng) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            const data = await response.json();
            
            if (data && data.display_name) {
                return data.display_name;
            }
            return `Location: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        } catch (err) {
            console.error("Reverse geocoding failed:", err);
            setError(err.message);
            return `Location: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        searchLocation,
        getAddressFromCoords
    };
};

export default useGeoLocation;
