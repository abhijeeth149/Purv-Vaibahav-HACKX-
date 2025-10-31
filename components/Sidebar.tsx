import React from 'react';
import { TABS } from '../constants';
import type { Tab } from '../types';

interface SidebarProps {
    activeTab: Tab['id'];
    onTabChange: (tabId: Tab['id']) => void;
    darkMode: boolean;
    setDarkMode: (value: boolean) => void;
    isSidebarOpen: boolean;
    setIsSidebarOpen: (value: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, darkMode, setDarkMode, isSidebarOpen, setIsSidebarOpen }) => {
    const NavLink: React.FC<{ tab: Tab }> = ({ tab }) => (
        <button
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group ${
                activeTab === tab.id
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-primary-500/10 dark:hover:bg-primary-400/10 hover:text-primary-600 dark:hover:text-primary-300'
            }`}
        >
            <i className={`ph-bold ${tab.icon} text-xl mr-3 transition-transform duration-300 ${activeTab !== tab.id && 'group-hover:scale-110'}`}></i>
            <span className="flex-1 text-left">{tab.label}</span>
        </button>
    );

    return (
        <>
            <div 
                className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity lg:hidden ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsSidebarOpen(false)}
            ></div>
            <aside className={`fixed top-0 left-0 z-50 flex flex-col h-full w-64 bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl border-r border-gray-200/80 dark:border-gray-700/60 shadow-xl transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                <div className="flex items-center justify-between p-4 border-b border-gray-200/80 dark:border-gray-700/60">
                    <div className="flex items-center">
                        <i className="ph-bold ph-castle-turret text-3xl text-primary-600 dark:text-primary-400"></i>
                        <h1 className="ml-2 text-xl font-display font-bold text-gray-800 dark:text-white">Purv Vaibhav</h1>
                    </div>
                     <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-500 dark:text-gray-400">
                        <i className="ph-bold ph-x text-2xl"></i>
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {TABS.map((tab) => (
                        <NavLink key={tab.id} tab={tab} />
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-200/80 dark:border-gray-700/60">
                    <div className="flex items-center justify-between bg-gray-500/10 rounded-lg p-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Dark Mode</span>
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                                darkMode ? 'bg-primary-600' : 'bg-gray-400'
                            }`}
                        >
                            <span
                                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                    darkMode ? 'translate-x-5' : 'translate-x-0'
                                }`}
                            />
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;