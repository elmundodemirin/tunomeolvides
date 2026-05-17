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
- **Dominio**: `tunomeolvides.es` (registrado y DNS en Hostinger, apuntado a Vercel)
- **Idiomas**: español (por defecto), inglés y francés. Las descripciones y audios solo se gestionan en ES + EN; FR cae a EN como fallback.
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
| Framework | Next.js 16 (App Router) + TypeScript |
| Edge / Middleware | Next 16 usa la convención `proxy.ts` (sustituye a `middleware.ts`) |
| Estilos | Tailwind CSS 4 |
| Mapa | Leaflet.js + OpenStreetMap |
| i18n | next-intl 4 |
| Base de datos | PostgreSQL (vía Supabase) |
| Auth | Supabase Auth (solo para el panel de gestión) |
| Storage | Supabase Storage (audios MP3) |
| Hosting frontend | Vercel |
| Dominio + DNS | Hostinger (`tunomeolvides.es`) |
| Email transaccional | Resend (SMTP custom de Supabase Auth, región EU-West) |
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
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by  UUID REFERENCES auth.users(id),   -- auditoría: quién creó
  modified_by UUID REFERENCES auth.users(id)    -- auditoría: última edición
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
  created_at TIMESTAMPTZ DEFAULT now(),
  -- Gestión interna (admin)
  handled     BOOLEAN     DEFAULT false NOT NULL,
  handled_at  TIMESTAMPTZ,
  handled_by  UUID REFERENCES auth.users(id),
  admin_notes TEXT,                              -- notas internas, NO visibles al remitente
  updated_at  TIMESTAMPTZ DEFAULT now() NOT NULL
);
```

**Política de retención**: los mensajes se eliminan automáticamente
pasados 2 años desde su recepción (cron job en Supabase).

### Función + triggers de `updated_at`

```sql
-- Función reusable: actualiza updated_at en cada UPDATE
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_localities_updated_at
  BEFORE UPDATE ON localities
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE TRIGGER trg_contact_messages_updated_at
  BEFORE UPDATE ON contact_messages
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
```

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

-- Mensajes: cualquiera puede insertar, solo admin puede leer/actualizar/borrar
CREATE POLICY "public_insert" ON contact_messages
  FOR INSERT WITH CHECK (true);
CREATE POLICY "admin_read" ON contact_messages
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "admin_update" ON contact_messages
  FOR UPDATE USING ((select auth.role()) = 'authenticated');
CREATE POLICY "admin_delete" ON contact_messages
  FOR DELETE USING ((select auth.role()) = 'authenticated');
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
| B4 | Diseño visual: terracota/salvia, Georgia+Arial, popup, reproductor | ✅ Completado |
| B5 | i18n ES/EN/FR + páginas estáticas (Inicio, Sobre, Contacto) | ✅ Completado |
| B6 | Panel `/admin`: login + CRUD localidades + subida audios + invitación | ✅ Completado |
| B7 | Formulario contacto + cookies + GA4 + páginas legales | ✅ Completado |
| B8 | SEO técnico: sitemap, metadatos, Schema.org, Open Graph | ⬜ Pendiente |
| B9 | Documentación final: manual del panel + traspaso técnico | 🟧 Parcial — manual ✅, traspaso ✅ (recién creado) |
| B10 | Testing en móvil/tablet/escritorio + optimización Lighthouse | ✅ Completado |

**Mejoras posteriores a B7** (no bloques propios, mejoras del panel admin):
- ✅ Vista admin de mensajes de contacto (`/admin/mensajes`): lista + detalle + marcar atendido + notas internas + eliminar.
- ✅ Campos de auditoría (`created_by`/`modified_by` en `localities`, `handled_*` y `admin_notes` en `contact_messages`).
- ✅ Página `/admin/set-password` para que los usuarios invitados fijen su contraseña.
- ✅ `redirectTo` explícito en `inviteUserByEmail` (con `NEXT_PUBLIC_SITE_URL` como fuente de verdad).
- ✅ Migración `middleware.ts` → `proxy.ts` (Next.js 16).
- ✅ Componente compartido `FlowerIcon` y favicon SVG (`app/icon.svg`).
- ✅ Panel admin alineado con la paleta de marca (terracota, no marrón espresso).

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
├── proxy.ts                       # Next 16: convención que sustituye middleware.ts
├── docs/                          # Documentación viva (HTML autocontenido)
│   ├── 01_arquitectura.html
│   ├── 04_manual_panel.html       # Para la promotora
│   └── 05_traspaso.html           # Para futuro programador
├── app/
│   ├── icon.svg                   # Favicon (flor del no-me-olvides)
│   ├── layout.tsx                 # Root layout (preconnects, html lang)
│   ├── [locale]/                  # Rutas públicas por idioma (es / en / fr)
│   ├── admin/
│   │   ├── login/                 # Pantalla de login
│   │   ├── set-password/          # Pantalla para invitados (fijar contraseña)
│   │   └── (panel)/               # Zona autenticada del panel
│   │       ├── dashboard/
│   │       ├── localities/
│   │       ├── mensajes/          # Vista de mensajes de contacto
│   │       └── usuarios/
│   └── api/
│       └── admin/users/           # Invitar / listar / borrar admins
├── components/
│   ├── FlowerIcon.tsx             # Logo SVG compartido público + admin
│   ├── HomeShell.tsx, Map.tsx, ...
│   └── admin/
│       ├── AdminMobileMenu.tsx
│       ├── LocalityForm.tsx
│       ├── MessageActions.tsx     # Marcar atendido / notas / eliminar
│       ├── SignOutButton.tsx
│       └── UsersManager.tsx
├── lib/                           # Utilidades (clientes Supabase, types)
├── messages/                      # Traducciones es.json / en.json / fr.json
├── public/                        # Assets estáticos
├── supabase/migrations/           # Migraciones SQL versionadas
├── i18n/                          # Configuración de next-intl
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
| 2026-05-02 | Idioma francés (FR) en la UI; descripciones/audios siguen ES+EN | Ampliar audiencia sin duplicar el coste de traducción y locución |
| 2026-05-02 | Campos de auditoría (`created_by`/`modified_by` en `localities`, `handled_*` y `admin_notes` en `contact_messages`) | Trazabilidad operativa y refuerzo de accountability RGPD art. 5.2 |
| 2026-05-09 | Migración `middleware.ts` → `proxy.ts` (Next 16) | Adoptar la nueva convención del framework; rename puro sin cambios de API |
| 2026-05-09 | `redirectTo` explícito en `inviteUserByEmail` apuntando a `/admin/set-password`, con `NEXT_PUBLIC_SITE_URL` → request origin como fallback | Independizar la app del "Site URL" del dashboard de Supabase y soportar múltiples entornos |
| 2026-05-17 | Dominio `tunomeolvides.es` registrado en Hostinger y apuntado a Vercel | Cierra el bloqueo del dominio definitivo; Hostinger es competitivo en `.es` y permite gestionar DNS + buzón en el futuro sin cambiar de proveedor |
| 2026-05-17 | `NEXT_PUBLIC_SITE_URL` y "Site URL" de Supabase actualizados a `https://tunomeolvides.es` | Que los emails de invitación y los `redirectTo` usen el dominio real, no la URL `*.vercel.app` |
| 2026-05-17 | SMTP custom de Supabase Auth vía Resend (región EU-West / Dublín, subdomain delegation en `send.tunomeolvides.es`) | El SMTP compartido de Supabase tiene rate limit 2 emails/hora a nivel proyecto; con Resend pasa a 300/hora y los emails salen como `noreply@tunomeolvides.es`. Free tier de 3000/mes sobra |

