import { requireRole } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { LogoutButton } from "@/components/logout-button";

const dtFormatter = new Intl.DateTimeFormat("es-AR", {
  dateStyle: "short",
  timeStyle: "short",
});

export default async function DashboardPage() {
  await requireRole("ADMIN");

  const [consultoriesCount, professionalsCount, appointments] = await Promise.all([
    prisma.consultory.count(),
    prisma.professional.count(),
    prisma.appointment.findMany({
      include: { professional: true, consultory: true },
      orderBy: { startsAt: "asc" },
      take: 20,
    }),
  ]);

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
        <h1 style={{ color: "var(--color-primary)", fontSize: "1.25rem", margin: 0 }}>Delta Administrador</h1>
        <LogoutButton />
      </header>

      <main style={{ maxWidth: "1200px", margin: "2rem auto", padding: "0 2rem", display: "flex", flexDirection: "column", gap: "2rem" }}>
        
        {/* Estadísticas */}
        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem" }}>
          {[
            { value: consultoriesCount, label: "Consultorios Activos" },
            { value: professionalsCount, label: "Profesionales Registrados" },
            { value: appointments.length, label: "Turnos Próximos" },
          ].map((stat, i) => (
            <div key={i} style={{ 
              background: "white", 
              padding: "2rem", 
              borderRadius: "16px", 
              boxShadow: "var(--shadow)",
              border: "1px solid var(--color-border)"
            }}>
              <strong style={{ display: "block", fontSize: "2.5rem", color: "var(--color-primary)", lineHeight: 1 }}>{stat.value}</strong>
              <span style={{ color: "var(--color-muted)", fontWeight: "600", fontSize: "0.9rem", textTransform: "uppercase" }}>{stat.label}</span>
            </div>
          ))}
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
            <h2 style={{ fontSize: "1.25rem", margin: 0 }}>Últimos turnos agendados</h2>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead style={{ background: "var(--color-muted-bg)" }}>
                <tr>
                  <th style={{ padding: "1rem 1.5rem", color: "var(--color-muted)", fontSize: "0.85rem", textTransform: "uppercase" }}>Paciente</th>
                  <th style={{ padding: "1rem 1.5rem", color: "var(--color-muted)", fontSize: "0.85rem", textTransform: "uppercase" }}>Profesional</th>
                  <th style={{ padding: "1rem 1.5rem", color: "var(--color-muted)", fontSize: "0.85rem", textTransform: "uppercase" }}>Sede</th>
                  <th style={{ padding: "1rem 1.5rem", color: "var(--color-muted)", fontSize: "0.85rem", textTransform: "uppercase" }}>Fecha</th>
                  <th style={{ padding: "1rem 1.5rem", color: "var(--color-muted)", fontSize: "0.85rem", textTransform: "uppercase" }}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((item) => (
                  <tr key={item.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                    <td style={{ padding: "1rem 1.5rem", fontWeight: "600" }}>{item.patientName}</td>
                    <td style={{ padding: "1rem 1.5rem" }}>{item.professional.fullName}</td>
                    <td style={{ padding: "1rem 1.5rem", color: "var(--color-muted)" }}>{item.consultory.name}</td>
                    <td style={{ padding: "1rem 1.5rem" }}>{dtFormatter.format(item.startsAt)}</td>
                    <td style={{ padding: "1rem 1.5rem" }}>
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
                {appointments.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ padding: "2rem", textAlign: "center", color: "var(--color-muted)" }}>No hay turnos registrados.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
