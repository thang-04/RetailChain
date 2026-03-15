import React, { useState, useMemo, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom component to handle click events and update marker
const LocationMarker = ({ position, setPosition, onLocationSelect }) => {
    const map = useMapEvents({
        click(e) {
            const newPos = e.latlng;
            setPosition(newPos);
            if (onLocationSelect) {
                onLocationSelect(newPos);
            }
            map.flyTo(newPos, map.getZoom());
        },
    });

    // Keep map screen centered on position update if needed (optional)
    useEffect(() => {
        if (position) {
            map.flyTo(position, map.getZoom());
        }
    }, [position, map]);

    return position === null ? null : (
        <Marker position={position} icon={customIcon} draggable={true} eventHandlers={{
            dragend: (e) => {
                const marker = e.target;
                const position = marker.getLatLng();
                setPosition(position);
                if (onLocationSelect) {
                    onLocationSelect(position);
                }
            }
        }}>
        </Marker>
    );
};

// Custom Icon to match the design 
const customIcon = new L.DivIcon({
    className: 'custom-pin',
    html: `
    <div class="relative flex items-center justify-center translate-x-[-50%] translate-y-[-100%]">
        <div class="absolute size-12 bg-red-500/20 rounded-full animate-pulse top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
        <span class="material-symbols-outlined text-red-600 text-5xl drop-shadow-md select-none" style="font-variation-settings: 'FILL' 1">location_on</span>
    </div>
  `,
    iconSize: [0, 0],
    iconAnchor: [0, 0]
});

const LocationPicker = ({ onLocationSelect, initialPosition }) => {
    // Default position: Hanoi 
    const defaultPosition = { lat: 21.013368, lng: 105.526911 };
    const [position, setPosition] = useState(initialPosition || defaultPosition);

    useEffect(() => {
        if (initialPosition) {
            setPosition(initialPosition);
        }
    }, [initialPosition]);

    return (
        <div className="w-full h-full relative z-0">
            <MapContainer
                center={initialPosition || defaultPosition}
                zoom={15}
                scrollWheelZoom={true}
                style={{ height: "100%", width: "100%", zIndex: 0 }}
                zoomControl={false}
            >
                {/* Google Maps Tile Layer - Standard Roadmap */}
                <TileLayer
                    url="http://mt0.google.com/vt/lyrs=m&hl=vi&x={x}&y={y}&z={z}"
                    attribution='&copy; <a href="https://www.google.com/maps">Google Maps</a>'
                    maxZoom={20}
                    subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                />

                <LocationMarker
                    position={position}
                    setPosition={setPosition}
                    onLocationSelect={onLocationSelect}
                />
            </MapContainer>

            {/* Overlay hint */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[400] bg-card/95 border border-border px-3 py-1.5 rounded-full shadow-sm pointer-events-none">
                <p className="text-xs font-medium text-gray-600 dark:text-gray-300 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">touch_app</span>
                    Click map to pin location
                </p>
            </div>
        </div>
    );
};

export default LocationPicker;
