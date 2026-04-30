# CLAUDE.md

> Este archivo es leído automáticamente por Claude Code al iniciar una sesión.
> Contiene todo el contexto necesario para que cualquier instancia de Claude
> pueda continuar el desarrollo del proyecto sin perder coherencia.

---

## 🌸 Proyecto: No Me Olvides

Plataforma web para documentar el patrimonio cultural de la España vaciada
mediante un mapa interactivo de España donde cada punto representa una
localidad rural con un audio narrado en primera persona.

- **Promotora**: María del Carmen López Rosa
- **Dominio**: pendiente de decidir (nomeolvides.es está cogido)
- **Idiomas**: español (por defecto) e inglés
- **Estado actual**: Fase 1 en desarrollo

---

## 🧭 Principios rectores (NO negociables)

1. **Autonomía de la promotora**: debe poder gestionar todo el contenido
   (añadir/editar/desactivar localidades, subir audios) sin tocar código
   ni depender del programador.

2. **Portabilidad**: el stack es estándar y bien conocido. Cualquier
   programador moderno debe poder continuar el trabajo sin reescribir nada.

3. **Documentación viva en HTML autocontenido**: cada cambio relevante
   (arquitectura, modelo de datos, configuración, decisiones) debe
   reflejarse en los archivos `docs/*.html` del proyecto.

4. **LOPD/RGPD desde el día 1**: antes de implementar cualquier
   funcionalidad nueva, evaluar su impacto en protección de datos y
   confirmar con el usuario que se cumple. Esto no es una capa que se
   añade después.

5. **Bajo coste**: priorizar tecnologías open source y servicios con free
   tier suficiente. El primer año debe costar ~12 €/año (solo dominio).

---

## 🏗️ Arquitectura

### Stack tecnológico

| Capa | Tecnología |
|---|---|
| Framework | Next.js 14+ (App Router) + TypeScript |
| Estilos | Tailwind CSS |
| Mapa | Leaflet.js + OpenStreetMap |
| i18n | next-intl |
| Base de datos | PostgreSQL (vía Supabase) |
| Auth | Supabase Auth (solo para el panel de gestión) |
| Storage | Supabase Storage (audios MP3) |
| Hosting frontend | Vercel |
| Analítica | Google Analytics 4 |
| Banner de cookies | vanilla-cookieconsent |
| Control de versiones | Git + GitHub |

### Región de datos

**Supabase debe estar configurado en `eu-central-1` (Frankfurt)** para
cumplir RGPD manteniendo los datos en territorio UE.

### Flujos principales

**Visitante**: entra en la web → ve el mapa → pincha un punto → se abre
popup con texto, reproductor de audio y enlace externo a la web turística
de la localidad. Sin login. Sin registro. 100% accesible.

**Promotora**: entra en `/admin` → login con email + contraseña → CRUD de
localidades → sube audios MP3 → cambios visibles inmediatamente en la
web pública.

---

## 📊 Modelo de datos

### Tabla `localities`

```sql
CREATE TABLE localities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  province TEXT NOT NULL,
  region TEXT NOT NULL,
  latitude NUMERIC NOT NULL,
  longitude NUMERIC NOT NULL,
  description_es TEXT NOT NULL,
  description_en TEXT NOT NULL,
  audio_url_es TEXT,
  audio_url_en TEXT,
  external_url TEXT,
  cover_image_url TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### Tabla `contact_messages`

```sql
CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,           -- ⚠️ Dato personal (RGPD)
  message TEXT NOT NULL,
  consent_given BOOLEAN NOT NULL,
  consent_timestamp TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

**Política de retención**: los mensajes se eliminan automáticamente
pasados 2 años desde su recepción (cron job en Supabase).

### Bucket Storage `audios`

- Estructura: `audios/{locality_id}/{es|en}.mp3`
- Acceso: lectura pública, escritura solo autenticada
- Tamaño máximo: 10 MB por archivo

### Row Level Security (RLS)

```sql
-- Lectura pública de localidades activas
CREATE POLICY "public_read" ON localities
  FOR SELECT USING (active = true);

-- Escritura solo para autenticados
CREATE POLICY "admin_write" ON localities
  FOR ALL USING (auth.role() = 'authenticated');

-- Mensajes: cualquiera puede insertar, solo admin puede leer
CREATE POLICY "public_insert" ON contact_messages
  FOR INSERT WITH CHECK (true);
CREATE POLICY "admin_read" ON contact_messages
  FOR SELECT USING (auth.role() = 'authenticated');
```

---

## ⚖️ Cumplimiento LOPD/RGPD

### Datos personales tratados

- Email + nombre + mensaje del formulario de contacto
- Email + contraseña (hashed) de la promotora
- Cookies analíticas de GA4 (con consentimiento previo)

### Documentos legales obligatorios

- Aviso legal (Ley 34/2002 LSSI-CE)
- Política de privacidad (RGPD art. 13)
- Política de cookies (RGPD + Guía AEPD)
- Términos y condiciones de uso (recomendable)

### Implementaciones técnicas obligatorias

- Banner de cookies con consentimiento granular (GA4 NO carga hasta aceptar)
- Anonimización de IP en GA4
- Doble check de consentimiento NO premarcado en formulario de contacto
- HTTPS obligatorio (lo da Vercel)
- Cifrado en reposo (lo da Supabase con AES-256)
- Datos en territorio europeo (Supabase Frankfurt)
- Procedimiento documentado de derecho de supresión

---

## 🗺️ Plan de Fase 1 (estado del desarrollo)

