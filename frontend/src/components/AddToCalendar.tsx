"use client";

import { useState } from "react";
import { Calendar, CalendarPlus, Download, ExternalLink } from "lucide-react";

interface AddToCalendarProps {
    event: {
        name: string;
        date: string;
        location: string;
        description?: string;
    };
}

export default function AddToCalendar({ event }: AddToCalendarProps) {
    const [isOpen, setIsOpen] = useState(false);

    // Helper to attempt to parse the date string.
    // If it fails, we returns null and the calendar event might default to today.
    // We try to handle "YYYY-MM-DD" or standard JS date strings.
    const getEventDates = () => {
        try {
            // This assumes event.date might be something parsable by Date()
            // If it's pure text like "Next Saturday", this will likely be Invalid Date
            const startDate = new Date(event.date);

            if (isNaN(startDate.getTime())) {
                // If parsing failed, we can try to extract date parts if it matches specific formats
                // But for now, let's safely fallback to "today" or let the user pick
                // returning null implies "let user decide" or we use current time
                const now = new Date();
                // Default to tomorrow at 12:00 PM for safety if unknown
                now.setDate(now.getDate() + 1);
                now.setHours(12, 0, 0, 0);
                const end = new Date(now);
                end.setHours(16, 0, 0, 0); // 4 hours duration
                return { start: now, end: end };
            }

            const endDate = new Date(startDate);
            endDate.setHours(startDate.getHours() + 5); // Assume 5 hours duration

            return { start: startDate, end: endDate };
        } catch (e) {
            const now = new Date();
            now.setDate(now.getDate() + 1);
            return { start: now, end: now };
        }
    };

    const formatDateForGoogle = (date: Date) => {
        return date.toISOString().replace(/-|:|\.\d\d\d/g, "");
    };

    const getGoogleCalendarUrl = () => {
        const { start, end } = getEventDates();
        const dates = `${formatDateForGoogle(start)}/${formatDateForGoogle(end)}`;

        const params = new URLSearchParams({
            action: "TEMPLATE",
            text: event.name,
            dates: dates,
            details: event.description || `Celebración de ${event.name}`,
            location: event.location,
        });

        return `https://calendar.google.com/calendar/render?${params.toString()}`;
    };

    const downloadIcsFile = () => {
        const { start, end } = getEventDates();
        const formatDate = (date: Date) => date.toISOString().replace(/-|:|\.\d\d\d/g, "").split("T")[0];
        const formatDateTime = (date: Date) => date.toISOString().replace(/-|:|\.\d\d\d/g, "");

        const icsContent = [
            "BEGIN:VCALENDAR",
            "VERSION:2.0",
            "PRODID:-//EventosApp//Bodas//ES",
            "BEGIN:VEVENT",
            `UID:${Date.now()}@eventosapp.com`,
            `DTSTAMP:${formatDateTime(new Date())}`,
            `DTSTART:${formatDateTime(start)}`,
            `DTEND:${formatDateTime(end)}`,
            `SUMMARY:${event.name}`,
            `DESCRIPTION:${event.description || `Celebración de ${event.name}`}`,
            `LOCATION:${event.location}`,
            "END:VEVENT",
            "END:VCALENDAR"
        ].join("\r\n");

        const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute("download", "evento.ics");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-rose-200 text-rose-600 rounded-xl font-medium hover:bg-rose-50 transition shadow-sm"
            >
                <CalendarPlus size={18} />
                <span className="hidden sm:inline">Agregar a Calendario</span>
                <span className="sm:hidden">Calendario</span>
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 p-2 z-20 animate-in fade-in zoom-in-95 duration-100">
                        <a
                            href={getGoogleCalendarUrl()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition text-sm font-medium"
                            onClick={() => setIsOpen(false)}
                        >
                            <ExternalLink size={16} />
                            Google Calendar
                        </a>
                        <button
                            onClick={() => {
                                downloadIcsFile();
                                setIsOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition text-sm font-medium text-left"
                        >
                            <Download size={16} />
                            Outlook / Apple (.ics)
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
