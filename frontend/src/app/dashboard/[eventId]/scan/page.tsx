"use client";

import { useState, useEffect, use } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Loader2, CheckCircle2, XCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ScanPage({ params }: { params: Promise<{ eventId: string }> }) {
    const { eventId } = use(params);
    const router = useRouter();
    const [scanResult, setScanResult] = useState<string | null>(null);
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");
    const [guestName, setGuestName] = useState("");

    const handleScan = async (text: string) => {
        if (!text || status === "loading" || status === "success") return;

        try {
            // Parse QR Data
            // Expected format: JSON string { eventId, guestId } or just guestId
            let guestId = text;
            try {
                const data = JSON.parse(text);
                if (data.eventId && data.eventId !== eventId) {
                    setStatus("error");
                    setMessage("Este pase es de otro evento.");
                    return;
                }
                guestId = data.guestId || text;
            } catch (e) {
                // Not JSON, assume it's just the ID
                console.log("QR is not JSON, using raw text as ID", e);
            }

            setStatus("loading");
            setMessage("Verificando...");

            const guestRef = doc(db, "events", eventId, "guests", guestId);
            const guestSnap = await getDoc(guestRef);

            if (!guestSnap.exists()) {
                setStatus("error");
                setMessage("Invitado no encontrado.");
                return;
            }

            const guestData = guestSnap.data();
            setGuestName(guestData.name);

            if (guestData.attended) {
                setStatus("error");
                setMessage(`¡${guestData.name} ya hizo check-in antes!`);
                return;
            }

            // Mark as attended
            await updateDoc(guestRef, {
                attended: true,
                attendedAt: new Date()
            });

            setStatus("success");
            setMessage(`¡Bienvenido/a ${guestData.name}!`);

            // Reset after 3 seconds to scan next
            setTimeout(() => {
                setStatus("idle");
                setScanResult(null);
                setMessage("");
                setGuestName("");
            }, 3000);

        } catch (error) {
            console.error("Scan error:", error);
            setStatus("error");
            setMessage("Error al procesar el código.");
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            {/* Header */}
            <div className="p-4 flex items-center gap-4 bg-gray-900 border-b border-gray-800">
                <Link href={`/dashboard/${eventId}`} className="p-2 bg-gray-800 rounded-full hover:bg-gray-700">
                    <ArrowLeft size={20} />
                </Link>
                <h1 className="font-bold text-lg">Escanear Entradas</h1>
            </div>

            {/* Scanner Area */}
            <div className="flex-1 flex flex-col items-center justify-center p-4 relative overflow-hidden">
                <div className="w-full max-w-sm aspect-square bg-gray-900 rounded-3xl overflow-hidden relative shadow-2xl border border-gray-800">
                    {status === "idle" || status === "loading" ? (
                        <Scanner
                            onScan={(result) => result[0] && handleScan(result[0].rawValue)}
                            components={{
                                onOff: false,
                                torch: true,
                                zoom: false,
                                finder: true,
                            }}
                            styles={{
                                container: { width: "100%", height: "100%" }
                            }}
                        />
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 z-10 p-6 text-center animate-in fade-in">
                            {status === "success" ? (
                                <>
                                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-green-500/50">
                                        <CheckCircle2 size={40} className="text-white" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-green-400">¡Acceso Permitido!</h2>
                                    <p className="text-gray-300 mt-2 text-lg">{guestName}</p>
                                    <p className="text-gray-500 text-sm mt-8">Escaneando siguiente...</p>
                                </>
                            ) : (
                                <>
                                    <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-red-500/50">
                                        <XCircle size={40} className="text-white" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-red-400">¡Alerta!</h2>
                                    <p className="text-gray-300 mt-2 text-lg">{message}</p>
                                    <button
                                        onClick={() => setStatus("idle")}
                                        className="mt-8 px-6 py-2 bg-gray-800 rounded-full text-sm font-bold hover:bg-gray-700 transition"
                                    >
                                        Intentar de nuevo
                                    </button>
                                </>
                            )}
                        </div>
                    )}

                    {/* Loading Overlay */}
                    {status === "loading" && (
                        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-20 backdrop-blur-sm">
                            <Loader2 className="animate-spin text-white mb-2" size={40} />
                            <p className="font-medium">{message}</p>
                        </div>
                    )}
                </div>

                <p className="text-center text-gray-500 mt-8 text-sm">
                    Apunta la cámara al código QR del invitado.
                </p>
            </div>
        </div>
    );
}
