import { ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', ...props }, ref) => {
        const variants = {
            primary: 'bg-rose-600 text-white hover:bg-rose-700',
            secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
            outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50'
        };

        return (
            <button
                ref={ref}
                className={cn(
                    'px-4 py-2 rounded-full font-medium transition-colors',
                    variants[variant],
                    className
                )}
                {...props}
            />
        );
    }
);

Button.displayName = 'Button';
