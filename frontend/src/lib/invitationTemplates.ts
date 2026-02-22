// Templates de invitación para diferentes tipos de eventos

export interface InvitationTemplate {
    id: string;
    name: string;
    eventType: 'boda' | 'quinceanera' | 'cumpleanos' | 'bautizo' | 'graduacion' | 'general';
    eventTypeLabel: string;
    subtitle: string;
    icon: string; // emoji
    bgGradient: string;
    accentColor: string;
    accentColorLight: string;
    borderStyle: string;
    ornamentEmoji: string;
    defaultMessage: string;
    cardBg: string;
    textColor: string;
    textColorLight: string;
}

export const invitationTemplates: InvitationTemplate[] = [
    // === BODAS ===
    {
        id: 'boda-clasica',
        name: 'Boda Clásica',
        eventType: 'boda',
        eventTypeLabel: '💒 Boda',
        subtitle: '¡Nos casamos!',
        icon: '💍',
        bgGradient: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 30%, #fbcfe8 70%, #f9a8d4 100%)',
        accentColor: '#be123c',
        accentColorLight: '#ffe4e6',
        borderStyle: '2px solid #fecdd3',
        ornamentEmoji: '🌹',
        defaultMessage: 'Con la bendición de Dios y de nuestros padres, tenemos el honor de invitarle a nuestra boda.',
        cardBg: 'rgba(255, 255, 255, 0.95)',
        textColor: '#1f2937',
        textColorLight: '#6b7280',
    },
    {
        id: 'boda-elegante',
        name: 'Boda Elegante',
        eventType: 'boda',
        eventTypeLabel: '💒 Boda',
        subtitle: 'Unimos nuestras vidas',
        icon: '✨',
        bgGradient: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 30%, #cbd5e1 70%, #94a3b8 100%)',
        accentColor: '#1e3a8a',
        accentColorLight: '#dbeafe',
        borderStyle: '2px solid #bfdbfe',
        ornamentEmoji: '🕊️',
        defaultMessage: 'Nos complace invitarle a celebrar junto a nosotros el día más especial de nuestras vidas.',
        cardBg: 'rgba(255, 255, 255, 0.97)',
        textColor: '#0f172a',
        textColorLight: '#475569',
    },
    {
        id: 'boda-rustica',
        name: 'Boda Rústica',
        eventType: 'boda',
        eventTypeLabel: '💒 Boda',
        subtitle: '¡Nos casamos!',
        icon: '🌿',
        bgGradient: 'linear-gradient(135deg, #fefce8 0%, #fef3c7 30%, #fde68a 70%, #fbbf24 100%)',
        accentColor: '#92400e',
        accentColorLight: '#fef3c7',
        borderStyle: '2px solid #fde68a',
        ornamentEmoji: '🌻',
        defaultMessage: 'Con mucha alegría los invitamos a compartir este momento tan especial.',
        cardBg: 'rgba(255, 251, 235, 0.95)',
        textColor: '#292524',
        textColorLight: '#78716c',
    },

    // === QUINCEAÑOS ===
    {
        id: 'xv-princesa',
        name: 'XV Princesa',
        eventType: 'quinceanera',
        eventTypeLabel: '👑 Quinceaños',
        subtitle: 'Mis XV Años',
        icon: '👑',
        bgGradient: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 30%, #e9d5ff 70%, #c084fc 100%)',
        accentColor: '#7c3aed',
        accentColorLight: '#ede9fe',
        borderStyle: '2px solid #ddd6fe',
        ornamentEmoji: '🦋',
        defaultMessage: 'Con la bendición de Dios y de mis padres, me es grato invitarte a celebrar mis XV Años.',
        cardBg: 'rgba(255, 255, 255, 0.95)',
        textColor: '#1e1b4b',
        textColorLight: '#6b7280',
    },
    {
        id: 'xv-rosa',
        name: 'XV Rosa Dorado',
        eventType: 'quinceanera',
        eventTypeLabel: '👑 Quinceaños',
        subtitle: 'Mis XV Años',
        icon: '🌸',
        bgGradient: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 30%, #fecdd3 70%, #fda4af 100%)',
        accentColor: '#e11d48',
        accentColorLight: '#fff1f2',
        borderStyle: '2px solid #fecdd3',
        ornamentEmoji: '💎',
        defaultMessage: 'Te invito a celebrar conmigo esta etapa tan especial en mi vida. ¡Mis XV Años!',
        cardBg: 'rgba(255, 255, 255, 0.95)',
        textColor: '#1c1917',
        textColorLight: '#78716c',
    },
    {
        id: 'xv-moderno',
        name: 'XV Moderno',
        eventType: 'quinceanera',
        eventTypeLabel: '👑 Quinceaños',
        subtitle: 'XV Años',
        icon: '🎀',
        bgGradient: 'linear-gradient(135deg, #fdf4ff 0%, #fae8ff 30%, #f0abfc 50%, #e879f9 100%)',
        accentColor: '#a21caf',
        accentColorLight: '#fae8ff',
        borderStyle: '2px solid #f0abfc',
        ornamentEmoji: '✨',
        defaultMessage: 'Estoy emocionada de invitarte a celebrar mis XV Años. ¡Te espero!',
        cardBg: 'rgba(255, 255, 255, 0.96)',
        textColor: '#1e1b4b',
        textColorLight: '#6b7280',
    },

    // === CUMPLEAÑOS ===
    {
        id: 'cumple-fiesta',
        name: 'Fiesta de Cumple',
        eventType: 'cumpleanos',
        eventTypeLabel: '🎂 Cumpleaños',
        subtitle: '¡Estás invitado!',
        icon: '🎉',
        bgGradient: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 30%, #fbbf24 60%, #f59e0b 100%)',
        accentColor: '#d97706',
        accentColorLight: '#fef3c7',
        borderStyle: '2px solid #fde68a',
        ornamentEmoji: '🎈',
        defaultMessage: '¡Te invito a celebrar mi cumpleaños! Ven y pásala increíble conmigo.',
        cardBg: 'rgba(255, 255, 255, 0.95)',
        textColor: '#1c1917',
        textColorLight: '#78716c',
    },
    {
        id: 'cumple-elegante',
        name: 'Cumple Elegante',
        eventType: 'cumpleanos',
        eventTypeLabel: '🎂 Cumpleaños',
        subtitle: 'Celebración Especial',
        icon: '🥂',
        bgGradient: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 30%, #86efac 70%, #4ade80 100%)',
        accentColor: '#15803d',
        accentColorLight: '#dcfce7',
        borderStyle: '2px solid #bbf7d0',
        ornamentEmoji: '🍾',
        defaultMessage: 'Quisiera compartir contigo un día muy especial. ¡Te espero en mi celebración!',
        cardBg: 'rgba(255, 255, 255, 0.96)',
        textColor: '#14532d',
        textColorLight: '#6b7280',
    },

    // === BAUTIZO ===
    {
        id: 'bautizo-angelical',
        name: 'Bautizo Angelical',
        eventType: 'bautizo',
        eventTypeLabel: '⛪ Bautizo',
        subtitle: 'Mi Bautizo',
        icon: '👼',
        bgGradient: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 30%, #bfdbfe 70%, #93c5fd 100%)',
        accentColor: '#1d4ed8',
        accentColorLight: '#dbeafe',
        borderStyle: '2px solid #bfdbfe',
        ornamentEmoji: '✝️',
        defaultMessage: 'Con gran alegría les invitamos al Bautizo de nuestro(a) pequeño(a).',
        cardBg: 'rgba(255, 255, 255, 0.96)',
        textColor: '#1e3a5f',
        textColorLight: '#64748b',
    },

    // === GRADUACIÓN ===
    {
        id: 'graduacion-clasica',
        name: 'Graduación',
        eventType: 'graduacion',
        eventTypeLabel: '🎓 Graduación',
        subtitle: '¡Me gradúo!',
        icon: '🎓',
        bgGradient: 'linear-gradient(135deg, #fef9c3 0%, #fef08a 30%, #facc15 60%, #eab308 100%)',
        accentColor: '#854d0e',
        accentColorLight: '#fef9c3',
        borderStyle: '2px solid #fef08a',
        ornamentEmoji: '📜',
        defaultMessage: 'Con mucho orgullo te invito a celebrar mi graduación. ¡Lo logramos!',
        cardBg: 'rgba(255, 255, 255, 0.95)',
        textColor: '#1c1917',
        textColorLight: '#78716c',
    },

    // === GENERAL ===
    {
        id: 'evento-general',
        name: 'Evento Especial',
        eventType: 'general',
        eventTypeLabel: '🎊 Evento',
        subtitle: '¡Estás invitado!',
        icon: '🎊',
        bgGradient: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 30%, #bae6fd 70%, #7dd3fc 100%)',
        accentColor: '#0369a1',
        accentColorLight: '#e0f2fe',
        borderStyle: '2px solid #bae6fd',
        ornamentEmoji: '⭐',
        defaultMessage: '¡Te invitamos a un evento muy especial! Tu presencia hará la diferencia.',
        cardBg: 'rgba(255, 255, 255, 0.96)',
        textColor: '#0c4a6e',
        textColorLight: '#64748b',
    },
];

export type EventType = InvitationTemplate['eventType'];

export const eventTypes: { value: EventType; label: string; icon: string }[] = [
    { value: 'boda', label: 'Boda', icon: '💒' },
    { value: 'quinceanera', label: 'Quinceaños', icon: '👑' },
    { value: 'cumpleanos', label: 'Cumpleaños', icon: '🎂' },
    { value: 'bautizo', label: 'Bautizo', icon: '⛪' },
    { value: 'graduacion', label: 'Graduación', icon: '🎓' },
    { value: 'general', label: 'Otro Evento', icon: '🎊' },
];

export const getTemplatesByType = (type: EventType): InvitationTemplate[] => {
    return invitationTemplates.filter(t => t.eventType === type);
};

export const getTemplate = (id: string): InvitationTemplate => {
    return invitationTemplates.find(t => t.id === id) || invitationTemplates[0];
};
