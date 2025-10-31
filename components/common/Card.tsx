import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
    return (
        <div
            className={`bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/30 overflow-hidden transition-all duration-300 ${className} ${onClick ? 'cursor-pointer hover:shadow-xl hover:scale-[1.03]' : ''}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
};