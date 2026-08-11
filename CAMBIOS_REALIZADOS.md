# CAMBIOS REALIZADOS — Delta Espacios Profesionales
## Rama: main | Commit: 41f96d4 | Fecha: Agosto 2026

---

### 1. REEMPLAZO DE LOGOS
Se reemplazó el logo antiguo (`delta-logo-citybell.png` / `delta-logo.svg`) por el nuevo logo (`delta-logo-new.png`) en todos los lugares visibles.

| Archivo | Línea | Cambio |
|---|---|---|
| `components/site-header.tsx` | 31 | `src="/delta-logo-new.png"` (header público) |
| `app/page.tsx` | 65 | `src="/delta-logo-new.png"` (hero) |
| `app/page.tsx` | 279 | `src="/delta-logo-new.png"` (footer) |
| `app/dashboard/page.tsx` | 32 | `src="/delta-logo-new.png"` (dashboard admin) |
| `components/admin-page-shell.tsx` | 24 | `src="/delta-logo-new.png"` (shell admin) |
| `components/login-form.tsx` | 58 | `src="/delta-logo-new.png"` (login) |
| `app/professional/page.tsx` | 53 | `src="/delta-logo-new.png"` (panel profesional) |

Archivos nuevos:
- `public/delta-logo-new.png`
- `public/delta-assets/delta-logo-citybell-new.png`

---

### 2. FORMATO DE DIRECCIÓN EN DOS LÍNEAS

| Archivo | Línea | Antes | Después |
|---|---|---|---|
| `app/page.tsx` | 263 | `Calle 467 N 164, e/13A y 13B, City Bell 1896` | `467 N° 164, E/ 13A y 13B<br />City Bell, 1896` |
| `lib/instagram-demo.ts` | 7 | `Calle 467 N 164, e/13A y 13B, City Bell 1896` | `467 N° 164, E/ 13A y 13B\nCity Bell, 1896` |

---

### 3. ELIMINACIÓN DE DIRECCIÓN DUPLICADA EN FOOTER

| Archivo | Línea | Cambio |
|---|---|---|
| `app/page.tsx` | 280-281 | Eliminada la línea `<p className="lp-footer-tagline">{instagramDemo.location}</p>` que mostraba la dirección debajo del logo en el footer |
| `app/page.tsx` | 4 | Eliminado el import `{ instagramDemo }` de `@/lib/instagram-demo` (quedó sin uso) |

---

### 4. TEXTO DE SECCIÓN DE PROFESIONALES

| Archivo | Línea | Antes | Después |
|---|---|---|---|
| `app/page.tsx` | 166 | `Conoce a los profesionales que forman parte de Delta y coordina tu consulta de manera simple y directa.` | `Conocé los profesionales que forman parte de nuestro espacio. Podes comunicarte directamente por WhatsApp desde cada perfil.` |
| `app/profesionales/page.tsx` | 26-28 | `Conoce los perfiles del equipo, sus areas de trabajo y su forma de atencion. Podes escribir por WhatsApp directamente desde cada ficha.` | `Conocé los profesionales que forman parte de nuestro espacio. Podes comunicarte directamente por WhatsApp desde cada perfil.` |

---

### 5. SECCIÓN CONSULTA / CONTACTO

| Archivo | Línea | Cambio |
|---|---|---|
| `components/team-referral-form.client.tsx` | 85 | **ELIMINADO** `<span className="section-kicker">Consulta simple</span>` |
| `components/team-referral-form.client.tsx` | 86 | **REEMPLAZADO** `<h2>Dejanos los datos basicos y seguimos por WhatsApp</h2>` → `<h2>Dejanos tu consulta en el siguiente formulario para comunicarnos por WhatsApp.</h2>` |
| `components/team-referral-form.client.tsx` | 87-91 | **REEMPLAZADOS** los párrafos anteriores por uno solo: `<p>Desplegá la flecha para contactar directamente al profesional de tu interés o comunicate con la secretaria virtual de Delta para recibir asesoramiento.</p>` |

---

### 6. TEXTO IOMA

| Archivo | Línea | Antes | Después |
|---|---|---|---|
| `components/team-referral-form.client.tsx` | 75 | `Nota: no trabajan por IOMA.` | `Nota: No atendemos por IOMA.` |
| `components/team-referral-form.client.tsx` | 200 | `DELTA – ESPACIOS PROFESIONALES no trabaja por IOMA.` | `No atendemos por IOMA.` |

---

### 7, 8, 9. REDISEÑO COMPLETO DEL ADMIN DE PROFESIONALES

#### Modelo de datos (Prisma)

Archivo: `prisma/schema.prisma`

Se agregaron 7 nuevos campos al modelo `Professional` (todos opcionales `String?`):

| Campo | Tipo | Descripción |
|---|---|---|
| `modalidadAtencion` | String? | Presencial / Virtual / Presencial y virtual |
| `atencionCobertura` | String? | Obras sociales, reintegro, particular |
| `poblacion` | String? | Niños, adolescentes, adultos, familias |
| `orientacionTeorica` | String? | Orientación teórica del profesional |
| `prestaciones` | String? | Prestaciones que brinda |
| `areasExperiencia` | String? | Áreas de experiencia y problemáticas |
| `presentacionProfesional` | String? | Descripción/presentación personal |

Migración: `prisma/migrations/20260811115723_add_professional_fields/migration.sql`

#### API actualizada

