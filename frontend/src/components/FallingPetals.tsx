"use client";

import { useEffect, useState } from 'react';

interface Petal {
    id: number;
    left: number;
    animationDuration: number;
    animationDelay: number;
    size: number;
    opacity: number;
}

interface FallingPetalsProps {
    color?: string;
    count?: number;
}

export default function FallingPetals({ color = '#fda4af', count = 30 }: FallingPetalsProps) {
    const [petals, setPetals] = useState<Petal[]>([]);

    useEffect(() => {
        const newPetals: Petal[] = [];
        for (let i = 0; i < count; i++) {
            newPetals.push({
                id: i,
                left: Math.random() * 100,
                animationDuration: 8 + Math.random() * 10,
                animationDelay: Math.random() * 5,
                size: 8 + Math.random() * 12,
                opacity: 0.3 + Math.random() * 0.4,
            });
        }
        setPetals(newPetals);
    }, [count]);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {petals.map((petal) => (
                <div
                    key={petal.id}
                    className="absolute animate-fall"
                    style={{
                        left: `${petal.left}%`,
                        animationDuration: `${petal.animationDuration}s`,
                        animationDelay: `${petal.animationDelay}s`,
                        width: `${petal.size}px`,
                        height: `${petal.size}px`,
                        opacity: petal.opacity,
                        top: '-20px',
                    }}
                >
                    <svg viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C12 2 8 5 8 9C8 11.21 9.79 13 12 13C14.21 13 16 11.21 16 9C16 5 12 2 12 2Z" />
                        <path d="M12 22C12 22 16 19 16 15C16 12.79 14.21 11 12 11C9.79 11 8 12.79 8 15C8 19 12 22 12 22Z" />
                        <path d="M2 12C2 12 5 8 9 8C11.21 8 13 9.79 13 12C13 14.21 11.21 16 9 16C5 16 2 12 2 12Z" />
                        <path d="M22 12C22 12 19 16 15 16C12.79 16 11 14.21 11 12C11 9.79 12.79 8 15 8C19 8 22 12 22 12Z" />
                    </svg>
                </div>
            ))}
        </div>
    );
}
