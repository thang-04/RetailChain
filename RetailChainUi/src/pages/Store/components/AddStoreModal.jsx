import React, { useState } from 'react';
import LocationPicker from '../../../components/ui/LocationPicker';
import useGeoLocation from '../../../hooks/useGeoLocation';

const AddStoreModal = ({ isOpen, onClose }) => {
    const [address, setAddress] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [mapPosition, setMapPosition] = useState(null);
    const { loading, searchLocation, getAddressFromCoords } = useGeoLocation();

    const handleSearch = async (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            const result = await searchLocation(searchQuery);
            if (result) {
                setMapPosition({ lat: result.lat, lng: result.lng });
                setAddress(result.displayName);
            }
        }
    };

    // Reverse geocoding to get address from coordinates
    const handleLocationSelect = async (latlng) => {
        console.log(`Fetching address for: ${latlng.lat.toFixed(6)}, ${latlng.lng.toFixed(6)}...`);
        const displayAddress = await getAddressFromCoords(latlng.lat, latlng.lng);
        setAddress(displayAddress);
    };

    if (!isOpen) return null;

    return (
        <div aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8" role="dialog">
            <div aria-hidden="true" className="absolute inset-0 bg-[#131c1f]/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            <div className="relative w-full max-w-6xl transform overflow-hidden rounded-2xl bg-white dark:bg-[#1e282c] text-left shadow-lift transition-all flex flex-col h-[85vh]">
                <div className="flex items-center justify-between border-b border-[#f1f3f4] dark:border-gray-700 px-8 py-4 bg-white dark:bg-[#1e282c] shrink-0">
                    <div>
                        <h3 className="text-xl font-bold leading-6 text-[#121617] dark:text-white tracking-tight">Add New Store Location</h3>
                        <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">Search for a location on the map to begin.</p>
                    </div>
                    <button
                        className="rounded-full p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-500 transition-colors"
                        type="button"
                        onClick={onClose}
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                <div className="flex flex-1 overflow-hidden">
                    <div className="relative flex-1 bg-gray-50 dark:bg-[#131c1f] overflow-hidden">
                        <div className="absolute top-6 left-6 right-6 z-10 pointer-events-none">
                            <div className="relative max-w-lg pointer-events-auto">
                                <input
                                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border-none bg-white dark:bg-[#1e282c] shadow-xl text-sm focus:ring-2 focus:ring-primary dark:text-white placeholder:text-gray-400"
                                    placeholder="Search location (Press Enter)..."
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={handleSearch}
                                />
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary font-bold">search</span>
                            </div>
                        </div>
                        <div className="w-full h-full relative z-0">
                            <LocationPicker
                                onLocationSelect={handleLocationSelect}
                                initialPosition={mapPosition}
                            />
                        </div>
                    </div>
                    <div className="w-full max-w-[400px] border-l border-[#f1f3f4] dark:border-gray-700 bg-white dark:bg-[#1e282c] flex flex-col">
                        <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Location Details</h4>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-[#121617] dark:text-gray-200" htmlFor="address">
                                            Full Address
                                        </label>
                                        <div className="relative group">
                                            <textarea
                                                className="block w-full rounded-lg border-[#dde2e4] dark:border-gray-600 bg-gray-50 dark:bg-[#131c1f] px-4 py-3 text-sm text-[#121617] dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-primary shadow-inner resize-none cursor-default"
                                                id="address"
                                                name="address"
                                                readOnly
                                                rows="3"
                                                value={address}
                                            ></textarea>
                                        </div>
                                        <p className="text-[11px] text-gray-500 italic">Adjust map pin to update address</p>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-[#121617] dark:text-gray-200" htmlFor="store-name">
                                            Store Display Name
                                        </label>
                                        <input autoFocus className="block w-full rounded-lg border-[#dde2e4] dark:border-gray-600 bg-white dark:bg-[#131c1f] px-4 py-3 text-sm text-[#121617] dark:text-white focus:border-primary focus:ring-primary" id="store-name" name="store-name" placeholder="e.g., Downtown Flagship" type="text" />
                                    </div>
                                </div>
                                <div className="h-px bg-[#f1f3f4] dark:bg-gray-700"></div>
                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Operations</h4>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-[#121617] dark:text-gray-200" htmlFor="warehouse">
                                            Assigned Warehouse
                                        </label>
                                        <div className="relative">
                                            <select className="block w-full appearance-none rounded-lg border-[#dde2e4] dark:border-gray-600 bg-white dark:bg-[#131c1f] px-4 py-3 pr-10 text-sm text-[#121617] dark:text-white focus:border-primary focus:ring-primary" id="warehouse" name="warehouse">
                                                <option>Northwest Distribution</option>
                                                <option>California Hub</option>
                                                <option>East Coast Center</option>
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                                                <span className="material-symbols-outlined text-[20px]">expand_more</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-[#121617] dark:text-gray-200" htmlFor="status">
                                            Operational Status
                                        </label>
                                        <div className="relative">
                                            <select className="block w-full appearance-none rounded-lg border-[#dde2e4] dark:border-gray-600 bg-white dark:bg-[#131c1f] pl-9 pr-10 py-3 text-sm text-[#121617] dark:text-white focus:border-primary focus:ring-primary" id="status" name="status" defaultValue="active">
                                                <option value="active">Active</option>
                                                <option value="inactive">Inactive</option>
                                                <option value="setup">Setup Phase</option>
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
                                            </div>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                                                <span className="material-symbols-outlined text-[20px]">expand_more</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="rounded-xl bg-blue-50 dark:bg-blue-900/20 p-4 border border-blue-100 dark:border-blue-800">
                                    <div className="flex gap-3">
                                        <span className="material-symbols-outlined text-blue-500 text-[20px] shrink-0">info</span>
                                        <p className="text-xs leading-relaxed text-blue-700 dark:text-blue-300 font-medium">Coordinate-based geofencing will be applied automatically for this location's inventory syncing.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-[#f9fafa] dark:bg-[#182124] px-8 py-6 border-t border-[#f1f3f4] dark:border-gray-700 flex flex-col gap-3">
                            <button className="inline-flex w-full justify-center items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-[#1d5e74] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all" type="button">
                                <span className="material-symbols-outlined text-[18px]">save</span>
                                Save Store Location
                            </button>
                            <button
                                className="inline-flex w-full justify-center items-center rounded-xl bg-white dark:bg-transparent px-6 py-3.5 text-sm font-semibold text-gray-700 dark:text-gray-300 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                                type="button"
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddStoreModal;