| Archivo | Cambio |
|---|---|
| `app/api/professionals/route.ts` | Zod schema ampliado con los 7 nuevos campos. `bio` ahora opcional. POST guarda todos los campos nuevos. |
| `app/api/professionals/[id]/route.ts` | Zod schema ampliado. PATCH actualiza todos los campos nuevos. |
| `app/api/upload/route.ts` | **NUEVO** endpoint. POST multipart, admin-only. Acepta JPG/PNG/WebP, máx 5MB. Guarda en `public/uploads/professionals/`. Retorna URL. |

#### Formulario de creación (`components/admin-professional-form.client.tsx`)

Rediseño completo. 12 campos organizados en 4 bloques visuales:

**Bloque 1 — Información básica:**
- Nombre completo (input, obligatorio)
- Especialidad (textarea, obligatorio, conserva saltos de línea)
- Sede (select)
- Modalidad de atención (select: Presencial / Virtual / Presencial y virtual)
- Foto (input file con previsualización)

**Bloque 2 — Atención profesional:**
- Atención / Obras sociales / Reintegro / Particular (textarea)
- Población con la que trabaja (textarea)
- Orientación teórica (textarea)

**Bloque 3 — Experiencia y servicios:**
- Prestaciones que brinda (textarea, 6 filas)
- Áreas de experiencia y problemáticas que aborda (textarea, 6 filas)

**Bloque 4 — Presentación y contacto:**
- Presentación profesional (textarea, 5 filas)
- WhatsApp (input tel, obligatorio)

#### Formulario de edición (`components/admin-professionals-table.client.tsx`)

Rediseño completo:
- Tabla simplificada (Nombre, Especialidad, WhatsApp, Sede, Acciones)
- Edición mediante **modal** (ya no inline en tabla)
- El modal contiene los mismos 12 campos organizados en los mismos 4 bloques
- Subida de imagen con previsualización en edición
- Botón "Quitar" para eliminar la foto actual

#### Página admin (`app/admin/profesionales/page.tsx`)

Actualizado el mapeo de datos para pasar los 7 nuevos campos al componente de tabla.

---

### 10, 11. VISUALIZACIÓN PÚBLICA DE PROFESIONALES

#### Tarjetas y modal (`components/team-directory.client.tsx`)

- **Tarjetas**: Muestran nombre, primera línea de especialidad, badge con modalidad de atención, botones Ver perfil y WhatsApp.
- **Modal de perfil**: Reorganizado con campos separados visualmente:
  - Modalidad
  - Presentación profesional (o bio como fallback)
  - Población
  - Cobertura / Atención
  - Orientación
  - Prestaciones
  - Áreas de experiencia (o serves como fallback)
  - Sede
- Todos los textos multilínea conservan saltos de línea (`whiteSpace: "pre-wrap"`).
- WhatsApp usa el número del profesional si existe, o el general de Delta.

#### Página de detalle (`app/profesionales/[id]/page.tsx`)

- Actualizada para mostrar todos los nuevos campos.
- WhatsApp directo del profesional (antes siempre iba al general de Delta).
- Presentación profesional o bio como fallback.
- Áreas de experiencia o serves como fallback.

#### Profesionales page (`app/profesionales/page.tsx`)

- Mapeo actualizado para pasar los 7 nuevos campos al TeamDirectory.

---

### 12. CSS (`app/globals.css`)

Nuevos estilos agregados (205 líneas):

- `.admin-professional-form` — layout del formulario de creación
- `.admin-form-section` — bloques visuales con fondo y borde
- `.admin-form-section h3` — títulos de bloque con separador
- `.admin-form-two-cols` — grid de 2 columnas para campos cortos
- `.admin-submit-btn` — botón de submit full-width
- `.admin-feedback` / `.admin-feedback-ok` — mensajes de estado
- `.admin-photo-upload` — contenedor de subida de imagen
- `.admin-photo-preview` — previsualización circular con botón quitar
- `.admin-photo-placeholder` — placeholder dashed circle
- `.admin-edit-modal` — modal de edición con scroll
- `.admin-edit-form-content` — contenido del formulario en modal
- `.admin-edit-modal-actions` — botones de guardar/cancelar
- `.team-modal-detail` — modal de perfil con scroll
- `.team-modal-field` — campos con label en mayúsculas
- `.team-modalidad-badge` — badge de modalidad en tarjetas
- Media queries para responsive (1 columna en mobile)

---

### 13. COMPATIBILIDAD CON DATOS EXISTENTES

- Los 7 campos nuevos son `NULL` por defecto → **todos los profesionales existentes se conservan intactos**.
- `bio` se mantiene como fallback si no hay `presentacionProfesional`.
- `serves` se mantiene como fallback si no hay `areasExperiencia`.
- La migración SQL solo ejecuta `ALTER TABLE ADD COLUMN`, no modifica ni borra datos.

---

### 14. ARCHIVOS NO MODIFICADOS

No se modificaron:
- URLs, rutas públicas, estructura de navegación
- Colores, tipografía, identidad visual general
- `next.config.ts`, `package.json`, `eslint.config.mjs`
- API de auth, calendario, módulos, reservas, dashboard data
- Componentes de booking, consultorio schedules, text animations
- Páginas de calendario, design-prototype, auth/login
- Componentes UI (site-icons, logout-button, etc.)
- Endpoints existentes (salvo los 2 de professionals ampliados)

---

### 15. VERIFICACIÓN

- ✅ `pnpm build` — compila sin errores
- ✅ `pnpm lint` (eslint) — sin errores
- ✅ TypeScript — sin errores de tipo
- ✅ 25 rutas generadas correctamente
- ✅ Todas las páginas estáticas y dinámicas funcionan
