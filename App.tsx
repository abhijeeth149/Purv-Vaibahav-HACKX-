import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import MonumentRecognition from './components/MonumentRecognition';
import MonumentInformation from './components/MonumentInformation';
import RushHourPrediction from './components/RushHourPrediction';
import NearbyMonuments from './components/NearbyMonuments';
import AiChatbot from './components/AiChatbot';
import { TABS } from './constants';
import type { Tab, Monument } from './types';
import { MONUMENTS } from './constants';

const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab['id']>('recognize');
    const [darkMode, setDarkMode] = useState<boolean>(() => {
        return localStorage.getItem('darkMode') === 'true';
    });
    const [selectedMonument, setSelectedMonument] = useState<Monument | null>(MONUMENTS[0]);
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
    const [dynamicBackground, setDynamicBackground] = useState<string | null>(null);


    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('darkMode', 'true');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('darkMode', 'false');
        }
    }, [darkMode]);

    const handleTabChange = useCallback((tabId: Tab['id']) => {
        setActiveTab(tabId);
        setIsSidebarOpen(false);
    }, []);

    const handleSelectMonument = useCallback((monument: Monument | null) => {
        setSelectedMonument(monument);
        if (monument) {
             setDynamicBackground(`https://source.unsplash.com/1920x1080/?${encodeURIComponent(monument.name)}`);
            setActiveTab('info');
        } else {
            setDynamicBackground(null);
        }
         setIsSidebarOpen(false);
    }, []);
    
    const handleRecognitionSuccess = useCallback((monumentName: string) => {
        const foundMonument = MONUMENTS.find(m => m.name.toLowerCase() === monumentName.toLowerCase());
        let newOrFoundMonument: Monument;
        if(foundMonument) {
            newOrFoundMonument = foundMonument;
        } else {
            // A new monument not in our list
            newOrFoundMonument = { id: Date.now(), name: monumentName, latitude: 0, longitude: 0, category: 'Historic' };
        }
        setSelectedMonument(newOrFoundMonument);
        setDynamicBackground(`https://source.unsplash.com/1920x1080/?${encodeURIComponent(newOrFoundMonument.name)}`);
        setActiveTab('info');
    }, []);

    const renderContent = useMemo(() => {
        switch (activeTab) {
            case 'recognize':
                return <MonumentRecognition onRecognitionSuccess={handleRecognitionSuccess} />;
            case 'info':
                return <MonumentInformation selectedMonument={selectedMonument} onSelectMonument={handleSelectMonument} />;
            case 'rush':
                return <RushHourPrediction selectedMonument={selectedMonument} onSelectMonument={handleSelectMonument} />;
            case 'nearby':
                return <NearbyMonuments onSelectMonument={handleSelectMonument} />;
            case 'chat':
                return <AiChatbot currentMonument={selectedMonument} />;
            default:
                return <MonumentRecognition onRecognitionSuccess={handleRecognitionSuccess}/>;
        }
    }, [activeTab, selectedMonument, handleRecognitionSuccess, handleSelectMonument]);

    return (
        <div className="h-screen font-sans text-gray-800 dark:text-gray-200 bg-transparent">
            {dynamicBackground && (
                 <div className="fixed inset-0 z-[-1] transition-opacity duration-1000 ease-in-out animate-fade-in">
                    <div 
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${dynamicBackground})` }}
                    />
                    <div className="absolute inset-0 bg-black/50 dark:bg-black/60"></div>
                </div>
            )}
            <div className="flex h-screen w-full">
                <Sidebar 
                    activeTab={activeTab} 
                    onTabChange={handleTabChange} 
                    darkMode={darkMode} 
                    setDarkMode={setDarkMode} 
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                />
                <main className="flex-1 overflow-y-auto transition-all duration-300 lg:ml-64">
                    <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden fixed top-4 left-4 z-40 p-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-full text-gray-800 dark:text-gray-200 shadow-md">
                        <i className="ph-bold ph-list text-2xl"></i>
                    </button>
                    <div key={activeTab} className="p-4 sm:p-6 lg:p-8 animate-slide-in-up">
                        <div className="max-w-7xl mx-auto">
                            {renderContent}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default App;