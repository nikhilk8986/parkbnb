"use client"
import React, { useState } from 'react'
import axios from 'axios'
import { useMap } from '@/contexts/MapContext'

type Coordinate = {
    longitude: number
    latitude: number
    id?: string
    [key: string]: any
}

const SearchNearby = () => {
    const { addMarker, clearMarkers } = useMap()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSearchNearby = async () => {
        setLoading(true)
        setError('')
        
        try {
            const token = localStorage.getItem('token')
            
            // Get user's current location
            navigator.geolocation.getCurrentPosition(async (position) => {
                const userLat = position.coords.latitude
                const userLong = position.coords.longitude
                
                const response = await axios.post('/api/v1/viewnearby', 
                    { userLat, userLong },
                    {
                        headers: {
                            token: token
                        }
                    }
                )

                if (response.data && Array.isArray(response.data)) {
                    clearMarkers()
                    
                    response.data.forEach((coord: Coordinate, index: number) => {
                        addMarker({
                            id: coord.id || `marker-${index}`,
                            longitude: coord.longitude,
                            latitude: coord.latitude,
                            color: '#f59e0b',
                            popup: `Parking Lot ${index + 1}<br/>Slots: ${coord.totalSlots - coord.bookedSlots}/${coord.totalSlots}`
                        })
                    })
                }
            }, (error) => {
                setError('Please enable location services')
                console.error('Geolocation error:', error)
            })
        } catch (err) {
            console.error('Error fetching nearby locations:', err)
            setError('Failed to fetch nearby parking lots')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="mt-8 flex flex-col items-center gap-4">
            {error && (
                <div className="text-red-500 text-sm bg-red-900/20 px-4 py-2 rounded-lg border border-red-700">
                    {error}
                </div>
            )}
            <button
                onClick={handleSearchNearby}
                disabled={loading}
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {loading ? 'Searching...' : 'View Nearby Parking'}
            </button>
        </div>
    )
}

export default SearchNearby
