"use client"
import React, { useState } from 'react'
import Map from '@/components/Map';

const AddStation = () => {
    const [clickedCoords, setClickedCoords] = useState<{
        lat: number;
        lng: number;
    } | null>(null);
    const [totalSlots, setTotalSlots] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleMapClick = (lat: number, lng: number) => {
        setClickedCoords({ lat, lng });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!clickedCoords) {
            setMessage('Please click on the map to select a location');
            return;
        }
        
        if (!totalSlots || totalSlots <= 0) {
            setMessage('Please enter a valid number of slots');
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setMessage('Not authenticated. Please sign in first.');
                setLoading(false);
                return;
            }

            const response = await fetch('/api/v1/addstation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'token': token
                },
                body: JSON.stringify({
                    parkingId: `parking-${Date.now()}`,
                    latitude: clickedCoords.lat,
                    longitude: clickedCoords.lng,
                    totalSlots: totalSlots
                })
            });

            const data = await response.json();
            
            if (response.ok) {
                setMessage(`Success! Parking lot added with ID: ${data.lotId}`);
                setClickedCoords(null);
                setTotalSlots(0);
            } else {
                setMessage(data.message || 'Failed to add parking lot');
            }
        } catch (error) {
            setMessage('Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-8">Add Parking Station</h1>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Map Section */}
                        <div className="lg:col-span-2">
                            <div className="rounded-xl overflow-hidden shadow-lg border border-slate-800 h-96">
                                <Map 
                                    latitude={22.57} 
                                    longitude={88.36}
                                    onCoordinatesClick={handleMapClick}
                                />
                            </div>
                        </div>

                        {/* Form Section */}
                        <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 h-fit">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-white text-sm font-medium mb-2">
                                        Total Parking Slots
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={totalSlots || ''}
                                        onChange={(e) => setTotalSlots(parseInt(e.target.value) || 0)}
                                        className="w-full px-4 py-2 bg-slate-800 text-white border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500"
                                        placeholder="Enter number of slots"
                                    />
                                </div>

                                <div className="bg-slate-800 rounded p-3">
                                    <p className="text-sm text-slate-300 font-medium">Selected Location:</p>
                                    {clickedCoords ? (
                                        <>
                                            <p className="text-white text-sm">
                                                Lat: {clickedCoords.lat.toFixed(4)}
                                            </p>
                                            <p className="text-white text-sm">
                                                Lng: {clickedCoords.lng.toFixed(4)}
                                            </p>
                                        </>
                                    ) : (
                                        <p className="text-slate-400 text-sm">Click on map to select</p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 text-white font-medium py-2 rounded-lg transition"
                                >
                                    {loading ? 'Adding...' : 'Add Parking Station'}
                                </button>

                                {message && (
                                    <div className={`p-3 rounded text-sm ${
                                        message.includes('Success') 
                                            ? 'bg-green-900 text-green-200' 
                                            : 'bg-red-900 text-red-200'
                                    }`}>
                                        {message}
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
        </div>
    );
};

export default AddStation;