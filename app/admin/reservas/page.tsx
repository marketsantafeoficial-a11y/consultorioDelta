import { AdminPageShell } from "@/components/admin-page-shell";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";

export const dynamic = "force-dynamic";

const dtFormatter = new Intl.DateTimeFormat("es-AR", {
  dateStyle: "short",
  timeStyle: "short",
});

export default async function AdminReservasPage() {
  await requireRole("ADMIN");

  const reservas = await prisma.appointment.findMany({
    include: { consultory: true, professional: true },
    orderBy: { startsAt: "asc" },
    take: 120,
  });

  return (
    <AdminPageShell
      title="Reservas"
      description="Listado completo de ocupaciones y solicitudes."
    >
      <section className="admin-panel-card card">
        <div className="admin-panel-head">
          <span>Tabla completa</span>
          <h2>Reservas de consultorios</h2>
          <p>Para mover o liberar horarios, usa la pantalla Modulos y agenda.</p>
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
            </tbody>
          </table>
        </div>
      </section>
    </AdminPageShell>
  );
}
