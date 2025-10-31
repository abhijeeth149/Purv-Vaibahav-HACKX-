import React, { useState, useEffect, useMemo } from 'react';
import type { Monument } from '../types';
import { MONUMENTS } from '../constants';
import { calculateDistance } from '../utils/location';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { Spinner } from './common/Spinner';

interface NearbyMonumentsProps {
    onSelectMonument: (monument: Monument) => void;
}

interface MonumentWithDistance extends Monument {
    distance: number;
}

const NearbyMonuments: React.FC<NearbyMonumentsProps> = ({ onSelectMonument }) => {
    const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
    const [radius, setRadius] = useState<number>(50);
    const [nearbyMonuments, setNearbyMonuments] = useState<MonumentWithDistance[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<'distance' | 'name'>('distance');

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setUserLocation({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude,
                });
                setIsLoading(false);
            },
            (err) => {
                setError("Could not get location. Please enable location services.");
                setIsLoading(false);
            }
        );
    }, []);

    const findMonuments = () => {
        if (!userLocation) {
            setError("Location not available.");
            return;
        }
        const found = MONUMENTS.map(monument => ({
            ...monument,
            distance: calculateDistance(userLocation.lat, userLocation.lon, monument.latitude, monument.longitude),
        }))
        .filter(monument => monument.distance <= radius)
        .sort((a, b) => (sortBy === 'distance' ? a.distance - b.distance : a.name.localeCompare(b.name)));

        setNearbyMonuments(found);
    };
    
    useEffect(() => {
        if(userLocation) {
            findMonuments();
        }
         // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userLocation, radius, sortBy]);

    return (
        <div>
            <h2 className="text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-500 dark:from-primary-400 dark:to-secondary-400 mb-6">Nearby Monuments</h2>

            <Card className="p-6 mb-6">
                 <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <div className="flex-1 w-full">
                        <label htmlFor="radius" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Search Radius: <span className="font-bold text-primary-600 dark:text-primary-400">{radius} km</span>
                        </label>
                        <input
                            id="radius"
                            type="range"
                            min="10"
                            max="1000"
                            step="10"
                            value={radius}
                            onChange={(e) => setRadius(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                        />
                    </div>
                     <div className="flex-1 w-full sm:max-w-xs">
                        <label htmlFor="sort" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Sort by</label>
                        <select
                            id="sort"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as 'distance' | 'name')}
                            className="w-full p-2.5 border border-gray-300/80 rounded-lg bg-white/80 dark:bg-gray-700/80 dark:border-gray-600/80 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-sm"
                        >
                            <option value="distance">Distance</option>
                            <option value="name">Name (A-Z)</option>
                        </select>
                    </div>
                 </div>
                 {error && <p className="text-red-500 text-center mt-4">{error}</p>}
            </Card>

            {isLoading && (
                <div className="flex justify-center items-center h-64">
                    <Spinner size="lg" />
                </div>
            )}
            
            {!isLoading && nearbyMonuments.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {nearbyMonuments.map(monument => (
                        <Card key={monument.id} className="group" onClick={() => onSelectMonument(monument)}>
                           <div className="overflow-hidden">
                             <img src={`https://picsum.photos/seed/${monument.id}/400/300`} alt={monument.name} className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-110" />
                           </div>
                            <div className="p-4">
                                <h3 className="font-bold text-lg text-gray-800 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition">{monument.name}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{monument.category}</p>
                                <p className="text-sm font-semibold mt-2 text-primary-700 dark:text-primary-300">{monument.distance.toFixed(1)} km away</p>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
            
            {!isLoading && nearbyMonuments.length === 0 && (
                <div className="p-10 text-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl">
                     <i className="ph-light ph-map-trifold text-6xl text-gray-400 dark:text-gray-500 mb-2"></i>
                     <p className="text-lg font-semibold text-gray-600 dark:text-gray-400">No Monuments Found</p>
                     <p className="text-gray-500 dark:text-gray-500">Try increasing the search radius to discover more heritage sites.</p>
                </div>
            )}
        </div>
    );
};

export default NearbyMonuments;