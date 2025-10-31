import React from 'react';
import { Spinner } from './Spinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger';
    isLoading?: boolean;
    icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    isLoading = false,
    icon,
    className = '',
    ...props
}) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-lg font-semibold px-4 py-2.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 shadow-sm hover:shadow-md hover:-translate-y-0.5';
    
    const variantClasses = {
        primary: 'bg-primary-600 text-white hover:bg-primary-500 focus:ring-primary-500 disabled:bg-primary-400 dark:disabled:bg-primary-800 dark:disabled:text-gray-500 disabled:transform-none disabled:shadow-none',
        secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 focus:ring-primary-500 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:transform-none disabled:shadow-none',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-red-300 disabled:transform-none disabled:shadow-none',
    };

    return (
        <button
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading ? (
                <Spinner size="sm" />
            ) : (
                <>
                    {icon && <span className="mr-2">{icon}</span>}
                    {children}
                </>
            )}
        </button>
    );
};