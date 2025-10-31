import React, { useState, useEffect, useCallback } from 'react';
import { getMonumentInfo } from '../services/geminiService';
import type { Monument, MonumentInfo } from '../types';
import { MONUMENTS } from '../constants';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { Spinner } from './common/Spinner';

interface AccordionSectionProps {
    title: string;
    icon: string;
    children: React.ReactNode;
}

const AccordionSection: React.FC<AccordionSectionProps> = ({ title, icon, children }) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <div className="border-b border-gray-200/80 dark:border-gray-700/60 last:border-b-0">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center py-4 text-left">
                <h4 className="font-bold text-lg flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <i className={`ph-fill ${icon} text-primary-500 text-2xl`}></i>
                    {title}
                </h4>
                <i className={`ph-bold ph-caret-down text-xl transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}></i>
            </button>
            <div className={`overflow-hidden transition-all duration-500 ${isOpen ? 'max-h-screen' : 'max-h-0'}`}>
                <div className="pb-4 text-gray-600 dark:text-gray-400 prose prose-sm dark:prose-invert max-w-none">
                    {children}
                </div>
            </div>
        </div>
    )
}

interface MonumentInformationProps {
    selectedMonument: Monument | null;
    onSelectMonument: (monument: Monument | null) => void;
}

const MonumentInformation: React.FC<MonumentInformationProps> = ({ selectedMonument, onSelectMonument }) => {
    const [info, setInfo] = useState<MonumentInfo | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

    const fetchInfo = useCallback(async (monumentName: string) => {
        setIsLoading(true);
        setError(null);
        setInfo(null);
        try {
            const data = await getMonumentInfo(monumentName);
            setInfo(data);
        } catch (err: any) {
            setError(err.message || "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (selectedMonument) {
            fetchInfo(selectedMonument.name);
        } else {
            setInfo(null);
            setError(null);
        }
    }, [selectedMonument, fetchInfo]);

    const handleTextToSpeech = () => {
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
            return;
        }
        if (!info || !selectedMonument) return;

        const textToRead = `
            Information about ${selectedMonument.name}.
            Summary: ${info.summary}.
            Architecture: ${info.architecture}.
            Visitor Guidelines: ${info.guidelines}.
            Preservation Precautions: ${info.precautions}.
        `;
        
        const utterance = new SpeechSynthesisUtterance(textToRead);
        utterance.lang = 'en-IN';
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
    };
    
    useEffect(() => {
        // Cleanup speech synthesis on component unmount
        return () => {
            window.speechSynthesis.cancel();
        }
    }, []);

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                 <h2 className="text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-500 dark:from-primary-400 dark:to-secondary-400 mb-2 sm:mb-0">Monument Information</h2>
                <div className="w-full sm:w-64">
                    <select
                        value={selectedMonument?.id || ''}
                        onChange={(e) => {
                            const monument = MONUMENTS.find(m => m.id === parseInt(e.target.value)) || null;
                            onSelectMonument(monument);
                        }}
                        className="w-full p-2.5 border border-gray-300 rounded-lg bg-white/80 dark:bg-gray-700/80 dark:border-gray-600/80 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-sm"
                    >
                        <option value="" disabled>Select a monument</option>
                        {MONUMENTS.map(m => (
                            <option key={m.id} value={m.id}>{m.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {isLoading && (
                <div className="flex justify-center items-center h-96">
                    <Spinner size="lg" />
                </div>
            )}
            
            {error && !isLoading &&(
                <Card className="p-8 text-center text-red-500 bg-red-500/10">
                    <i className="ph-bold ph-warning-circle text-5xl mb-2"></i>
                    <p className="font-semibold">{error}</p>
                    <Button onClick={() => selectedMonument && fetchInfo(selectedMonument.name)} className="mt-4">
                        Try Again
                    </Button>
                </Card>
            )}
            
            {!selectedMonument && !isLoading && !error && (
                 <div className="p-10 text-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl">
                     <i className="ph-light ph-book-open-text text-6xl text-gray-400 dark:text-gray-500 mb-2"></i>
                     <p className="text-lg font-semibold text-gray-600 dark:text-gray-400">Select a Monument</p>
                     <p className="text-gray-500 dark:text-gray-500">Choose a monument from the dropdown to see its details.</p>
                </div>
            )}

            {info && selectedMonument && !isLoading && (
                <Card className="overflow-hidden animate-fade-in">
                    <div className="relative h-64 bg-cover bg-center" style={{backgroundImage: `url(https://picsum.photos/seed/${selectedMonument.id}/1200/400)`}}>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-6 flex justify-between items-end w-full">
                             <h3 className="text-4xl font-bold font-display text-white shadow-2xl">{selectedMonument.name}</h3>
                             <Button onClick={handleTextToSpeech} variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-sm">
                                <i className={`ph-bold text-xl ${isSpeaking ? 'ph-speaker-slash' : 'ph-speaker-high'}`}></i>
                            </Button>
                        </div>
                    </div>
                    <div className="p-6">
                        <AccordionSection title="Summary" icon="ph-book-open-text">
                            <p>{info.summary}</p>
                        </AccordionSection>
                        <AccordionSection title="Architecture" icon="ph-paint-brush-household">
                             <p>{info.architecture}</p>
                        </AccordionSection>
                        <AccordionSection title="Key Facts" icon="ph-list-checks">
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {info.keyFacts.map((fact, index) => (
                                    <div key={index} className="bg-primary-500/10 dark:bg-primary-400/10 p-3 rounded-lg">
                                        <p className="font-semibold text-sm text-primary-800 dark:text-primary-200">{fact.label}</p>
                                        <p className="text-gray-700 dark:text-gray-300">{fact.value}</p>
                                    </div>
                                ))}
                            </div>
                        </AccordionSection>
                         <AccordionSection title="Visitor Guidelines" icon="ph-warning">
                            <p>{info.guidelines}</p>
                        </AccordionSection>
                        <AccordionSection title="Preservation Precautions" icon="ph-shield-check">
                            <p>{info.precautions}</p>
                        </AccordionSection>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default MonumentInformation;