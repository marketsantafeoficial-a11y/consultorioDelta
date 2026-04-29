import { LogoutButton } from "@/components/logout-button";
import { requireRole } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

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
            { label: "Consultorios reservables", value: recursos.length },
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

        <section
          style={{
            background: "white",
            border: "1px solid var(--color-border)",
            borderRadius: "8px",
            boxShadow: "var(--shadow)",
            overflow: "hidden",
          }}
        >
          <div style={{ borderBottom: "1px solid var(--color-border)", padding: "1.25rem" }}>
            <h2 style={{ fontSize: "1.25rem", margin: 0 }}>Reservas de consultorios</h2>
            <p style={{ color: "var(--color-muted)", margin: "0.25rem 0 0" }}>
              Control de solicitudes, profesionales, recursos y horarios reservados.
            </p>
          </div>
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
        </section>

        <section
          style={{
            background: "white",
            border: "1px solid var(--color-border)",
            borderRadius: "8px",
            boxShadow: "var(--shadow)",
            padding: "1.25rem",
          }}
        >
          <h2 style={{ fontSize: "1.25rem", margin: "0 0 1rem" }}>Usuarios demo</h2>
          <div style={{ display: "grid", gap: "0.75rem", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
            {[
              ["Administrador", "admin@delta.local", "admin1234"],
              ["Psicologa - agenda propia", "agustina.ferraro@centrovida.ar", "agustina1234"],
              ["Kinesiologo - agenda propia", "tomas.ibarra@puertosalud.ar", "tomas1234"],
              ["Cliente demo", "cliente@delta.local", "cliente1234"],
            ].map(([role, email, password]) => (
              <div
                key={email}
                style={{
                  background: "var(--color-muted-bg)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "8px",
                  padding: "1rem",
                }}
              >
                <strong>{role}</strong>
                <p style={{ color: "var(--color-muted)", margin: "0.25rem 0 0" }}>{email}</p>
                <p style={{ color: "var(--color-primary)", fontWeight: 800, margin: "0.25rem 0 0" }}>
                  {password}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
