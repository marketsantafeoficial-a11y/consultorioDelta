# DELTA – Espacios Profesionales
## Informe de Desarrollo Web – Junio 2026

---

## 1. RESUMEN EJECUTIVO

Se realizó una reestructuración completa de la página web de **Delta – Espacios Profesionales**, ubicada en Cantilo N° 146, City Bell. El sitio pasó de ser una landing page genérica de alquiler de consultorios a una plataforma profesional con identidad propia, secciones claras y un panel de administración simplificado.

**Estado actual:** Funcional y en línea. Listo para revisión de diseño UX/UI.

---

## 2. CAMBIOS REALIZADOS EN LA PÁGINA PÚBLICA

### 2.1 Identidad y Navegación

| Antes | Después |
|-------|---------|
| "Delta Consultorios" | "DELTA – ESPACIOS PROFESIONALES" |
| Links: Cómo trabajamos, Nuestro equipo, Soy profesional, Alquiler, Consultar turno | Links: Quiénes somos, Red de profesionales, **Agenda tu turno** (destacado), Alquila tu espacio, Contacto |

- Se eliminó el link "Soy profesional" (innecesario para visitantes).
- "Agenda tu turno" ahora sobresale visualmente con fondo destacado en la barra de navegación.
- Todos los links hacen scroll suave a la sección correspondiente.

### 2.2 Hero (Portada)

- **Slogan principal:** *"Espacios donde los encuentros acompañan el cambio."*
- Efecto de escritura letra por letra (typewriter) en el título principal.
- Layout de 2 columnas: texto + imagen del espacio.
- Animaciones de aparición al hacer scroll (fade + slide).
- Botones de acción: "Agenda tu turno" y "Alquila tu espacio".

### 2.3 Sección "Quiénes Somos"

Reemplaza a la antigua sección "Cómo trabajamos". Incluye el texto institucional completo:

> *Delta es un espacio profesional ubicado en el centro de City Bell, creado para reunir distintas disciplinas en un entorno cálido, cómodo y funcional. Pensamos cada detalle para ofrecer un lugar agradable tanto para profesionales como para quienes llegan en busca de atención y acompañamiento.*
>
> *En nuestro espacio trabajan profesionales de diferentes áreas, generando una comunidad interdisciplinaria basada en el respeto, la cercanía y el compromiso con cada persona que nos elige.*
>
> *Contamos con consultorios equipados, espacios luminosos y un entorno preparado para brindar comodidad, tranquilidad y privacidad.*

### 2.4 Sección "Agendá tu Turno"

Nueva sección con los 3 pasos para sacar turno:

1. **Seleccionar la especialidad** – Elegí el área profesional según tu consulta.
2. **Elegir profesional** – Conocé a los profesionales y seleccioná el que mejor se adapte.
3. **Enviar WhatsApp** – Comunicate por WhatsApp para coordinar tu cita.

Incluye nota de contacto con el número 221 477 8280 y mención al formulario.

### 2.5 Sección "Especialidades"

Acordeón interactivo con 7 disciplinas:

| Especialidad | Descripción |
|-------------|-------------|
| **Psicología** | Acompañamiento y escucha profesional orientado al bienestar emocional |
| **Psicopedagogía** | Acompañamiento en procesos de aprendizaje y desarrollo |
| **Terapia Ocupacional** | Intervenciones para promover autonomía y calidad de vida |
| **Nutrición** | Hábitos saludables y alimentación consciente |
| **Optometría** | Evaluación, prevención y cuidado de la salud visual |
| **Productora de Seguros** | Asesoramiento para protección de personas, bienes y proyectos |
| **Agrimensura** | Mensuras, subdivisiones, estados parcelarios |

Cada especialidad se despliega al hacer clic. Preparada para mostrar los profesionales de cada área (pendiente de carga).

### 2.6 Sección "Red de Profesionales"

Sección introductoria con botón "Ver profesionales" que lleva a la página completa del equipo (`/profesionales`).

