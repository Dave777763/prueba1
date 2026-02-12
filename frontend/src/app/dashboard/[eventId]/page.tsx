"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import {
    ChevronLeft,
    Calendar,
    MapPin,
    Users,
    Info,
    Settings,
    Plus,
    Search,
    Loader2,
    CheckCircle2,
    Clock,
    XCircle,
    Copy,
    Share2,
    QrCode
} from "lucide-react";
import { db } from "@/lib/firebase";
import {
    doc,
    getDoc,
    collection,
    addDoc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp
} from "firebase/firestore";

interface WeddingEvent {
    id: string;
    name: string;
    date: string;
    location: string;
}

interface Guest {
    id: string;
    name: string;
    group: string;
    passes: number;
    status: "Confirmado" | "Pendiente" | "Declinado";
    attended?: boolean;
    attendedAt?: any;
}

export default function EventDetailPage({ params }: { params: Promise<{ eventId: string }> }) {
    const { eventId } = use(params);
    const router = useRouter();
    const [event, setEvent] = useState<WeddingEvent | null>(null);
    const [activeTab, setActiveTab] = useState<"general" | "invitados" | "config">("invitados");
    const [loading, setLoading] = useState(true);
    const [guests, setGuests] = useState<Guest[]>([]);
    const [isAddGuestModalOpen, setIsAddGuestModalOpen] = useState(false);

    // Formulario de invitado
    const [guestForm, setGuestForm] = useState({
        name: "",
        group: "",
        passes: 1,
        status: "Pendiente" as const
    });

    useEffect(() => {
        if (!eventId) return;

        // Cargar datos del evento
        const fetchEvent = async () => {
            const docRef = doc(db, "events", eventId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setEvent({ id: docSnap.id, ...docSnap.data() } as WeddingEvent);
            } else {
                console.error("Evento no encontrado");
                router.push("/dashboard");
            }
            setLoading(false);
        };

        fetchEvent();

        // Escuchar invitados en tiempo real
        const guestsQuery = query(
            collection(db, "events", eventId, "guests"),
            orderBy("name", "asc")
        );

        const unsubscribe = onSnapshot(guestsQuery, (snapshot) => {
            const list = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Guest[];
            setGuests(list);
        });

        return () => unsubscribe();
    }, [eventId, router]);

    const handleAddGuest = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, "events", eventId, "guests"), {
                ...guestForm,
                createdAt: serverTimestamp()
            });
            setGuestForm({ name: "", group: "", passes: 1, status: "Pendiente" });
            setIsAddGuestModalOpen(false);
        } catch (error) {
            console.error("Error adding guest:", error);
            alert("Error al agregar invitado");
        }
    };

    const copyInvitationLink = (guestId: string) => {
        const link = `${window.location.origin}/invitacion/${eventId}/${guestId}`;
        navigator.clipboard.writeText(link);
        alert("¡Enlace de invitación copiado al portapapeles!");
    };

    const shareInvitation = async (guest: Guest) => {
        const link = `${window.location.origin}/invitacion/${eventId}/${guest.id}`;
        const message = `¡Hola ${guest.name}! 👋\n\nTe invitamos cordialmente a nuestro evento: *${event?.name}* 🥂\n\nAquí puedes ver todos los detalles y confirmar tu asistencia:\n${link}\n\n¡Esperamos contar con tu presencia!`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Invitación para ${event?.name}`,
                    text: message,
                    url: link,
                });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="animate-spin text-rose-500" size={40} />
            </div>
        );
    }

    if (!event) return null;

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            {/* Header */}
            <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push("/dashboard")}
                            className="p-2 hover:bg-gray-100 rounded-full transition"
                        >
                            <ChevronLeft size={24} className="text-gray-600" />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-gray-800 line-clamp-1">{event.name}</h1>
                        </div>
                    </div>
                    <div>
                        <button
                            onClick={() => router.push(`/dashboard/${eventId}/scan`)}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition font-medium text-sm shadow-lg shadow-gray-200"
                        >
                            <QrCode size={18} />
                            <span className="hidden md:inline">Escanear Entradas</span>
                        </button>
                    </div>
                </div>

            </header >

            <main className="max-w-6xl mx-auto px-4 py-8">
                {/* Tabs */}
                <div className="flex gap-1 bg-white p-1 rounded-xl border border-gray-200 mb-8 max-w-fit shadow-sm">
                    <button
                        onClick={() => setActiveTab("invitados")}
                        className={`px-6 py-2 rounded-lg flex items-center gap-2 font-medium transition ${activeTab === "invitados" ? "bg-rose-50 text-rose-600 shadow-sm" : "text-gray-500 hover:bg-gray-50"}`}
                    >
                        <Users size={18} /> Invitados
                    </button>
                    <button
                        onClick={() => setActiveTab("general")}
                        className={`px-6 py-2 rounded-lg flex items-center gap-2 font-medium transition ${activeTab === "general" ? "bg-rose-50 text-rose-600 shadow-sm" : "text-gray-500 hover:bg-gray-50"}`}
                    >
                        <Info size={18} /> Información
                    </button>
                    <button
                        onClick={() => setActiveTab("config")}
                        className={`px-6 py-2 rounded-lg flex items-center gap-2 font-medium transition ${activeTab === "config" ? "bg-rose-50 text-rose-600 shadow-sm" : "text-gray-500 hover:bg-gray-50"}`}
                    >
                        <Settings size={18} /> Ajustes
                    </button>
                </div>

                {activeTab === "invitados" && (
                    <div className="space-y-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="relative w-full md:max-w-md">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Buscar por nombre o familia..."
                                    className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none transition"
                                />
                            </div>
                            <button
                                onClick={() => setIsAddGuestModalOpen(true)}
                                className="w-full md:w-auto px-6 py-2 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition flex items-center justify-center gap-2 shadow-lg shadow-rose-100 font-medium"
                            >
                                <Plus size={20} /> Agregar Invitado
                            </button>
                        </div>

                        {/* Guest Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Total</p>
                                <p className="text-2xl font-bold text-gray-800">{guests.length}</p>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                <p className="text-xs text-rose-600 uppercase font-bold tracking-wider mb-1">Confirmados</p>
                                <p className="text-2xl font-bold text-gray-800">
                                    {guests.reduce((acc, g) => acc + (g.status === "Confirmado" ? g.passes : 0), 0)}
                                </p>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                <p className="text-xs text-amber-600 uppercase font-bold tracking-wider mb-1">Pendientes</p>
                                <p className="text-2xl font-bold text-gray-800">
                                    {guests.reduce((acc, g) => acc + (g.status === "Pendiente" ? g.passes : 0), 0)}
                                </p>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Pases Totales</p>
                                <p className="text-2xl font-bold text-gray-800">
                                    {guests.reduce((acc, g) => acc + g.passes, 0)}
                                </p>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm ring-2 ring-emerald-500/10">
                                <p className="text-xs text-emerald-600 uppercase font-bold tracking-wider mb-1">Asistieron</p>
                                <p className="text-2xl font-bold text-gray-800">
                                    {guests.filter(g => g.attended).length}
                                </p>
                            </div>
                        </div>

                        {/* Guests List */}
                        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 border-b border-gray-100">
                                        <tr>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Invitado / Familia</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Pases</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Estado</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {guests.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-12 text-center text-gray-500 italic">
                                                    No hay invitados registrados aún.
                                                </td>
                                            </tr>
                                        ) : (
                                            guests.map((guest) => (
                                                <tr key={guest.id} className="hover:bg-gray-50/50 transition group">
                                                    <td className="px-6 py-4">
                                                        <p className="font-bold text-gray-800">{guest.name}</p>
                                                        <p className="text-xs text-gray-500">{guest.group}</p>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm font-medium">
                                                            {guest.passes}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {guest.status === "Confirmado" && (
                                                            <span className="flex items-center gap-1.5 text-sm text-emerald-600 font-bold">
                                                                <CheckCircle2 size={16} /> Confirmado
                                                            </span>
                                                        )}
                                                        {guest.status === "Pendiente" && (
                                                            <span className="flex items-center gap-1.5 text-sm text-amber-500 font-bold">
                                                                <Clock size={16} /> Pendiente
                                                            </span>
                                                        )}
                                                        {guest.status === "Declinado" && (
                                                            <span className="flex items-center gap-1.5 text-sm text-rose-500 font-bold">
                                                                <XCircle size={16} /> Declinado
                                                            </span>
                                                        )}
                                                        {guest.attended && (
                                                            <span className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold border border-emerald-200">
                                                                Dentro del evento
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <button
                                                                onClick={() => shareInvitation(guest)}
                                                                className="px-4 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition flex items-center gap-2 text-sm font-bold border border-emerald-100"
                                                                title="Enviar por WhatsApp"
                                                            >
                                                                <Share2 size={16} />
                                                                <span className="hidden md:inline">Compartir</span>
                                                            </button>
                                                            <button
                                                                onClick={() => copyInvitationLink(guest.id)}
                                                                className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition flex items-center gap-1 text-sm font-bold"
                                                                title="Copiar invitación"
                                                            >
                                                                <Copy size={16} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "general" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                            <h3 className="text-xl font-bold text-gray-800 border-b pb-4">Detalles del Evento</h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                                        <Calendar size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium">Fecha del Evento</p>
                                        <p className="text-lg font-bold text-gray-800">{event.date}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium">Ubicación</p>
                                        <p className="text-lg font-bold text-gray-800">{event.location}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-4">
                                <button className="w-full py-3 border border-rose-200 text-rose-600 rounded-xl font-medium hover:bg-rose-50 transition">
                                    Actualizar Información
                                </button>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-rose-500 to-rose-600 p-8 rounded-2xl text-white shadow-lg space-y-4 flex flex-col justify-center">
                            <h3 className="text-2xl font-bold">Invitación Digital</h3>
                            <p className="opacity-90">Pronto podrás generar enlaces personalizados para que tus invitados confirmen su asistencia línea.</p>
                            <div className="pt-4">
                                <span className="bg-white/20 px-4 py-2 rounded-full text-sm font-bold backdrop-blur-sm">
                                    PRÓXIMAMENTE
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "config" && (
                    <div className="max-w-2xl bg-white rounded-2xl border border-rose-100 overflow-hidden shadow-sm">
                        <div className="p-6 bg-rose-50 border-b border-rose-100">
                            <h3 className="text-xl font-bold text-rose-900">Configuración Avanzada</h3>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-bold text-gray-800">Eliminar Evento</p>
                                    <p className="text-sm text-gray-500">Esta acción no se puede deshacer y borrará todos los invitados.</p>
                                </div>
                                <button className="px-4 py-2 bg-rose-50 text-rose-600 rounded-lg font-bold border border-rose-100 hover:bg-rose-100 transition">
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Modal Agregar Invitado */}
            {
                isAddGuestModalOpen && (
                    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                        <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                <h3 className="text-xl font-bold text-gray-800">Nuevo Invitado</h3>
                                <button onClick={() => setIsAddGuestModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1">
                                    <XCircle size={24} />
                                </button>
                            </div>
                            <form onSubmit={handleAddGuest} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Nombre Completo</label>
                                    <input
                                        required
                                        type="text"
                                        value={guestForm.name}
                                        onChange={(e) => setGuestForm({ ...guestForm, name: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-rose-500 outline-none transition"
                                        placeholder="Ej. Juan Pérez"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Grupo / Familia</label>
                                    <input
                                        type="text"
                                        value={guestForm.group}
                                        onChange={(e) => setGuestForm({ ...guestForm, group: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-rose-500 outline-none transition"
                                        placeholder="Ej. Familia Pérez o Amigos Novio"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Pases</label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={guestForm.passes}
                                            onChange={(e) => setGuestForm({ ...guestForm, passes: parseInt(e.target.value) })}
                                            className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-rose-500 outline-none transition"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Estatus</label>
                                        <select
                                            value={guestForm.status}
                                            onChange={(e) => setGuestForm({ ...guestForm, status: e.target.value as any })}
                                            className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-rose-500 outline-none transition bg-white"
                                        >
                                            <option value="Pendiente">Pendiente</option>
                                            <option value="Confirmado">Confirmado</option>
                                            <option value="Declinado">Declinado</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="pt-4 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsAddGuestModalOpen(false)}
                                        className="flex-1 py-3 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-3 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 transition shadow-lg shadow-rose-100"
                                    >
                                        Guardar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
        </div >
    );
}
