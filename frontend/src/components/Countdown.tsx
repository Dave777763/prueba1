"use client";

import { useEffect, useState } from 'react';

interface CountdownProps {
    targetDate: string;
    theme?: {
        primary: string;
        primaryLight: string;
        text: string;
    };
}

interface TimeRemaining {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

const TimeUnit = ({ value, label, theme }: { value: number; label: string; theme?: CountdownProps['theme'] }) => (
    <div
        className="flex flex-col items-center p-4 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105"
        style={{
            backgroundColor: theme?.primaryLight || '#ffe4e6',
            borderWidth: '2px',
            borderColor: theme?.primary || '#be123c',
            borderStyle: 'solid',
        }}
    >
        <div
            className="text-4xl md:text-5xl font-bold tabular-nums leading-none mb-2"
            style={{ color: theme?.primary || '#be123c' }}
        >
            {value.toString().padStart(2, '0')}
        </div>
        <div
            className="text-xs md:text-sm font-medium uppercase tracking-wider"
            style={{ color: theme?.text || '#6b7280' }}
        >
            {label}
        </div>
    </div>
);

export default function Countdown({ targetDate, theme }: CountdownProps) {
    const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        const calculateTimeRemaining = () => {
            const now = new Date().getTime();
            const target = new Date(targetDate).getTime();
            const difference = target - now;

            if (difference > 0) {
                setTimeRemaining({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((difference % (1000 * 60)) / 1000),
                });
            }
        };

        calculateTimeRemaining();
        const interval = setInterval(calculateTimeRemaining, 1000);

        return () => clearInterval(interval);
    }, [targetDate]);

    return (
        <div className="w-full">
            <div className="text-center mb-6">
                <p
                    className="text-sm md:text-base font-medium uppercase tracking-widest"
                    style={{ color: theme?.text || '#6b7280' }}
                >
                    Faltan
                </p>
            </div>
            <div className="grid grid-cols-4 gap-3 md:gap-4">
                <TimeUnit value={timeRemaining.days} label="Días" theme={theme} />
                <TimeUnit value={timeRemaining.hours} label="Horas" theme={theme} />
                <TimeUnit value={timeRemaining.minutes} label="Min" theme={theme} />
                <TimeUnit value={timeRemaining.seconds} label="Seg" theme={theme} />
            </div>
        </div>
    );
}