### 2.7 Sección "Alquila tu Espacio"

Reestructuración completa de la sección de alquiler:

- **Descripción:** Texto de bienvenida para profesionales que buscan consultorio.
- **Amenities en cuadros amarillos:** WiFi, Sala de espera, Baño y kitchenette, Aire acondicionado, Escritorio y diván, Súper luminosos.
- **Módulos de alquiler:**
  - Mañana: 9 a 12 hs
  - Mediodía: 12 a 16 hs
  - Tarde: 16 a 20 hs
  - Jornada completa: 9 a 20 hs
- **Texto de valores:** "Los valores se adaptan según la cantidad de módulos que necesites alquilar. Consultanos por WhatsApp."
- **Botón grande** de WhatsApp para consultar alquiler.
- **Se eliminaron:** cuadro de precios fijos, promo lanzamiento 4x3, cuadro de ajustes.

### 2.8 Disponibilidad de Consultorios

Tablas interactivas con horarios de los 7 consultorios:

| Consultorio | Ubicación |
|-------------|-----------|
| Consultorio 1 | Planta Baja |
| Consultorio 2 | Planta Baja |
| Consultorio 3 | Planta Baja Niños |
| Consultorio 4 | 1er Piso Frente |
| Consultorio 5 | 1er Piso Frente |
| Consultorio 6 | 1er Piso Atrás |
| Consultorio 7 | 1er Piso Atrás |

Cada consultorio se despliega mostrando una grilla semanal (Lunes a Sábado, 9 a 19 hs) con los nombres de los profesionales asignados a cada horario. Los datos ya están cargados según la información provista.

**Profesionales cargados en horarios:**
- Consultorio 3: Antonella, M Julia, Angie, Agustina
- Consultorio 4: Patricia, Noelia, Fernanda, Carolina, Emilia
- Consultorio 5: Dalila, Carolina, Flavia, Gabriela, Mariano
- Consultorio 6: Lujan, Angeles, Daniel, Veronica, Yamila, Paula, Silvia
- Consultorio 7: Yanina, Patricia, Angeles, Carolina, Paula S, Belen, Maira

### 2.9 Sección "Contacto"

- WhatsApp: 221 477 8280 (con botón directo)
- Ubicación: Cantilo N 146, City Bell 1896
- Horario: Lunes a Sábados de 9 a 20 hs

### 2.10 Footer

Actualizado con el nuevo nombre "DELTA – ESPACIOS PROFESIONALES" y links a Alquiler, Equipo y Admin.

---

## 3. PANEL DE ADMINISTRACIÓN

### 3.1 Dashboard Principal (`/dashboard`)

Rediseño completo para mayor simplicidad:

- **4 tarjetas de estadísticas:** Profesionales, Consultorios, Turnos pendientes, Sedes.
- **3 accesos directos grandes con iconos:**
  - 👤 Profesionales – Cargar, editar o eliminar perfiles
  - 🏢 Consultorios y horarios – Administrar disponibilidad
  - 📋 Reservas – Ver todas las reservas
- **Últimas reservas** con estados visuales (Pendiente, Confirmada, etc.)

### 3.2 Carga de Profesionales (`/admin/profesionales`)

Formulario simplificado en 3 secciones claras:

1. **Datos básicos:** Nombre, Especialidad, Sede
2. **Presentación:** Biografía, Áreas de atención
3. **Contacto:** WhatsApp, Email, Foto

### 3.3 Gestión de Consultorios (`/admin/modulos`)

Sistema de pestañas (tabs) para mayor claridad:

- **Pestaña Información:** Datos del consultorio (nombre, descripción, foto, sede)
- **Pestaña Horarios:** Grilla visual con checkboxes para activar/desactivar módulos por día
- **Pestaña Ocupar horario:** Formulario para cargar nombres en horarios específicos + lista de ocupaciones con acciones Mover/Liberar

---

## 4. ASPECTOS TÉCNICOS