| Bloque | Descripción | Estado |
|---|---|---|
| B1 | Setup inicial: cuentas, repo, esqueleto Next.js, primer despliegue | ✅ Completado |
| B2 | Modelo de datos en Supabase: tablas, RLS, Storage, datos prueba | ✅ Completado |
| B3 | Mapa interactivo con Leaflet leyendo de Supabase | ✅ Completado |
| B4 | Diseño visual: terracota/salvia, Georgia+Arial, popup, reproductor | ⬜ Pendiente |
| B5 | i18n ES/EN + páginas estáticas (Inicio, Sobre, Contacto) | ⬜ Pendiente |
| B6 | Panel `/admin`: login + CRUD localidades + subida audios | ⬜ Pendiente |
| B7 | Formulario contacto + cookies + GA4 + páginas legales | ⬜ Pendiente |
| B8 | SEO técnico: sitemap, metadatos, Schema.org, Open Graph | ⬜ Pendiente |
| B9 | Documentación final: manual del panel + traspaso técnico | ⬜ Pendiente |
| B10 | Testing en móvil/tablet/escritorio + optimización Lighthouse | ⬜ Pendiente |

> **Actualiza este apartado** cada vez que un bloque cambie de estado.

---

## 🎨 Identidad visual

- **Color principal**: terracota / tierra (`#C9633E`, `#8E4226`)
- **Color secundario**: verde salvia (`#8FA785`, `#5F7355`)
- **Fondos**: crema / blanco roto (`#FAF6EE`, `#EFE8D6`)
- **Tipografía títulos**: Georgia (con carácter, evoca memoria)
- **Tipografía cuerpo**: Arial / sans-serif limpia
- **Símbolo**: la flor del no-me-olvides (azul `#6B8CB8`), pequeña y silvestre.
  Usar como icono de los puntos del mapa o decoración recurrente.

**Tono general**: cercano, auténtico, con carácter. NO corporativo frío,
NO genérico de turismo. Debe transmitir memoria, territorio y narración.

---

## 📂 Estructura de carpetas (objetivo)

```
nomeolvides/
├── CLAUDE.md                      # Este archivo
├── docs/                          # Documentación viva (HTML autocontenido)
│   ├── 01_arquitectura.html
│   ├── 02_modelo_datos.html
│   ├── 03_lopd_compliance.html
│   ├── 04_manual_panel.html       # Para la promotora
│   └── 05_traspaso.html           # Para futuro programador
├── app/                           # Next.js App Router
│   ├── [locale]/                  # Rutas por idioma
│   ├── admin/                     # Panel de gestión
│   └── api/                       # API Routes
├── components/                    # Componentes React
├── lib/                           # Utilidades (cliente Supabase, etc.)
├── messages/                      # Traducciones es.json / en.json
├── public/                        # Assets estáticos
├── supabase/migrations/           # Migraciones SQL versionadas
├── .env.local                     # Variables (NO en git)
├── .env.example                   # Plantilla de variables
└── README.md
```

---

## 📝 Decisiones tomadas (Architecture Decision Records)

| Fecha | Decisión | Motivo |
|---|---|---|
| 2026-04-30 | Stack Next.js + Leaflet + Supabase + Vercel | Cumple brief, free tier, portabilidad |
| 2026-04-30 | Mapa con OpenStreetMap (no Mapbox/Google) | Sin licencias, sin claves, sin facturación |
| 2026-04-30 | Supabase región Frankfurt | Datos en UE, sin coste extra |
| 2026-04-30 | Sin registro de visitantes en Fase 1 | Simplifica desarrollo y reduce superficie LOPD |
| 2026-04-30 | GA4 (con banner de cookies obligatorio) | Decisión de la promotora |
| 2026-04-30 | Auth solo para el panel | La parte pública es 100% sin login |

---

## 🤔 Decisiones aplazadas (recordar más adelante)

- [ ] Nombre y extensión del dominio definitivo
- [ ] Número de buzones de email
- [ ] Proveedor de email (Cloudflare Routing gratis / Google Workspace / Zoho)
- [ ] Si en Fase 2 se incorpora avatar IA como alternativa al audio
- [ ] Si en Fase 2 se añaden filtros en el mapa (provincia, comunidad, tipo)

---

## 🎯 Cómo trabajar con Claude Code en este proyecto

### Reglas del juego (MUY IMPORTANTE)

1. **Trabaja incrementalmente**: una pregunta o instrucción a la vez,
   espera confirmación del usuario antes de avanzar. NO ejecutes varios
   pasos sin validar.

2. **Antes de implementar cualquier funcionalidad nueva**, evalúa su
   impacto en LOPD y pregunta al usuario para confirmar que se cumple.

3. **Actualiza la documentación HTML** cuando un cambio sea relevante
   (nuevas tablas, nuevos servicios, decisiones arquitectónicas).

4. **Comenta el código** pensando en el siguiente programador que tomará
   el relevo. Comentarios en español o inglés (consistente).

5. **No introduzcas dependencias innecesarias**. Cada librería nueva
   debe justificarse y documentarse.

6. **Variables de entorno** siempre en `.env.local` (NO commitear),
   plantilla en `.env.example` (sí commitear).

### Lo siguiente que toca hacer

**Bloque B4 — Diseño visual**. Pasos pendientes:

1. Aplicar paleta de colores (terracota, salvia, crema)
2. Tipografía Georgia (títulos) + Arial (cuerpo)
3. Icono personalizado para los puntos del mapa (flor no-me-olvides azul)
4. Popup con diseño: descripción + reproductor de audio + enlace externo

---

## 📞 Contacto del proyecto

- **Promotora**: María del Carmen López Rosa
- **Email del proyecto**: info@nomeolvides.es (pendiente de configurar)

---

*Última actualización: 1 de mayo de 2026*
