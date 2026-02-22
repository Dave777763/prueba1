# 🎨 Sistema de Temas y Animaciones - Invitaciones Digitales

## ✨ Nuevas Funcionalidades Implementadas

### 1. **Sistema de Temas Personalizables**

Ahora cada evento puede tener su propio estilo visual único. Hemos creado 6 temas prediseñados profesionales:

#### 📋 Temas Disponibles:

1. **Romance Rosa** 🌹
   - Estilo: Romántico
   - Colores: Rosa delicado con acentos fucsia
   - Fuentes: Playfair Display + Inter + Great Vibes
   - Ideal para: Bodas clásicas y románticas

2. **Elegancia Azul** 💎
   - Estilo: Elegante
   - Colores: Azul marino con acentos dorados
   - Fuentes: Cormorant Garamond + Montserrat + Italiana
   - Ideal para: Bodas formales y sofisticadas

3. **Moderno Esmeralda** 🌿
   - Estilo: Moderno
   - Colores: Verde esmeralda fresco
   - Fuentes: Poppins + Inter + Dancing Script
   - Ideal para: Bodas contemporáneas y naturales

4. **Rústico Terracota** 🍂
   - Estilo: Rústico
   - Colores: Tonos tierra cálidos
   - Fuentes: Libre Baskerville + Lato + Pacifico
   - Ideal para: Bodas campestres y vintage

5. **Tropical Coral** 🌺
   - Estilo: Tropical
   - Colores: Coral vibrante con naranja
   - Fuentes: Lobster + Nunito + Satisfy
   - Ideal para: Bodas playeras y destino

6. **Minimalista Pizarra** ⚪
   - Estilo: Minimalista
   - Colores: Tonos neutros con azul cielo
   - Fuentes: Raleway + Inter + Allura
   - Ideal para: Bodas modernas y minimalistas

### 2. **Animaciones Premium**

#### 🎭 Animaciones Implementadas:

- **Pétalos Cayendo** ❄️
  - Animación suave de pétalos flotando
  - Color personalizable según el tema
  - 25 pétalos con movimientos aleatorios
  - Efecto parallax sutil

- **Cuenta Regresiva Animada** ⏰
  - Actualización en tiempo real (días, horas, minutos, segundos)
  - Diseño adaptable al tema seleccionado
  - Efecto hover con escala
  - Números tabulares para mejor legibilidad

- **Entrada con Fade** 🌟
  - Animación de fade-in para el título
  - Escala suave para la tarjeta principal
  - Slide-up para elementos secundarios

- **Ícono Flotante** 🎈
  - Corazón animado con efecto float
  - Movimiento vertical continuo
  - Sincronizado con el tema

### 3. **Cómo Usar el Sistema de Temas**

#### En el Dashboard:

1. Abre el evento que deseas editar
2. Ve a la pestaña **"Ajustes"** ⚙️
3. En la sección **"🎨 Tema de la Invitación"**
4. Haz clic en el tema que desees aplicar
5. El tema se guarda automáticamente

#### Vista Previa en Dashboard:

Cada tarjeta de tema muestra:
- ✅ Paleta de colores (3 círculos de colores)
- ✅ Nombre y descripción del tema
- ✅ Estilo del tema (romántico, elegante, etc.)
- ✅ Indicador visual cuando está seleccionado

### 4. **Componentes Técnicos Creados**

#### Archivos Nuevos:

```
src/
├── lib/
│   └── themes.ts              # Sistema de temas con 6 paletas
├── components/
│   ├── FallingPetals.tsx      # Animación de pétalos
│   ├── Countdown.tsx          # Cuenta regresiva
│   └── ThemeSelector.tsx      # Selector de temas
└── app/
    ├── globals.css            # Animaciones CSS y fuentes Google
    └── invitacion/
        └── [eventId]/
            └── [guestId]/
                └── page.tsx   # Actualizado con temas y animaciones
```

### 5. **Características Técnicas**

#### Temas Dinámicos:
- ✅ Colores personalizables por tema
- ✅ Fuentes de Google Fonts integradas
- ✅ Aplicación automática en toda la invitación
- ✅ Guardado en Firebase
- ✅ Sin recarga de página

#### Animaciones:
- ✅ CSS Keyframes optimizados
- ✅ Hardware acceleration (GPU)
- ✅ Smooth transitions (cubic-bezier)
- ✅ Responsive en todos los dispositivos

### 6. **Próximos Pasos Sugeridos**

#### Fase 3 - Multimedia (Opcional):
- 📸 Galería de fotos de la pareja
- 🎵 Música de fondo personalizada
- 🎥 Video de invitación

#### Fase 4 - Interactividad (Opcional):
- 💬 Libro de firmas digital
- 🎤 Votación para playlist del evento
- 📋 Encuestas (preferencias de comida)

---

## 🚀 Cómo Probar

1. **Iniciar el servidor de desarrollo:**
   ```bash
   cd frontend
   npm run dev
   ```

2. **Seleccionar un tema:**
   - Ir a Dashboard → Tu Evento → Ajustes
   - Seleccionar uno de los 6 temas
   - El cambio se aplica inmediatamente

3. **Ver la invitación:**
   - Copiar enlace de invitación de un invitado
   - Abrir en una nueva pestaña
   - Observar animaciones y colores del tema

---

## 🎨 Paletas de Colores

### Romance Rosa
```
Primary:       #be123c (Rosa profundo)
Primary Light: #ffe4e6 (Rosa claro)
Accent:        #f43f5e (Fucsia)
```

### Elegancia Azul
```
Primary:       #1e3a8a (Azul marino)
Primary Light: #dbeafe (Azul claro)
Accent:        #f59e0b (Dorado)
```

### Moderno Esmeralda
```
Primary:       #047857 (Verde esmeralda)
Primary Light: #d1fae5 (Verde menta)
Accent:        #14b8a6 (Turquesa)
```

### Rústico Terracota
```
Primary:       #c2410c (Terracota)
Primary Light: #fed7aa (Durazno)
Accent:        #ea580c (Naranja)
```

### Tropical Coral
```
Primary:       #db2777 (Coral)
Primary Light: #fce7f3 (Rosa claro)
Accent:        #f97316 (Naranja vibrante)
```

### Minimalista Pizarra
```
Primary:       #475569 (Gris pizarra)
Primary Light: #f1f5f9 (Gris muy claro)
Accent:        #0ea5e9 (Azul cielo)
```

---

## 💡 Tips de Diseño

- **Romántico**: Usa Romance Rosa o Elegancia Azul
- **Moderno**: Usa Moderno Esmeralda o Minimalista Pizarra
- **Cálido**: Usa Rústico Terracota
- **Vibrante**: Usa Tropical Coral

---

**¡Las invitaciones digitales ahora son verdaderamente únicas y personalizables!** ✨
