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
    const baseClasses = 'inline-flex items-center justify-center rounded-lg font-semibold px-4 py-2.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-primary-950 shadow-sm hover:shadow-md hover:-translate-y-0.5';
    
    const variantClasses = {
        primary: 'bg-secondary-600 text-white hover:bg-secondary-500 focus:ring-secondary-500 disabled:bg-secondary-400 dark:disabled:bg-secondary-800 dark:disabled:text-gray-500 disabled:transform-none disabled:shadow-none',
        secondary: 'bg-primary-200 text-primary-800 hover:bg-primary-300 dark:bg-primary-700 dark:text-primary-200 dark:hover:bg-primary-600 focus:ring-secondary-500 disabled:bg-primary-100 dark:disabled:bg-primary-800 disabled:transform-none disabled:shadow-none',
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