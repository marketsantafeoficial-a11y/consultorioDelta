# Checklist QA y Despliegue — DELTA – ESPACIOS PROFESIONALES

## 1. Verificación de marca y contenido
- [ ] Confirmar que ya no exista "Delta Consultorios" en los archivos fuente.
- [ ] Revisar títulos `metadata` de todas las páginas principales.
- [ ] Validar textos de WhatsApp en formularios y botones.
- [ ] Verificar alt text de imágenes y descripciones de SVG.

## 2. QA visual y experiencia
- [ ] Abrir la landing en Desktop, Tablet y Mobile.
- [ ] Probar hero y las CTAs "Agenda tu turno" y "Alquila tu espacio".
- [ ] Comprobar que el modal de booking se cierre al abrir WhatsApp.
- [ ] Revisar el acordeón de especialidades y sección de profesionales.
- [ ] Probar el footer y los enlaces de contacto.

## 3. Funciones y flujos clave
- [ ] Verificar que el helper `getWhatsAppHref()` funcione en todos los enlaces.
- [ ] Probar el formulario de derivación y el flujo de contacto.
- [ ] Confirmar que las acciones de WhatsApp envién el mensaje correcto.
- [ ] Validar la carga de datos del dashboard si el admin está en uso.

## 4. Instalación y compilación
- [ ] Eliminar `.next` antes de regenerar el build.
- [ ] Ejecutar `pnpm install` sin errores.
- [ ] Ejecutar `pnpm build` y revisar que compile correctamente.
- [ ] Ejecutar `pnpm dev` para pruebas locales.

## 5. SEO y accesibilidad
- [ ] Revisar `title` y `description` de las URLs principales.
- [ ] Verificar que los enlaces tengan textos legibles y descriptivos.
- [ ] Revisar contraste de colores y legibilidad.
- [ ] Probar navegación con teclado en la landing y el formulario.

## 6. Despliegue final
- [ ] Confirmar que la URL de producción está lista.
- [ ] Revisar dominio y certificado SSL.
- [ ] Verificar sitemap/robots si aplica.
- [ ] Cerrar el ciclo de QA con una revisión final en staging.