---

## 🤔 Decisiones aplazadas (recordar más adelante)

- [x] ~~Nombre y extensión del dominio definitivo~~ → `tunomeolvides.es` (2026-05-17)
- [ ] Activar buzón propio en Hostinger (`info@`, `noreply@` real, etc.) si se quiere recibir respuestas. Hoy `noreply@tunomeolvides.es` se usa solo para enviar; no existe inbox que reciba.
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
   plantilla en `.env.example` (sí commitear). Variables actuales:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (secreta, solo en server)
   - `NEXT_PUBLIC_SITE_URL` → `https://tunomeolvides.es` en Production de Vercel. Usada en `redirectTo` de los emails de invitación/recuperación.
   - `NEXT_PUBLIC_GA_ID` (cuando se active GA4)

   La API key de Resend NO va en `.env.local` — vive solo en Supabase Dashboard → Authentication → Emails → SMTP Settings.

### Lo siguiente que toca hacer

**Bloque B8 — SEO técnico**. Pasos pendientes:

1. Metadatos dinámicos por página (title, description, Open Graph)
2. Sitemap.xml automático
3. robots.txt
4. Schema.org (WebSite + Place para localidades)

---

## 📞 Contacto del proyecto

- **Promotora**: María del Carmen López Rosa
- **Email del proyecto**: info@tunomeolvides.es (pendiente de configurar)

---

*Última actualización: 17 de mayo de 2026 — dominio `tunomeolvides.es` en producción (Hostinger + Vercel) y SMTP custom vía Resend (subdomain delegation, EU-West)*
