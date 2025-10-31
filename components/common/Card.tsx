import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
    return (
        <div
            className={`bg-white/70 dark:bg-primary-950/70 backdrop-blur-2xl rounded-2xl shadow-lg border border-slate-300/20 dark:border-slate-700/30 overflow-hidden transition-all duration-300 ${className} ${onClick ? 'cursor-pointer hover:shadow-xl hover:scale-[1.03] hover:border-secondary-500/30' : ''}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
};