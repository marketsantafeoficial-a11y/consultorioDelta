import { getDashboardData } from "@/lib/dashboard-data";
import { isSpaceResource } from "@/lib/resource-kind";
import ProfessionalCalendar from "@/components/ProfessionalCalendar.client";
import { FloatingWhatsApp, SiteHeader } from "@/components/site-header";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Agenda | DELTA – ESPACIOS PROFESIONALES",
  description: "Agenda publica de modulos alquilables.",
};

function mapAppointments(upcomingAppointments: Awaited<ReturnType<typeof getDashboardData>>["upcomingAppointments"]) {
  return upcomingAppointments.map((a) => ({
    id: String(a.id),
    professionalId: String(a.professionalId ?? a.professional?.id),
    patientName: a.patientName,
    startsAt:
      a.startsAt instanceof Date
        ? a.startsAt.toISOString()
        : String(a.startsAt),
    status: a.status,
  }));
}

function mapResources(resources: Awaited<ReturnType<typeof getDashboardData>>["professionals"]) {
  return resources.map((p) => ({
    ...p,
    id: String(p.id),
    consultory: p.consultory
      ? { name: p.consultory.name, city: p.consultory.city }
      : null,
  }));
}

export default async function CalendarioPage() {
  const { professionals, upcomingAppointments } = await getDashboardData();
  const spaces = professionals.filter(isSpaceResource);
  const spaceIds = new Set(spaces.map((space) => space.id));
  const appointments = mapAppointments(
    upcomingAppointments.filter((appointment) => spaceIds.has(appointment.professionalId)),
  );

  return (
    <div className="cal-shell">
      <SiteHeader />

      <main className="cal-main">
        <div className="cal-hero-text">
          <h1 className="cal-hero-title">Alquiler de consultorios</h1>
          <p className="cal-hero-sub">
            En pleno centro de City Bell. Consulta la disponibilidad de {spaces.length} espacios
            amplios, luminosos y equipados.
          </p>
          <div className="cal-flow-panel">
            <strong>Programa de alquiler</strong>
            <span>Wifi, sala de espera, bano, cocina, escritorio, AA frio/calor y divan.</span>
            <span>Modulos fijos: manana 8 a 12, mediodia 12 a 16 y tarde 16 a 20 hs.</span>
            <span>Ajustes: noviembre, marzo y julio. No contamos con servicio de secretaria.</span>
          </div>
        </div>

        <section className="calendar-demo-section">
          <div className="calendar-demo-head">
            <span>Disponibilidad por modulos fijos</span>
            <h2>Agenda</h2>
            <p>Usa los horarios libres como referencia y escribinos por WhatsApp para confirmar condiciones.</p>
          </div>
          <ProfessionalCalendar
            purpose="spaces"
            professionals={mapResources(spaces)}
            appointments={appointments}
          />
        </section>
      </main>
      <FloatingWhatsApp />
    </div>
  );
}
