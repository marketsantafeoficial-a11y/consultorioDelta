import { AdminModulesManager } from "@/components/admin-modules-manager.client";
import { AdminPageShell } from "@/components/admin-page-shell";
import { prisma } from "@/lib/prisma";
import { isSpaceResource } from "@/lib/resource-kind";
import { requireRole } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function AdminModulosPage() {
  await requireRole("ADMIN");

  const [sedes, recursos, reservas] = await Promise.all([
    prisma.consultory.findMany({ orderBy: { name: "asc" } }),
    prisma.professional.findMany({
      include: { consultory: true, schedules: true },
      orderBy: { fullName: "asc" },
    }),
    prisma.appointment.findMany({
      include: { professional: true },
      orderBy: { startsAt: "asc" },
      take: 80,
    }),
  ]);

  const consultoriosReservables = recursos.filter(isSpaceResource);

  return (
    <AdminPageShell
      title="Modulos y agenda"
      description="Crear gabinetes, editar disponibilidad, ocupar, mover y liberar horarios."
    >
      <section className="admin-panel-card card">
        <div className="admin-panel-head">
          <span>Agenda interna</span>
          <h2>Editar modulos y horarios</h2>
          <p>Esta pantalla es solo para administrar gabinetes y ocupaciones.</p>
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
    </AdminPageShell>
  );
}
