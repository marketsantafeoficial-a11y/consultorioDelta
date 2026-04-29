import { requireRole } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { ProfessionalAvailabilityEditor } from "@/components/professional-availability-editor";
import { LogoutButton } from "@/components/logout-button";
import Link from "next/link";

export const dynamic = "force-dynamic";

const dtFormatter = new Intl.DateTimeFormat("es-AR", {
  dateStyle: "short",
  timeStyle: "short",
});

export default async function ProfessionalPage() {
  const session = await requireRole("PROFESSIONAL");

  const professional = await prisma.professional.findUnique({
    where: { id: session.professionalId },
    include: {
      consultory: true,
      schedules: {
        orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
      },
      appointments: {
        orderBy: { startsAt: "asc" },
        take: 20,
      },
    },
  });

  if (!professional) {
    return (
      <main style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <section style={{ background: "white", padding: "2rem", borderRadius: "16px", boxShadow: "var(--shadow)" }}>
          <p>No se encontró perfil profesional asociado al usuario.</p>
          <div style={{ marginTop: "1rem" }}><LogoutButton /></div>
        </section>
      </main>
    );
  }

  return (
    <div style={{ background: "var(--color-background)", minHeight: "100vh" }}>
      <header style={{ 
        background: "white", 
        borderBottom: "1px solid var(--color-border)", 
        padding: "1rem 2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div style={{ alignItems: "center", display: "flex", gap: "0.75rem" }}>
          <img src="/delta-logo.svg" alt="Delta Consultorios City Bell" className="brand-logo small" />
          <h1 style={{ color: "var(--color-primary)", fontSize: "1.25rem", margin: 0 }}>Delta | Panel Profesional</h1>
        </div>
        <div className="header-actions">
          <Link href="/" className="header-home-link">Inicio</Link>
          <Link href="/calendario" className="header-home-link">Agenda publica</Link>
          <LogoutButton />
        </div>
      </header>

      <main style={{ maxWidth: "1200px", margin: "2rem auto", padding: "0 2rem", display: "flex", flexDirection: "column", gap: "2rem" }}>
        
        {/* Cabecera del Perfil */}
        <section style={{ 
          background: "white", 
          padding: "2rem", 
          borderRadius: "16px", 
          boxShadow: "var(--shadow)",
          border: "1px solid var(--color-border)",
          display: "flex",
          gap: "1.5rem",
          alignItems: "center"
        }}>
          <div style={{
            width: "80px", height: "80px", borderRadius: "50%", background: "var(--color-muted-bg)",
            display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-primary)",
            fontSize: "2rem", fontWeight: "bold"
          }}>
            {professional.fullName.charAt(0)}
          </div>
          <div>
            <h1 style={{ margin: "0 0 0.5rem 0", fontSize: "1.8rem" }}>{professional.fullName}</h1>
            <p style={{ margin: 0, color: "var(--color-muted)", fontSize: "1rem" }}>
              <strong>Especialidad:</strong> {professional.specialty} <br/>
              <strong>Sede:</strong> {professional.consultory.name}
            </p>
          </div>
        </section>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "2rem", alignItems: "start" }}>
          
          {/* Disponibilidad */}
          <section style={{ 
            background: "white", 
            padding: "1.5rem", 
            borderRadius: "16px", 
            boxShadow: "var(--shadow)",
            border: "1px solid var(--color-border)"
          }}>
            <h2 style={{ fontSize: "1.25rem", margin: "0 0 1.5rem 0" }}>Mis Horarios de Atención</h2>
            <ProfessionalAvailabilityEditor
              initialSchedules={professional.schedules.map((item) => ({
                dayOfWeek: item.dayOfWeek,
                startTime: item.startTime,
                endTime: item.endTime,
                telehealth: item.telehealth,
              }))}
            />
          </section>

          {/* Tabla de turnos */}
          <section style={{ 
            background: "white", 
            borderRadius: "16px", 
            boxShadow: "var(--shadow)", 
            border: "1px solid var(--color-border)",
            overflow: "hidden" 
          }}>
            <div style={{ padding: "1.5rem", borderBottom: "1px solid var(--color-border)" }}>
              <h2 style={{ fontSize: "1.25rem", margin: 0 }}>Mis Turnos Próximos</h2>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead style={{ background: "var(--color-muted-bg)" }}>
                  <tr>
                    <th style={{ padding: "1rem", color: "var(--color-muted)", fontSize: "0.85rem", textTransform: "uppercase" }}>Paciente</th>
                    <th style={{ padding: "1rem", color: "var(--color-muted)", fontSize: "0.85rem", textTransform: "uppercase" }}>Motivo</th>
                    <th style={{ padding: "1rem", color: "var(--color-muted)", fontSize: "0.85rem", textTransform: "uppercase" }}>Fecha y Hora</th>
                    <th style={{ padding: "1rem", color: "var(--color-muted)", fontSize: "0.85rem", textTransform: "uppercase" }}>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {professional.appointments.map((item) => (
                    <tr key={item.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                      <td style={{ padding: "1rem" }}>
                        <strong style={{ display: "block" }}>{item.patientName}</strong>
                        <span style={{ fontSize: "0.8rem", color: "var(--color-muted)" }}>{item.patientEmail}</span>
                      </td>
                      <td style={{ padding: "1rem", color: "var(--color-muted)", fontSize: "0.9rem" }}>{item.reason || "-"}</td>
                      <td style={{ padding: "1rem", fontWeight: "600" }}>{dtFormatter.format(item.startsAt)}</td>
                      <td style={{ padding: "1rem" }}>
                        <span style={{ 
                          background: "var(--color-muted-bg)", 
                          color: "var(--color-primary)", 
                          padding: "0.25rem 0.75rem", 
                          borderRadius: "99px",
                          fontSize: "0.8rem",
                          fontWeight: "700"
                        }}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {professional.appointments.length === 0 && (
                    <tr>
                      <td colSpan={4} style={{ padding: "2rem", textAlign: "center", color: "var(--color-muted)" }}>No tenés turnos registrados.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

      </main>
    </div>
  );
}
