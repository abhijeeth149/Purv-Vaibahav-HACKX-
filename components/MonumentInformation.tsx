import React, { useState, useEffect } from 'react';
import { getMonumentInfo } from '../services/geminiService';
import type { Monument, MonumentInfo } from '../types';
import { MONUMENTS } from '../constants';
import { Card } from './common/Card';
import { Spinner } from './common/Spinner';

interface MonumentInformationProps {
    selectedMonument: Monument | null;
    onSelectMonument: (monument: Monument | null) => void;
}

const MonumentInformation: React.FC<MonumentInformationProps> = ({ selectedMonument, onSelectMonument }) => {
    const [monumentDetails, setMonumentDetails] = useState<Omit<MonumentInfo, keyof Monument> | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (selectedMonument) {
            const fetchInfo = async () => {
                setIsLoading(true);
                setError(null);
                setMonumentDetails(null);
                try {
                    const details = await getMonumentInfo(selectedMonument.name);
                    setMonumentDetails(details);
                } catch (err: any) {
                    setError(err.message || 'Failed to load details.');
                } finally {
                    setIsLoading(false);
                }
            };
            fetchInfo();
        }
    }, [selectedMonument]);

    const InfoSection: React.FC<{ title: string; content?: string; icon: string }> = ({ title, content, icon }) => (
        <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 flex items-center">
                <i className={`ph-bold ${icon} mr-2 text-primary-500`}></i>
                {title}
            </h3>
            {isLoading ? (
                <div className="space-y-2">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full animate-pulse"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6 animate-pulse"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
                </div>
            ) : (
                <p className="text-gray-600 dark:text-gray-400 leading- relaxed whitespace-pre-wrap">{content}</p>
            )}
        </div>
    );

    return (
        <div>
            <h2 className="text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-500 dark:from-primary-400 dark:to-secondary-400 mb-6">Monument Information</h2>
            
            <Card className="p-6 mb-6">
                 <label className="mb-1 font-medium text-sm text-gray-700 dark:text-gray-300">Select a Monument</label>
                 <select
                    value={selectedMonument?.id || ''}
                    onChange={(e) => {
                        const monument = MONUMENTS.find(m => m.id === parseInt(e.target.value)) || null;
                        onSelectMonument(monument);
                    }}
                    className="w-full p-2.5 border border-gray-300/80 rounded-lg bg-white/80 dark:bg-gray-700/80 dark:border-gray-600/80 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-sm"
                >
                    <option value="" disabled>Select a monument</option>
                    {MONUMENTS.map(m => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                </select>
            </Card>

            {selectedMonument && (
                <Card>
                    <div className="relative">
                        <img 
                            src={`https://source.unsplash.com/1200x400/?${encodeURIComponent(selectedMonument.name)}`} 
                            alt={selectedMonument.name}
                            className="w-full h-64 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-6">
                             <h2 className="text-3xl font-bold text-white shadow-lg">{selectedMonument.name}</h2>
                             <p className="text-lg text-gray-200 shadow-sm">{selectedMonument.category}</p>
                        </div>
                    </div>
                   
                    <div className="p-6">
                        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                        
                        <InfoSection title="About" content={monumentDetails?.description} icon="ph-book-open-text" />
                        <InfoSection title="History" content={monumentDetails?.history} icon="ph-scroll" />
                        <InfoSection title="Best Time to Visit" content={monumentDetails?.bestTimeToVisit} icon="ph-calendar-check" />
                        <InfoSection title="Entry Fees" content={monumentDetails?.entryFee} icon="ph-ticket" />
                    </div>
                </Card>
            )}

            {!selectedMonument && !isLoading && (
                 <div className="p-10 text-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl">
                     <i className="ph-light ph-magnifying-glass text-6xl text-gray-400 dark:text-gray-500 mb-2"></i>
                     <p className="text-lg font-semibold text-gray-600 dark:text-gray-400">No Monument Selected</p>
                     <p className="text-gray-500 dark:text-gray-500">Please select a monument from the list above or identify one.</p>
                </div>
            )}
        </div>
    );
};

export default MonumentInformation;