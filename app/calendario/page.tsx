import { getDashboardData } from "@/lib/dashboard-data";
import { isSpaceResource } from "@/lib/resource-kind";
import ProfessionalCalendar from "@/components/ProfessionalCalendar.client";
import { FloatingWhatsApp, SiteHeader } from "@/components/site-header";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Agenda | Delta Consultorios",
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
          <h1 className="cal-hero-title">Agenda de modulos Delta</h1>
          <p className="cal-hero-sub">
            Consulta la disponibilidad de {spaces.length} espacios para alquilar por modulo.
          </p>
          <div className="cal-flow-panel">
            <strong>Reserva administrada:</strong>
            <span>1. Elegi un modulo libre como referencia.</span>
            <span>2. Contacta a administracion por WhatsApp con el dia y horario.</span>
            <span>3. Administracion valida disponibilidad, condiciones y confirma la reserva.</span>
          </div>
        </div>

        <section className="calendar-demo-section">
          <div className="calendar-demo-head">
            <span>Flujo 1</span>
            <h2>Alquiler de modulos</h2>
            <p>Los profesionales externos ven espacios libres, pero la reserva comercial la maneja administracion.</p>
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
