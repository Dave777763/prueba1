"use client";

import { useState, useRef, useCallback } from "react";
import {
    Download,
    Sparkles,
    Eye,
    ChevronRight,
    ChevronLeft,
    Type,
    Image as ImageIcon,
    Palette,
    Calendar,
    MapPin,
    Users,
    QrCode,
    Loader2,
    Check,
    RotateCcw,
    Share2,
    MessageCircle,
    Smartphone
} from "lucide-react";
import QRCode from "react-qr-code";
import {
    invitationTemplates,
    eventTypes,
    getTemplatesByType,
    getTemplate,
    type EventType,
    type InvitationTemplate,
} from "@/lib/invitationTemplates";

interface InvitationGeneratorProps {
    eventId: string;
    eventName: string;
    eventDate: string;
    eventLocation: string;
    guests: {
        id: string;
        name: string;
        group: string;
        passes: number;
        status: string;
    }[];
}

interface InvitationData {
    templateId: string;
    customTitle: string;
    customSubtitle: string;
    customMessage: string;
    showQR: boolean;
    showSchedule: boolean;
    hostNames: string;
}

export default function InvitationGenerator({
    eventId,
    eventName,
    eventDate,
    eventLocation,
    guests,
}: InvitationGeneratorProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [selectedEventType, setSelectedEventType] = useState<EventType>("boda");
    const [selectedTemplate, setSelectedTemplate] = useState<InvitationTemplate>(
        invitationTemplates[0]
    );
    const [invData, setInvData] = useState<InvitationData>({
        templateId: invitationTemplates[0].id,
        customTitle: eventName,
        customSubtitle: invitationTemplates[0].subtitle,
        customMessage: invitationTemplates[0].defaultMessage,
        showQR: true,
        showSchedule: true,
        hostNames: "",
    });
    const [selectedGuestId, setSelectedGuestId] = useState<string>(guests[0]?.id || "");
    const [isGenerating, setIsGenerating] = useState(false);
    const [generated, setGenerated] = useState(false);

    const currentGuest = guests.find((g) => g.id === selectedGuestId);

    const handleSelectTemplate = (template: InvitationTemplate) => {
        setSelectedTemplate(template);
        setInvData((prev) => ({
            ...prev,
            templateId: template.id,
            customSubtitle: template.subtitle,
            customMessage: template.defaultMessage,
        }));
    };

    const handleEventTypeChange = (type: EventType) => {
        setSelectedEventType(type);
        const templates = getTemplatesByType(type);
        if (templates.length > 0) {
            handleSelectTemplate(templates[0]);
        }
    };

    const filteredTemplates = getTemplatesByType(selectedEventType);

    const handleDownload = useCallback(async () => {
        if (!cardRef.current) return;
        setIsGenerating(true);
        try {
            // Dynamic import to avoid SSR issues
            const html2canvas = (await import("html2canvas-pro")).default;
            const canvas = await html2canvas(cardRef.current, {
                scale: 3,
                useCORS: true,
                backgroundColor: null,
                logging: false,
            });

            const link = document.createElement("a");
            link.download = `invitacion-${currentGuest?.name || "evento"}.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
            setGenerated(true);
            setTimeout(() => setGenerated(false), 3000);
        } catch (error) {
            console.error("Error generating image:", error);
            alert("Error al generar la imagen. Inténtalo de nuevo.");
        } finally {
            setIsGenerating(false);
        }
    }, [currentGuest?.name]);

    const getBaseUrl = () => {
        return process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
    };

    // Share natively (mobile) - sends image as attachment
    const handleShareNative = useCallback(async () => {
        if (!cardRef.current || !currentGuest) return;
        setIsGenerating(true);
        try {
            const html2canvas = (await import("html2canvas-pro")).default;
            const canvas = await html2canvas(cardRef.current, {
                scale: 2,
                useCORS: true,
                backgroundColor: null,
                logging: false,
            });

            canvas.toBlob(async (blob) => {
                if (!blob) return;
                const file = new File([blob], `invitacion-${currentGuest.name}.png`, {
                    type: "image/png",
                });

                if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                    try {
                        await navigator.share({
                            title: `Invitación: ${invData.customTitle}`,
                            text: `¡Hola ${currentGuest.name}! Aquí tienes tu invitación para ${invData.customTitle}.`,
                            files: [file],
                        });
                    } catch (err) {
                        console.log("Share cancelled", err);
                    }
                } else {
                    // Fallback: download the image
                    const link = document.createElement("a");
                    link.download = `invitacion-${currentGuest.name}.png`;
                    link.href = canvas.toDataURL("image/png");
                    link.click();
                }
                setIsGenerating(false);
            }, "image/png");
        } catch (error) {
            console.error("Error:", error);
            setIsGenerating(false);
        }
    }, [currentGuest, invData.customTitle]);

    // Share via WhatsApp (Web + Mobile) - downloads image + opens WhatsApp with message
    const handleShareWhatsApp = useCallback(async () => {
        if (!cardRef.current || !currentGuest) return;
        setIsGenerating(true);
        try {
            const html2canvas = (await import("html2canvas-pro")).default;
            const canvas = await html2canvas(cardRef.current, {
                scale: 2,
                useCORS: true,
                backgroundColor: null,
                logging: false,
            });

            // First, download the image so the user has it
            const link = document.createElement("a");
            link.download = `invitacion-${currentGuest.name}.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();

            // Build the invitation link for this guest
            const invitationLink = `${getBaseUrl()}/invitacion/${eventId}/${currentGuest.id}`;

            // Build WhatsApp message
            const message = `*¡Hola ${currentGuest.name}!* 👋\n\n` +
                `Te invitamos cordialmente a:\n` +
                `*${invData.customTitle.toUpperCase()}* 🎉\n\n` +
                `📅 ${formatDate(eventDate)}\n` +
                `📍 ${eventLocation}\n\n` +
                `Confirma tu asistencia y ve todos los detalles aquí:\n${invitationLink}\n\n` +
                `📎 *Tu invitación personalizada se descargó como imagen, adjúntala a este mensaje.*\n\n` +
                `¡Te esperamos! ✨`;

            // Determine if we're on mobile or desktop
            const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

            // Use WhatsApp Web for desktop, wa.me for mobile
            const whatsappUrl = isMobile
                ? `https://wa.me/?text=${encodeURIComponent(message)}`
                : `https://web.whatsapp.com/send?text=${encodeURIComponent(message)}`;

            // Small delay to let the download start
            setTimeout(() => {
                window.open(whatsappUrl, '_blank');
            }, 500);

        } catch (error) {
            console.error("Error:", error);
        } finally {
            setIsGenerating(false);
        }
    }, [currentGuest, invData.customTitle, eventId, eventDate, eventLocation]);

    // Format date nicely
    const formatDate = (dateStr: string) => {
        try {
            const date = new Date(dateStr + "T00:00:00");
            return date.toLocaleDateString("es-MX", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        } catch {
            return dateStr;
        }
    };

    return (
        <div className="space-y-8">
            {/* Step Indicator */}
            <div className="flex items-center justify-center gap-2">
                {[1, 2, 3].map((s) => (
                    <button
                        key={s}
                        onClick={() => setStep(s as 1 | 2 | 3)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 ${step === s
                            ? "bg-rose-600 text-white shadow-lg shadow-rose-200 scale-105"
                            : step > s
                                ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                                : "bg-gray-100 text-gray-400"
                            }`}
                    >
                        {step > s ? (
                            <Check size={14} />
                        ) : (
                            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">
                                {s}
                            </span>
                        )}
                        {s === 1 && "Tipo y Plantilla"}
                        {s === 2 && "Personalizar"}
                        {s === 3 && "Generar"}
                    </button>
                ))}
            </div>

            {/* ======== STEP 1: Select Event Type + Template ======== */}
            {step === 1 && (
                <div className="space-y-8 animate-fadeIn">
                    {/* Event Type Selector */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Sparkles size={20} className="text-rose-500" />
                            Tipo de Evento
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                            {eventTypes.map((type) => (
                                <button
                                    key={type.value}
                                    onClick={() => handleEventTypeChange(type.value)}
                                    className={`p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-2 hover:scale-105 ${selectedEventType === type.value
                                        ? "border-rose-500 bg-rose-50 shadow-lg shadow-rose-100"
                                        : "border-gray-200 bg-white hover:border-gray-300"
                                        }`}
                                >
                                    <span className="text-3xl">{type.icon}</span>
                                    <span
                                        className={`text-sm font-bold ${selectedEventType === type.value
                                            ? "text-rose-600"
                                            : "text-gray-600"
                                            }`}
                                    >
                                        {type.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Template Picker */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Palette size={20} className="text-purple-500" />
                            Elige tu Plantilla
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredTemplates.map((template) => (
                                <button
                                    key={template.id}
                                    onClick={() => handleSelectTemplate(template)}
                                    className={`group relative overflow-hidden rounded-2xl transition-all duration-300 hover:scale-[1.02] ${selectedTemplate.id === template.id
                                        ? "ring-4 ring-rose-500 ring-offset-2 shadow-xl"
                                        : "border-2 border-gray-200 hover:border-gray-300 shadow-sm"
                                        }`}
                                >
                                    {/* Mini preview card */}
                                    <div
                                        className="p-6 min-h-[200px] flex flex-col items-center justify-center text-center relative"
                                        style={{
                                            background: template.bgGradient,
                                        }}
                                    >
                                        {/* Ornament */}
                                        <span className="absolute top-3 right-3 text-2xl opacity-50">
                                            {template.ornamentEmoji}
                                        </span>
                                        <span className="absolute bottom-3 left-3 text-2xl opacity-50 transform rotate-180">
                                            {template.ornamentEmoji}
                                        </span>

                                        <span className="text-4xl mb-3">{template.icon}</span>
                                        <h4
                                            className="text-lg font-bold mb-1"
                                            style={{ color: template.textColor }}
                                        >
                                            {template.name}
                                        </h4>
                                        <p
                                            className="text-sm italic"
                                            style={{ color: template.accentColor }}
                                        >
                                            {template.subtitle}
                                        </p>

                                        {/* Check overlay */}
                                        {selectedTemplate.id === template.id && (
                                            <div className="absolute inset-0 bg-rose-500/10 flex items-center justify-center">
                                                <div className="w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg">
                                                    <Check size={20} />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Label */}
                                    <div
                                        className={`px-4 py-2 text-xs font-bold text-center ${selectedTemplate.id === template.id
                                            ? "bg-rose-500 text-white"
                                            : "bg-white text-gray-500"
                                            }`}
                                    >
                                        {template.eventTypeLabel}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            onClick={() => setStep(2)}
                            className="px-8 py-3 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 transition flex items-center gap-2 shadow-lg shadow-rose-200"
                        >
                            Siguiente <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            )}

            {/* ======== STEP 2: Customize Invitation ======== */}
            {step === 2 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fadeIn">
                    {/* Form Side */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <Type size={20} className="text-indigo-500" />
                            Personaliza tu Invitación
                        </h3>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">
                                Título del Evento
                            </label>
                            <input
                                type="text"
                                value={invData.customTitle}
                                onChange={(e) =>
                                    setInvData({ ...invData, customTitle: e.target.value })
                                }
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-rose-500 outline-none transition text-gray-800"
                                placeholder="Ej. Boda de Ana y Carlos"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">
                                Subtítulo / Frase
                            </label>
                            <input
                                type="text"
                                value={invData.customSubtitle}
                                onChange={(e) =>
                                    setInvData({ ...invData, customSubtitle: e.target.value })
                                }
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-rose-500 outline-none transition text-gray-800"
                                placeholder="Ej. ¡Nos casamos!"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">
                                Nombres de los anfitriones (opcional)
                            </label>
                            <input
                                type="text"
                                value={invData.hostNames}
                                onChange={(e) =>
                                    setInvData({ ...invData, hostNames: e.target.value })
                                }
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-rose-500 outline-none transition text-gray-800"
                                placeholder="Ej. Ana García & Carlos López"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">
                                Mensaje de Invitación
                            </label>
                            <textarea
                                rows={3}
                                value={invData.customMessage}
                                onChange={(e) =>
                                    setInvData({ ...invData, customMessage: e.target.value })
                                }
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-rose-500 outline-none transition resize-none text-gray-800"
                                placeholder="Escribe un mensaje personalizado..."
                            />
                        </div>

                        <div className="flex items-center gap-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={invData.showQR}
                                    onChange={(e) =>
                                        setInvData({ ...invData, showQR: e.target.checked })
                                    }
                                    className="w-5 h-5 rounded accent-rose-500"
                                />
                                <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                    <QrCode size={16} /> Incluir QR
                                </span>
                            </label>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setStep(1)}
                                className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition flex items-center gap-2"
                            >
                                <ChevronLeft size={18} /> Anterior
                            </button>
                            <button
                                onClick={() => setStep(3)}
                                className="flex-1 px-6 py-3 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 transition flex items-center justify-center gap-2 shadow-lg shadow-rose-200"
                            >
                                Vista Previa <Eye size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Live Mini Preview */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <Eye size={20} className="text-emerald-500" />
                            Vista Previa en Vivo
                        </h3>
                        <div className="bg-gray-100 rounded-2xl p-6 flex justify-center items-start">
                            <div
                                className="w-full max-w-[300px] rounded-2xl shadow-xl overflow-hidden transform scale-[0.85] origin-top"
                                style={{
                                    background: selectedTemplate.bgGradient,
                                }}
                            >
                                <div
                                    className="p-6 text-center space-y-3"
                                    style={{
                                        backgroundColor: selectedTemplate.cardBg,
                                        margin: "12px",
                                        borderRadius: "16px",
                                        border: selectedTemplate.borderStyle,
                                    }}
                                >
                                    <span className="text-3xl">{selectedTemplate.icon}</span>
                                    <p
                                        className="text-xs font-bold uppercase tracking-[0.15em]"
                                        style={{ color: selectedTemplate.accentColor }}
                                    >
                                        {selectedTemplate.eventTypeLabel}
                                    </p>
                                    <h4
                                        className="text-xl font-bold leading-tight"
                                        style={{ color: selectedTemplate.textColor }}
                                    >
                                        {invData.customTitle || "Título del Evento"}
                                    </h4>
                                    <p
                                        className="text-lg italic"
                                        style={{ color: selectedTemplate.accentColor }}
                                    >
                                        {invData.customSubtitle}
                                    </p>
                                    {invData.hostNames && (
                                        <p
                                            className="text-sm font-medium"
                                            style={{ color: selectedTemplate.textColorLight }}
                                        >
                                            {invData.hostNames}
                                        </p>
                                    )}
                                    <p
                                        className="text-xs leading-relaxed"
                                        style={{ color: selectedTemplate.textColorLight }}
                                    >
                                        {invData.customMessage}
                                    </p>
                                    <div className="flex items-center justify-center gap-2 text-xs" style={{ color: selectedTemplate.textColorLight }}>
                                        <Calendar size={12} />
                                        <span>{formatDate(eventDate)}</span>
                                    </div>
                                    <div className="flex items-center justify-center gap-2 text-xs" style={{ color: selectedTemplate.textColorLight }}>
                                        <MapPin size={12} />
                                        <span>{eventLocation}</span>
                                    </div>
                                    {invData.showQR && (
                                        <div className="pt-2 flex flex-col items-center">
                                            <div
                                                className="p-2 rounded-lg border"
                                                style={{
                                                    borderColor: selectedTemplate.accentColor + "30",
                                                    backgroundColor: "white",
                                                }}
                                            >
                                                <QrCode size={40} style={{ color: selectedTemplate.accentColor }} />
                                            </div>
                                            <p className="text-[10px] mt-1" style={{ color: selectedTemplate.textColorLight }}>
                                                Código QR de entrada
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ======== STEP 3: Generate & Download ======== */}
            {step === 3 && (
                <div className="space-y-8 animate-fadeIn">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Controls */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <Users size={20} className="text-blue-500" />
                                Seleccionar Invitado
                            </h3>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Generar invitación para:
                                </label>
                                <select
                                    value={selectedGuestId}
                                    onChange={(e) => setSelectedGuestId(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-rose-500 outline-none transition bg-white text-gray-800"
                                >
                                    {guests.map((g) => (
                                        <option key={g.id} value={g.id}>
                                            {g.name} — {g.group || "Sin grupo"} ({g.passes} pases)
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {currentGuest && (
                                <div
                                    className="p-4 rounded-xl border"
                                    style={{
                                        backgroundColor: selectedTemplate.accentColorLight,
                                        borderColor: selectedTemplate.accentColor + "30",
                                    }}
                                >
                                    <p className="text-sm font-bold" style={{ color: selectedTemplate.accentColor }}>
                                        Invitado seleccionado:
                                    </p>
                                    <p className="text-lg font-bold" style={{ color: selectedTemplate.textColor }}>
                                        {currentGuest.name}
                                    </p>
                                    <p className="text-sm" style={{ color: selectedTemplate.textColorLight }}>
                                        {currentGuest.group} • {currentGuest.passes} pases
                                    </p>
                                </div>
                            )}

                            <div className="space-y-3">
                                <button
                                    onClick={handleDownload}
                                    disabled={isGenerating || !currentGuest}
                                    className="w-full py-4 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 transition flex items-center justify-center gap-2 shadow-xl shadow-rose-200 disabled:opacity-50"
                                >
                                    {isGenerating ? (
                                        <>
                                            <Loader2 size={20} className="animate-spin" />
                                            Generando...
                                        </>
                                    ) : generated ? (
                                        <>
                                            <Check size={20} />
                                            ¡Descargada!
                                        </>
                                    ) : (
                                        <>
                                            <Download size={20} />
                                            Descargar Invitación
                                        </>
                                    )}
                                </button>

                                {/* WhatsApp Button - works on both Web and Mobile */}
                                <button
                                    onClick={handleShareWhatsApp}
                                    disabled={isGenerating || !currentGuest}
                                    className="w-full py-4 bg-[#25D366] text-white rounded-xl font-bold hover:bg-[#1ebe57] transition flex items-center justify-center gap-2 shadow-xl shadow-emerald-200 disabled:opacity-50"
                                >
                                    <MessageCircle size={20} />
                                    Enviar por WhatsApp
                                </button>

                                {/* Native Share (mostly mobile) */}
                                <button
                                    onClick={handleShareNative}
                                    disabled={isGenerating || !currentGuest}
                                    className="w-full py-3 bg-gray-800 text-white rounded-xl font-bold hover:bg-gray-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    <Share2 size={18} />
                                    Compartir (Otras Apps)
                                </button>
                            </div>

                            <button
                                onClick={() => setStep(2)}
                                className="w-full py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition flex items-center justify-center gap-2"
                            >
                                <RotateCcw size={16} /> Editar diseño
                            </button>
                        </div>

                        {/* Full Preview Card */}
                        <div className="lg:col-span-2 flex flex-col items-center">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <ImageIcon size={20} className="text-rose-500" />
                                Invitación Final
                            </h3>

                            <div className="bg-gray-100 rounded-2xl p-8 flex justify-center w-full">
                                {/* ===== THE ACTUAL DOWNLOADABLE CARD ===== */}
                                <div
                                    ref={cardRef}
                                    className="w-full max-w-[480px] rounded-3xl overflow-hidden shadow-2xl"
                                    style={{
                                        background: selectedTemplate.bgGradient,
                                    }}
                                >
                                    {/* Decorative ornaments */}
                                    <div className="relative px-2 pt-2 pb-0">
                                        {/* Top ornaments row */}
                                        <div className="flex justify-between px-4 pt-4 text-2xl opacity-40">
                                            <span>{selectedTemplate.ornamentEmoji}</span>
                                            <span>{selectedTemplate.ornamentEmoji}</span>
                                        </div>
                                    </div>

                                    {/* Main Card Content */}
                                    <div
                                        className="mx-4 mb-4 rounded-2xl p-8 text-center space-y-5"
                                        style={{
                                            backgroundColor: selectedTemplate.cardBg,
                                            border: selectedTemplate.borderStyle,
                                        }}
                                    >
                                        {/* Icon */}
                                        <div className="flex justify-center">
                                            <span className="text-5xl">{selectedTemplate.icon}</span>
                                        </div>

                                        {/* Event Type Label */}
                                        <p
                                            className="text-xs font-bold uppercase tracking-[0.2em]"
                                            style={{ color: selectedTemplate.accentColor }}
                                        >
                                            {selectedTemplate.eventTypeLabel.replace(/^.+\s/, '')}
                                        </p>

                                        {/* Title */}
                                        <h2
                                            className="text-3xl md:text-4xl font-bold leading-tight"
                                            style={{
                                                color: selectedTemplate.textColor,
                                                fontFamily: "'Playfair Display', serif",
                                            }}
                                        >
                                            {invData.customTitle}
                                        </h2>

                                        {/* Subtitle */}
                                        <p
                                            className="text-xl md:text-2xl italic"
                                            style={{
                                                color: selectedTemplate.accentColor,
                                                fontFamily: "'Great Vibes', cursive",
                                            }}
                                        >
                                            {invData.customSubtitle}
                                        </p>

                                        {/* Host Names */}
                                        {invData.hostNames && (
                                            <p
                                                className="text-base font-semibold tracking-wide"
                                                style={{ color: selectedTemplate.textColor }}
                                            >
                                                {invData.hostNames}
                                            </p>
                                        )}

                                        {/* Divider */}
                                        <div className="flex items-center justify-center gap-4">
                                            <div
                                                className="flex-1 h-px"
                                                style={{ backgroundColor: selectedTemplate.accentColor + "30" }}
                                            />
                                            <span className="text-lg">{selectedTemplate.ornamentEmoji}</span>
                                            <div
                                                className="flex-1 h-px"
                                                style={{ backgroundColor: selectedTemplate.accentColor + "30" }}
                                            />
                                        </div>

                                        {/* Message */}
                                        <p
                                            className="text-sm leading-relaxed max-w-[380px] mx-auto"
                                            style={{ color: selectedTemplate.textColorLight }}
                                        >
                                            {invData.customMessage}
                                        </p>

                                        {/* Guest Banner */}
                                        {currentGuest && (
                                            <div
                                                className="p-4 rounded-xl border"
                                                style={{
                                                    backgroundColor: selectedTemplate.accentColorLight,
                                                    borderColor: selectedTemplate.accentColor + "25",
                                                }}
                                            >
                                                <p
                                                    className="text-xs font-bold uppercase tracking-[0.15em] mb-1"
                                                    style={{ color: selectedTemplate.accentColor }}
                                                >
                                                    Invitado Especial
                                                </p>
                                                <p
                                                    className="text-xl font-bold"
                                                    style={{
                                                        color: selectedTemplate.textColor,
                                                        fontFamily: "'Playfair Display', serif",
                                                    }}
                                                >
                                                    {currentGuest.name}
                                                </p>
                                                <p
                                                    className="text-xs mt-1"
                                                    style={{ color: selectedTemplate.textColorLight }}
                                                >
                                                    {currentGuest.passes}{" "}
                                                    {currentGuest.passes === 1 ? "pase" : "pases"} incluidos
                                                </p>
                                            </div>
                                        )}

                                        {/* Event Details */}
                                        <div className="space-y-3">
                                            <div
                                                className="flex items-center justify-center gap-3 text-sm"
                                                style={{ color: selectedTemplate.textColor }}
                                            >
                                                <Calendar size={16} style={{ color: selectedTemplate.accentColor }} />
                                                <span className="font-semibold">{formatDate(eventDate)}</span>
                                            </div>
                                            <div
                                                className="flex items-center justify-center gap-3 text-sm"
                                                style={{ color: selectedTemplate.textColor }}
                                            >
                                                <MapPin size={16} style={{ color: selectedTemplate.accentColor }} />
                                                <span className="font-semibold">{eventLocation}</span>
                                            </div>
                                        </div>

                                        {/* QR Code */}
                                        {invData.showQR && currentGuest && (
                                            <div className="pt-2">
                                                <div
                                                    className="inline-flex flex-col items-center p-4 rounded-xl border"
                                                    style={{
                                                        borderColor: selectedTemplate.accentColor + "20",
                                                        backgroundColor: "white",
                                                    }}
                                                >
                                                    <p
                                                        className="text-[10px] font-bold uppercase tracking-[0.15em] mb-2"
                                                        style={{ color: selectedTemplate.accentColor }}
                                                    >
                                                        Tu Pase de Entrada
                                                    </p>
                                                    <QRCode
                                                        value={JSON.stringify({
                                                            eventId,
                                                            guestId: currentGuest.id,
                                                        })}
                                                        size={120}
                                                        fgColor={selectedTemplate.accentColor}
                                                        style={{
                                                            height: "auto",
                                                            maxWidth: "100%",
                                                            width: "120px",
                                                        }}
                                                        viewBox="0 0 120 120"
                                                    />
                                                    <p
                                                        className="text-[10px] mt-2"
                                                        style={{ color: selectedTemplate.textColorLight }}
                                                    >
                                                        Muestra este código en la entrada
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Bottom ornaments */}
                                    <div className="flex justify-between px-6 pb-4 text-2xl opacity-40">
                                        <span className="transform rotate-180">{selectedTemplate.ornamentEmoji}</span>
                                        <span className="transform rotate-180">{selectedTemplate.ornamentEmoji}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