### 4.1 Stack Tecnológico

| Tecnología | Versión |
|-----------|---------|
| Next.js | 16.2.4 |
| React | 19.2.4 |
| TypeScript | 5.x |
| Tailwind CSS | 4.x |
| Prisma (ORM) | 6.19.x |
| Base de datos | PostgreSQL |

### 4.2 Animaciones Implementadas

| Efecto | Componente | Uso |
|--------|-----------|-----|
| Escritura letra por letra | `TypewriterText` | Título principal del hero |
| Subrayado animado | `DrawTitle` | Títulos de cada sección |
| Aparición al scroll | `RevealOnScroll` | Todos los bloques de contenido |
| Punto pulsante | CSS | Indicador de disponibilidad |

### 4.3 Responsive (Mobile)

Todas las secciones se adaptan a pantallas chicas:
- Grillas que colapsan a 1 columna en mobile
- Navegación que se reorganiza en columna
- Botones de acción en ancho completo
- Tablas de horarios con scroll horizontal

### 4.4 Archivos Modificados

| Archivo | Cambio |
|---------|--------|
| `app/page.tsx` | Reestructuración completa de la landing |
| `components/site-header.tsx` | Nuevo nombre, nuevos links, botón destacado |
| `app/globals.css` | +400 líneas de CSS nuevo |
| `app/dashboard/page.tsx` | Dashboard simplificado |
| `components/admin-professional-form.client.tsx` | Formulario por secciones |
| `components/admin-modules-manager.client.tsx` | Sistema de tabs |
| `components/ConsultorioSchedules.client.tsx` | **NUEVO** – Tablas de horarios |

---

## 5. PENDIENTES / PRÓXIMOS PASOS

### 5.1 UX/UI (Prioridad alta)
- [ ] Revisión de diseño visual y espaciado con herramienta de diseño
- [ ] Mejorar tipografía y jerarquía visual
- [ ] Ajustar colores y contrastes
- [ ] Mejorar la experiencia en mobile

### 5.2 Contenido
- [ ] Subir logo actualizado (Drive) – evaluar cómo queda con fondo neutro
- [ ] Subir fotos reales de los espacios (cuando se muden)
- [ ] Cargar profesionales reales en cada especialidad
- [ ] Fotos de perfil de cada profesional

### 5.3 Funcionalidad
- [ ] Que al hacer clic en una especialidad se filtren los profesionales de esa área
- [ ] Formulario de contacto funcional (email)
- [ ] Carga de horarios dinámica desde el admin (actualmente hardcodeados)
- [ ] Posibilidad de editar/eliminar profesionales desde el admin

### 5.4 Infraestructura
- [ ] Deploy a producción
- [ ] Dominio personalizado
- [ ] Certificado SSL
- [ ] Backup automático de base de datos

---

## 6. ACCESO AL SITIO

| Entorno | URL |
|---------|-----|
| Desarrollo local | http://localhost:3000 |
| Panel admin | http://localhost:3000/dashboard |
| Login admin | http://localhost:3000/auth/login |

---

## 7. INFORMACIÓN DE PROFESIONALES (para carga)

Los profesionales que quieran formar parte de la página deben enviar:

1. **Foto profesional** (rostro + torso, buena iluminación, fondo neutro)
2. **Datos:**
   - Nombre y apellido
   - Número de matrícula
   - Formación académica
   - Teléfono
   - Modalidad: presencial / virtual / ambas
   - Obras sociales (sí/no, cuáles)
   - Reintegros (sí/no)
3. **Rango de edad:** Niños, Adolescentes, Adultos, Adultos Mayores
4. **Orientación teórica**
5. **Tipo de prestación** (lista de 21 opciones)
6. **Problemáticas que aborda** (lista de 23 opciones)
7. **Presentación profesional corta**

---

*Documento generado el 3 de junio de 2026.*
*Delta – Espacios Profesionales | Cantilo N° 146, City Bell*
