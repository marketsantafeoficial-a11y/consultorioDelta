import { LogoutButton } from "@/components/logout-button";
import { requireRole } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { AdminProfessionalForm } from "@/components/admin-professional-form.client";
import { isSpaceResource } from "@/lib/resource-kind";
import { AdminModulesManager } from "@/components/admin-modules-manager.client";

export const dynamic = "force-dynamic";

const dtFormatter = new Intl.DateTimeFormat("es-AR", {
  dateStyle: "short",
  timeStyle: "short",
});

export default async function DashboardPage() {
  await requireRole("ADMIN");

  const [sedes, recursos, reservas] = await Promise.all([
    prisma.consultory.findMany({ orderBy: { name: "asc" } }),
    prisma.professional.findMany({
      include: { consultory: true, schedules: true },
      orderBy: { fullName: "asc" },
    }),
    prisma.appointment.findMany({
      include: { consultory: true, professional: true },
      orderBy: { startsAt: "asc" },
      take: 40,
    }),
  ]);

  const reservasPendientes = reservas.filter((item) => item.status === "PENDING").length;
  const reservasConfirmadas = reservas.filter((item) => item.status === "CONFIRMED").length;
  const profesionalesEquipo = recursos.filter((item) => !isSpaceResource(item));
  const consultoriosReservables = recursos.filter(isSpaceResource);

  return (
    <div style={{ background: "var(--color-background)", minHeight: "100vh" }}>
      <header
        style={{
          alignItems: "center",
          background: "white",
          borderBottom: "1px solid var(--color-border)",
          display: "flex",
          justifyContent: "space-between",
          padding: "1rem 2rem",
        }}
      >
        <div style={{ alignItems: "center", display: "flex", gap: "0.75rem" }}>
          <img src="/delta-logo.svg" alt="Delta Consultorios City Bell" className="brand-logo small" />
          <div>
          <p style={{ color: "var(--color-muted)", fontSize: "0.8rem", fontWeight: 700, margin: 0 }}>
            ADMINISTRACION
          </p>
          <h1 style={{ color: "var(--color-primary)", fontSize: "1.25rem", margin: 0 }}>
            Gestion de reservas Delta
          </h1>
          <span className="admin-phone">Administradora: 221 477 8280</span>
          </div>
        </div>
        <div className="header-actions">
          <Link href="/" className="header-home-link">Inicio</Link>
          <Link href="/calendario" className="header-home-link">Agenda publica</Link>
          <LogoutButton />
        </div>
      </header>

      <main
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
          margin: "0 auto",
          maxWidth: "1200px",
          padding: "2rem",
        }}
      >
        <section style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
          {[
            { label: "Sedes", value: sedes.length },
            { label: "Consultorios reservables", value: consultoriosReservables.length },
            { label: "Profesionales", value: profesionalesEquipo.length },
            { label: "Pendientes", value: reservasPendientes },
            { label: "Confirmadas", value: reservasConfirmadas },
          ].map((stat) => (
            <article
              key={stat.label}
              style={{
                background: "white",
                border: "1px solid var(--color-border)",
                borderRadius: "8px",
                boxShadow: "var(--shadow)",
                padding: "1.25rem",
              }}
            >
              <strong style={{ color: "var(--color-primary)", display: "block", fontSize: "2rem" }}>
                {stat.value}
              </strong>
              <span style={{ color: "var(--color-muted)", fontSize: "0.85rem", fontWeight: 800 }}>
                {stat.label}
              </span>
            </article>
          ))}
        </section>

        <section className="admin-hub-grid" aria-label="Accesos del tablero">
          <Link href="/admin/modulos" className="admin-hub-card">
            <span>01</span>
            <strong>Modulos y agenda</strong>
            <p>Crear gabinetes, editar horarios, ocupar, mover y liberar turnos.</p>
          </Link>
          <Link href="/admin/profesionales" className="admin-hub-card">
            <span>02</span>
            <strong>Profesionales</strong>
            <p>Cargar perfiles publicos para la seccion Nuestro equipo.</p>
          </Link>
          <Link href="/admin/reservas" className="admin-hub-card">
            <span>03</span>
            <strong>Reservas</strong>
            <p>Ver el listado completo de ocupaciones y solicitudes.</p>
          </Link>
          <a href="#acceso-admin" className="admin-hub-card">
            <span>04</span>
            <strong>Acceso</strong>
            <p>Recordatorio del usuario administrador activo.</p>
          </a>
        </section>

        <section
          id="modulos"
          className="admin-panel-card"
          style={{
            background: "white",
            border: "1px solid var(--color-border)",
            borderRadius: "8px",
            boxShadow: "var(--shadow)",
            padding: "1.25rem",
          }}
        >
          <div className="admin-panel-head">
            <span>Modulo de administracion</span>
            <h2 style={{ fontSize: "1.25rem", margin: 0 }}>Editar modulos y horarios</h2>
            <p style={{ color: "var(--color-muted)", margin: "0.25rem 0 0" }}>
              Desde aca podes crear gabinetes, cambiar su disponibilidad semanal y cargar nombres ocupando dia/hora como en la planilla.
            </p>
          </div>
          <AdminModulesManager
            consultories={sedes.map((sede) => ({
              id: sede.id,
              name: sede.name,
              city: sede.city,
            }))}
            modules={consultoriosReservables.map((room) => ({
              id: room.id,
              fullName: room.fullName,
              specialty: room.specialty,
              bio: room.bio,
              serves: room.serves,
              photoUrl: room.photoUrl,
              consultoryId: room.consultoryId,
              schedules: room.schedules.map((schedule) => ({
                id: schedule.id,
                dayOfWeek: schedule.dayOfWeek,
                startTime: schedule.startTime,
                endTime: schedule.endTime,
              })),
            }))}
            occupancies={reservas
              .filter((item) => consultoriosReservables.some((room) => room.id === item.professionalId))
              .map((item) => ({
                id: item.id,
                patientName: item.patientName,
                startsAt: item.startsAt.toISOString(),
                professionalId: item.professionalId,
                professionalName: item.professional.fullName,
                status: item.status,
              }))}
          />
        </section>

        <section
          id="profesionales-admin"
          className="admin-panel-card"
          style={{
            background: "white",
            border: "1px solid var(--color-border)",
            borderRadius: "8px",
            boxShadow: "var(--shadow)",
            padding: "1.25rem",
          }}
        >
          <div className="admin-panel-head">
            <span>Equipo publico</span>
            <h2 style={{ fontSize: "1.25rem", margin: 0 }}>Cargar profesional</h2>
            <p style={{ color: "var(--color-muted)", margin: "0.25rem 0 0" }}>
              El administrador carga los profesionales que aparecen en la pagina publica Nuestro equipo.
            </p>
          </div>
          <AdminProfessionalForm
            consultories={sedes.map((sede) => ({
              id: sede.id,
              name: sede.name,
              city: sede.city,
            }))}
          />
        </section>

        <section
          className="admin-panel-card"
          style={{
            background: "white",
            border: "1px solid var(--color-border)",
            borderRadius: "8px",
            boxShadow: "var(--shadow)",
            overflow: "hidden",
          }}
        >
          <div className="admin-panel-head" style={{ borderBottom: "1px solid var(--color-border)", padding: "1.25rem" }}>
            <span>Listado publico</span>
            <h2 style={{ fontSize: "1.25rem", margin: 0 }}>Profesionales del equipo</h2>
            <p style={{ color: "var(--color-muted)", margin: "0.25rem 0 0" }}>
              Estos perfiles se muestran en el popup de la seccion Nuestro equipo.
            </p>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table>
              <thead>
                <tr>
                  <th>Profesional</th>
                  <th>Especialidad</th>
                  <th>Areas</th>
                  <th>Sede</th>
                </tr>
              </thead>
              <tbody>
                {profesionalesEquipo.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <strong style={{ display: "block" }}>{item.fullName}</strong>
                      <span style={{ color: "var(--color-muted)", fontSize: "0.8rem" }}>{item.email}</span>
                    </td>
                    <td>{item.specialty}</td>
                    <td>{item.serves ?? "Sin cargar"}</td>
                    <td>{item.consultory.name}</td>
                  </tr>
                ))}
                {profesionalesEquipo.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ color: "var(--color-muted)", padding: "2rem", textAlign: "center" }}>
                      Todavia no hay profesionales cargados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <details id="reservas-admin" className="admin-details-panel">
          <summary>
            <div>
              <span>Listado completo</span>
              <h2>Reservas de consultorios</h2>
              <p>Control de solicitudes, profesionales, recursos y horarios reservados.</p>
            </div>
            <strong>Ver tabla</strong>
          </summary>
          <div style={{ overflowX: "auto" }}>
            <table>
              <thead>
                <tr>
                  <th>Cliente / profesional</th>
                  <th>Consultorio</th>
                  <th>Sede</th>
                  <th>Fecha</th>
                  <th>Motivo</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {reservas.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <strong style={{ display: "block" }}>{item.patientName}</strong>
                      <span style={{ color: "var(--color-muted)", fontSize: "0.8rem" }}>{item.patientEmail}</span>
                    </td>
                    <td>{item.professional.fullName}</td>
                    <td>{item.consultory.name}</td>
                    <td>{dtFormatter.format(item.startsAt)}</td>
                    <td>{item.reason}</td>
                    <td>
                      <span className="status-pill">{item.status}</span>
                    </td>
                  </tr>
                ))}
                {reservas.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ color: "var(--color-muted)", padding: "2rem", textAlign: "center" }}>
                      Todavia no hay reservas registradas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </details>

        <section
          id="acceso-admin"
          className="admin-panel-card"
          style={{
            background: "white",
            border: "1px solid var(--color-border)",
            borderRadius: "8px",
            boxShadow: "var(--shadow)",
            padding: "1.25rem",
          }}
        >
          <h2 style={{ fontSize: "1.25rem", margin: "0 0 0.5rem" }}>Acceso actual</h2>
          <p style={{ color: "var(--color-muted)", margin: 0 }}>
            Por ahora solo administra <strong>admin@delta.local</strong>. Los profesionales se cargan como perfiles publicos, sin usuario propio.
          </p>
        </section>
      </main>
    </div>
  );
}
