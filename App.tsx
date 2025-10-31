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

const WELCOME_BACKGROUND_IMAGE = "data:image/jpeg;base64,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";

const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab['id']>('recognize');
    const [darkMode, setDarkMode] = useState<boolean>(() => {
        return localStorage.getItem('darkMode') === 'true';
    });
    const [selectedMonument, setSelectedMonument] = useState<Monument | null>(MONUMENTS[0]);
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
    const [dynamicBackground, setDynamicBackground] = useState<string | null>(WELCOME_BACKGROUND_IMAGE);
    
    const isWelcomeScreen = dynamicBackground === WELCOME_BACKGROUND_IMAGE;

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
        if (tabId === 'recognize') {
            setDynamicBackground(WELCOME_BACKGROUND_IMAGE);
        }
    }, []);

    const handleSelectMonument = useCallback((monument: Monument | null) => {
        setSelectedMonument(monument);
        if (monument) {
             setDynamicBackground(`https://source.unsplash.com/1920x1080/?${encodeURIComponent(monument.name)}`);
            setActiveTab('info');
        } else {
            setDynamicBackground(WELCOME_BACKGROUND_IMAGE);
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
            case 'ai-guide':
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
                    <div className={`absolute inset-0 transition-colors duration-500 ${isWelcomeScreen ? 'bg-slate-900/20 dark:bg-black/40' : 'bg-slate-900/50 dark:bg-black/70'}`}></div>
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