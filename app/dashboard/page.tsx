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
    <main className="page-wrap">
      <section className="card dashboard-head">
        <h1>Panel Administrador</h1>
        <div className="hero-stats">
          <article>
            <strong>{consultoriesCount}</strong>
            <span>Consultorios</span>
          </article>
          <article>
            <strong>{professionalsCount}</strong>
            <span>Profesionales</span>
          </article>
          <article>
            <strong>{appointments.length}</strong>
            <span>Turnos visibles</span>
          </article>
        </div>
        <LogoutButton />
      </section>

      <section className="table-shell">
        <table>
          <thead>
            <tr>
              <th>Paciente</th>
              <th>Profesional</th>
              <th>Consultorio</th>
              <th>Fecha</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((item) => (
              <tr key={item.id}>
                <td>{item.patientName}</td>
                <td>{item.professional.fullName}</td>
                <td>{item.consultory.name}</td>
                <td>{dtFormatter.format(item.startsAt)}</td>
                <td>{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
