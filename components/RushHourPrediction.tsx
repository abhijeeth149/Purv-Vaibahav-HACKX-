import React, { useState, useMemo } from 'react';
import { predictRushHour } from '../services/geminiService';
import type { Monument, RushPrediction } from '../types';
import { MONUMENTS } from '../constants';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { Spinner } from './common/Spinner';

interface RushHourPredictionProps {
    selectedMonument: Monument | null;
    onSelectMonument: (monument: Monument | null) => void;
}

const RushHourPredictionComponent: React.FC<RushHourPredictionProps> = ({ selectedMonument, onSelectMonument }) => {
    const [date, setDate] = useState<string>(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
    const [prediction, setPrediction] = useState<RushPrediction | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handlePredict = async () => {
        if (!selectedMonument) {
            setError("Please select a monument first.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setPrediction(null);
        try {
            const data = await predictRushHour(selectedMonument.name, date);
            setPrediction(data);
        } catch (err: any) {
            setError(err.message || "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    const resultCardStyles = useMemo(() => {
        if (!prediction) return { badge: '', background: '', icon: null, iconColor: '' };
        switch (prediction.level) {
            case 'Low':
                return {
                    badge: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
                    background: 'bg-gradient-to-br from-green-50 dark:from-green-900/50 to-emerald-100 dark:to-emerald-800/50',
                    icon: <i className="ph-fill ph-leaf text-green-500"></i>,
                };
            case 'Medium':
                return {
                    badge: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
                    background: 'bg-gradient-to-br from-yellow-50 dark:from-yellow-900/50 to-amber-100 dark:to-amber-800/50',
                    icon: <i className="ph-fill ph-hourglass-medium text-yellow-500"></i>,
                };
            case 'High':
                return {
                    badge: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
                    background: 'bg-gradient-to-br from-red-50 dark:from-red-900/50 to-rose-100 dark:to-rose-800/50',
                    icon: <i className="ph-fill ph-warning-circle text-red-500"></i>,
                };
            default:
                return {
                    badge: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
                    background: 'bg-gray-50 dark:bg-gray-800',
                    icon: null,
                };
        }
    }, [prediction]);


    return (
        <div>
            <h2 className="text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-500 dark:from-primary-400 dark:to-secondary-400 mb-6">Crowd Prediction</h2>
            
            <Card className="p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div className="flex flex-col">
                        <label className="mb-1 font-medium text-sm text-gray-700 dark:text-gray-300">Monument</label>
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
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-1 font-medium text-sm text-gray-700 dark:text-gray-300">Date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={e => setDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                           className="w-full p-2.5 border border-gray-300/80 rounded-lg bg-white/80 dark:bg-gray-700/80 dark:border-gray-600/80 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-sm"
                        />
                    </div>
                     <Button onClick={handlePredict} isLoading={isLoading} disabled={!selectedMonument || isLoading} className="w-full">
                        Predict Rush
                    </Button>
                </div>
                 {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
            </Card>

            {isLoading && (
                <div className="flex justify-center items-center h-48">
                    <Spinner size="lg" />
                </div>
            )}
            
            {prediction && (
                 <Card className={`p-8 text-center animate-fade-in ${resultCardStyles.background}`}>
                    <span className={`inline-flex items-center gap-3 px-6 py-3 rounded-full text-xl font-bold ${resultCardStyles.badge} shadow-sm`}>
                        <span className="text-3xl">{resultCardStyles.icon}</span>
                        {prediction.level} Rush
                    </span>
                    <p className="mt-6 text-gray-700 dark:text-gray-300 text-2xl">
                        Estimated Visitors: <span className="font-bold text-primary-700 dark:text-primary-300">{prediction.visitorCount}</span>
                    </p>
                    <div className="mt-6 pt-6 border-t border-gray-500/10">
                        <p className="text-gray-600 dark:text-gray-400 font-semibold flex items-center justify-center gap-2"><i className="ph-fill ph-lightbulb text-accent-500 text-xl"></i>Recommendation</p>
                        <p className="text-gray-800 dark:text-gray-200 mt-2 text-lg">{prediction.recommendation}</p>
                    </div>
                </Card>
            )}

            {!prediction && !isLoading && (
                 <div className="p-10 text-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl animate-pulse-bg dark:animate-dark-pulse-bg">
                     <i className="ph-light ph-chart-bar text-5xl text-gray-400 dark:text-gray-500 mb-2"></i>
                     <p className="text-gray-500 dark:text-gray-400 font-semibold">Prediction results will appear here.</p>
                     <p className="text-sm text-gray-400">Select a monument and date to begin.</p>
                </div>
            )}
        </div>
    );
};

export default RushHourPredictionComponent;