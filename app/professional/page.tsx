import { requireRole } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { ProfessionalAvailabilityEditor } from "@/components/professional-availability-editor";
import { LogoutButton } from "@/components/logout-button";

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
      <main className="page-wrap">
        <section className="card">
          <p>No se encontro perfil profesional asociado al usuario.</p>
          <LogoutButton />
        </section>
      </main>
    );
  }

  return (
    <main className="page-wrap">
      <section className="card dashboard-head">
        <h1>{professional.fullName}</h1>
        <p>{professional.specialty}</p>
        <p>{professional.consultory.name}</p>
        <LogoutButton />
      </section>

      <ProfessionalAvailabilityEditor
        initialSchedules={professional.schedules.map((item) => ({
          dayOfWeek: item.dayOfWeek,
          startTime: item.startTime,
          endTime: item.endTime,
          telehealth: item.telehealth,
        }))}
      />

      <section className="table-shell">
        <table>
          <thead>
            <tr>
              <th>Paciente</th>
              <th>Email</th>
              <th>Motivo</th>
              <th>Fecha</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {professional.appointments.map((item) => (
              <tr key={item.id}>
                <td>{item.patientName}</td>
                <td>{item.patientEmail}</td>
                <td>{item.reason}</td>
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
