"use client";

import { useState, useEffect, use } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
    Calendar,
    MapPin,
    Users,
    CheckCircle2,
    XCircle,
    Loader2,
    Heart,
    ExternalLink
} from "lucide-react";
import QRCode from "react-qr-code";
import AddToCalendar from "@/components/AddToCalendar";

interface WeddingEvent {
    id: string;
    name: string;
    date: string;
    location: string;
    mapUrl?: string;
}

interface Guest {
    id: string;
    name: string;
    group: string;
    passes: number;
    status: "Confirmado" | "Pendiente" | "Declinado";
}

export default function InvitationPage({ params }: { params: Promise<{ eventId: string; guestId: string }> }) {
    const { eventId, guestId } = use(params);
    const [event, setEvent] = useState<WeddingEvent | null>(null);
    const [guest, setGuest] = useState<Guest | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [rsvpDone, setRsvpDone] = useState(false);
    const [selectedPasses, setSelectedPasses] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Event
                const eventRef = doc(db, "events", eventId);
                const eventSnap = await getDoc(eventRef);

                // Fetch Guest
                const guestRef = doc(db, "events", eventId, "guests", guestId);
                const guestSnap = await getDoc(guestRef);

                if (eventSnap.exists() && guestSnap.exists()) {
                    setEvent({ id: eventSnap.id, ...eventSnap.data() } as WeddingEvent);
                    const guestData = { id: guestSnap.id, ...guestSnap.data() } as Guest;
                    setGuest(guestData);
                    setSelectedPasses(guestData.passes);
                    if (guestData.status !== "Pendiente") {
                        setRsvpDone(true);
                    }
                }
            } catch (error) {
                console.error("Error fetching invitation data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [eventId, guestId]);

    const handleRSVP = async (status: "Confirmado" | "Declinado") => {
        setSubmitting(true);
        try {
            const guestRef = doc(db, "events", eventId, "guests", guestId);
            await updateDoc(guestRef, {
                status: status,
                confirmedPasses: status === "Confirmado" ? selectedPasses : 0,
                updatedAt: new Date()
            });
            setRsvpDone(true);
            setGuest(prev => prev ? { ...prev, status } : null);
        } catch (error) {
            console.error("Error updating RSVP:", error);
            alert("Hubo un error al guardar tu respuesta. Por favor intenta de nuevo.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-rose-50/30">
                <Loader2 className="animate-spin text-rose-500 mb-4" size={40} />
                <p className="font-medium text-rose-600 animate-pulse">Cargando tu invitación...</p>
            </div>
        );
    }

    if (!event || !guest) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-gray-50">
                <XCircle size={60} className="text-gray-300 mb-4" />
                <h1 className="text-2xl font-bold text-gray-800">Invitación no encontrada</h1>
                <p className="text-gray-500 mt-2">El enlace parece ser inválido o el evento ya no está disponible.</p>
            </div>
        );
    }

    // Google Maps Link Logic
    // If mapUrl exists, use it directly. Otherwise, search by location name.
    const mapLink = event.mapUrl
        ? event.mapUrl
        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`;

    return (
        <div className="min-h-screen bg-[#fffcfc] flex flex-col items-center py-10 px-4">
            {/* Decoración Superior */}
            <div className="w-full max-w-lg mb-8 text-center">
                <div className="inline-block p-3 rounded-full bg-rose-100 text-rose-600 mb-4">
                    <Heart size={32} fill="currentColor" />
                </div>
                <h2 className="text-rose-500 font-medium tracking-[0.2em] uppercase text-sm mb-2">Estás cordialmente invitado a</h2>
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-800 leading-tight">
                    {event.name}
                </h1>
            </div>

            {/* Tarjeta de Invitación */}
            <div className="w-full max-w-lg bg-white rounded-[2rem] shadow-2xl shadow-rose-100/50 border border-rose-50 overflow-hidden relative">
                {/* Overlay de diseño */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-bl-full opacity-50 -z-0"></div>

                <div className="p-8 md:p-12 space-y-10 relative z-10">
                    {/* Detalles */}
                    <div className="space-y-8">
                        {/* Fecha y Calendario */}
                        <div className="flex items-start gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-rose-50 flex-shrink-0 flex items-center justify-center text-rose-500">
                                <Calendar size={24} />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-1">Cuándo</p>
                                <p className="text-xl font-bold text-gray-800 mb-2">{event.date}</p>
                                <AddToCalendar event={event} />
                            </div>
                        </div>

                        {/* Ubicación y Mapa */}
                        <div className="flex items-start gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-rose-50 flex-shrink-0 flex items-center justify-center text-rose-500">
                                <MapPin size={24} />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-1">Dónde</p>
                                <p className="text-xl font-bold text-gray-800 mb-2">{event.location}</p>
                                <a
                                    href={mapLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-sm font-bold text-rose-600 hover:text-rose-700 hover:underline transition"
                                >
                                    <span>Ver en Mapa</span>
                                    <ExternalLink size={14} />
                                </a>
                            </div>
                        </div>

                        {/* Invitado */}
                        <div className="flex items-start gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-rose-50 flex-shrink-0 flex items-center justify-center text-rose-500">
                                <Users size={24} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-rose-400 uppercase tracking-widest">Para quién</p>
                                <p className="text-xl font-bold text-gray-800">{guest.name}</p>
                                <p className="text-sm text-gray-500">Incluye {guest.passes} {guest.passes === 1 ? 'pase' : 'pases'}</p>
                            </div>
                        </div>
                    </div>

                    <hr className="border-rose-100" />

                    {/* RSVP Section */}
                    <div className="space-y-6">
                        {!rsvpDone ? (
                            <>
                                <div className="text-center space-y-2">
                                    <h3 className="text-xl font-bold text-gray-800">¿Nos acompañas?</h3>
                                    <p className="text-gray-500 text-sm">Por favor confirma tu asistencia</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <label className="text-sm font-bold text-gray-600">Pases a usar:</label>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => setSelectedPasses(Math.max(1, selectedPasses - 1))}
                                                className="w-8 h-8 rounded-full border border-rose-200 text-rose-600 flex items-center justify-center hover:bg-rose-50 transition"
                                            >-</button>
                                            <span className="text-lg font-bold w-4 text-center">{selectedPasses}</span>
                                            <button
                                                onClick={() => setSelectedPasses(Math.min(guest.passes, selectedPasses + 1))}
                                                className="w-8 h-8 rounded-full border border-rose-200 text-rose-600 flex items-center justify-center hover:bg-rose-50 transition"
                                            >+</button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <button
                                            onClick={() => handleRSVP("Confirmado")}
                                            disabled={submitting}
                                            className="py-4 bg-rose-600 text-white rounded-2xl font-bold hover:bg-rose-700 transition shadow-xl shadow-rose-200 disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            {submitting ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
                                            Confirmar
                                        </button>
                                        <button
                                            onClick={() => handleRSVP("Declinado")}
                                            disabled={submitting}
                                            className="py-4 border-2 border-gray-200 text-gray-500 rounded-2xl font-bold hover:bg-gray-50 transition disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            No podré ir
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-6 space-y-4 animate-in fade-in zoom-in duration-500">
                                <div className="inline-block p-4 rounded-full bg-emerald-50 text-emerald-500 mb-2">
                                    {guest.status === "Confirmado" ? <CheckCircle2 size={48} /> : <XCircle size={48} />}
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800">
                                    {guest.status === "Confirmado" ? "¡Gracias por confirmar!" : "Sentimos que no puedas ir"}
                                </h3>
                                <p className="text-gray-500">
                                    {guest.status === "Confirmado"
                                        ? `Hemos registrado ${selectedPasses} pases para tu lugar. ¡Nos vemos pronto!`
                                        : "Gracias por avisarnos, se te extrañará."}
                                </p>

                                {guest.status === "Confirmado" && (
                                    <div className="mt-6 p-4 bg-white rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Tu Pase de Entrada</p>
                                        <div className="p-2 bg-white rounded-lg shadow-sm">
                                            <QRCode
                                                value={JSON.stringify({ eventId, guestId })}
                                                size={150}
                                                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                                viewBox={`0 0 150 150`}
                                            />
                                        </div>
                                        <p className="text-xs text-gray-400 mt-2">Muestra este código en la entrada</p>
                                    </div>
                                )}
                                <button
                                    onClick={() => setRsvpDone(false)}
                                    className="text-rose-500 text-sm font-bold hover:underline"
                                >
                                    Cambiar respuesta
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-12 text-center text-gray-400 text-sm flex items-center gap-2">
                <span>Hecho con</span>
                <Heart size={14} className="text-rose-300" fill="currentColor" />
                <span>para {event.name}</span>
            </div>
        </div>
    );
}
