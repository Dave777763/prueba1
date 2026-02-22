"use client";

import { useState, useEffect } from 'react';
import { themes, getTheme, type Theme } from '@/lib/themes';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Check, Palette } from 'lucide-react';

interface ThemeSelectorProps {
    eventId: string;
    currentTheme: string;
}

export default function ThemeSelector({ eventId, currentTheme }: ThemeSelectorProps) {
    const [selectedTheme, setSelectedTheme] = useState(currentTheme);
    const [saving, setSaving] = useState(false);

    // Sincronizar el estado local si el prop cambia desde el exterior
    useEffect(() => {
        setSelectedTheme(currentTheme);
    }, [currentTheme]);

    const handleThemeChange = async (themeId: string) => {
        if (themeId === selectedTheme) return; // Evitar guardados innecesarios

        setSelectedTheme(themeId);
        setSaving(true);
        try {
            const eventRef = doc(db, 'events', eventId);
            await updateDoc(eventRef, {
                theme: themeId,
            });
            console.log("Tema actualizado exitosamente:", themeId);
        } catch (error) {
            console.error('Error updating theme:', error);
            alert('Error al guardar el tema. Verifica tu conexión.');
            setSelectedTheme(currentTheme); // Revertir si hay error
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {themes.map((theme) => (
                    <ThemeCard
                        key={theme.id}
                        theme={theme}
                        isSelected={selectedTheme === theme.id}
                        onSelect={handleThemeChange}
                    />
                ))}
            </div>
            {saving && (
                <div className="text-center text-sm text-gray-500 font-medium">
                    Guardando tema...
                </div>
            )}
        </div>
    );
}

interface ThemeCardProps {
    theme: Theme;
    isSelected: boolean;
    onSelect: (themeId: string) => void;
}

function ThemeCard({ theme, isSelected, onSelect }: ThemeCardProps) {
    return (
        <button
            onClick={() => onSelect(theme.id)}
            className={`relative group text-left p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl ${isSelected
                ? 'border-rose-500 shadow-lg ring-4 ring-rose-100'
                : 'border-gray-200 hover:border-gray-300'
                }`}
            style={{ backgroundColor: theme.colors.background }}
        >
            {/* Selected Indicator */}
            {isSelected && (
                <div className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1.5 shadow-lg animate-scaleIn">
                    <Check size={16} strokeWidth={3} />
                </div>
            )}

            {/* Color Palette Preview */}
            <div className="flex gap-1 mb-3">
                <div
                    className="w-8 h-8 rounded-full shadow-sm border-2 border-white"
                    style={{ backgroundColor: theme.colors.primary }}
                />
                <div
                    className="w-8 h-8 rounded-full shadow-sm border-2 border-white"
                    style={{ backgroundColor: theme.colors.primaryLight }}
                />
                <div
                    className="w-8 h-8 rounded-full shadow-sm border-2 border-white"
                    style={{ backgroundColor: theme.colors.accent }}
                />
            </div>

            {/* Theme Name */}
            <h4
                className="text-lg font-bold mb-1"
                style={{
                    color: theme.colors.primary,
                    fontFamily: theme.fonts.heading,
                }}
            >
                {theme.name}
            </h4>

            {/* Theme Description */}
            <p
                className="text-sm mb-3"
                style={{
                    color: theme.colors.textLight,
                    fontFamily: theme.fonts.body,
                }}
            >
                {theme.description}
            </p>

            {/* Font Preview */}
            <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                <Palette size={14} style={{ color: theme.colors.textLight }} />
                <span
                    className="text-xs font-medium capitalize"
                    style={{ color: theme.colors.textLight }}
                >
                    {theme.style}
                </span>
            </div>
        </button>
    );
}
