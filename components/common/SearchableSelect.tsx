import React, { useState, useRef, useEffect, useMemo } from 'react';
import type { Monument } from '../../types';

interface SearchableSelectProps {
    options: Monument[];
    selectedOption: Monument | null;
    onSelect: (option: Monument | null) => void;
    placeholder?: string;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
    options,
    selectedOption,
    onSelect,
    placeholder = "Search for a monument..."
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const filteredOptions = useMemo(() =>
        options.filter(option =>
            option.name.toLowerCase().includes(searchTerm.toLowerCase())
        ), [options, searchTerm]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchTerm('');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleSelect = (option: Monument) => {
        onSelect(option);
        setSearchTerm('');
        setIsOpen(false);
    };

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="relative w-full" ref={wrapperRef}>
            <button
                type="button"
                onClick={handleToggle}
                className="w-full p-2.5 text-left border border-gray-300/80 rounded-lg bg-white/80 dark:bg-gray-700/80 dark:border-gray-600/80 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-sm flex justify-between items-center"
            >
                <span className={selectedOption ? 'text-gray-800 dark:text-gray-200' : 'text-gray-400 dark:text-gray-500'}>
                    {selectedOption ? selectedOption.name : placeholder}
                </span>
                <i className={`ph-bold ph-caret-down transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}></i>
            </button>

            {isOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto animate-fade-in">
                    <div className="p-2 sticky top-0 bg-white dark:bg-gray-800">
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-900 dark:border-gray-600 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                        />
                    </div>
                    <ul>
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map(option => (
                                <li
                                    key={option.id}
                                    onClick={() => handleSelect(option)}
                                    className="px-4 py-2 hover:bg-primary-100 dark:hover:bg-primary-700 cursor-pointer text-gray-800 dark:text-gray-200"
                                >
                                    {option.name}
                                </li>
                            ))
                        ) : (
                            <li className="px-4 py-2 text-gray-500">No results found</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};
