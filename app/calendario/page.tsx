import Link from "next/link";
import { getDashboardData } from "@/lib/dashboard-data";
import { isSpaceResource } from "@/lib/resource-kind";
import ProfessionalCalendar from "@/components/ProfessionalCalendar.client";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Agenda | Delta Consultorios",
  description: "Agenda de modulos alquilables y turnos profesionales.",
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
  const agendaProfessionals = professionals.filter((item) => !isSpaceResource(item));
  const appointments = mapAppointments(upcomingAppointments);

  return (
    <div className="cal-shell">
      <header className="cal-navbar">
        <nav className="cal-navbar-inner">
          <Link href="/" className="cal-brand">
            <img src="/delta-logo.svg" alt="Delta Consultorios City Bell" className="brand-logo" />
            Delta Consultorios
          </Link>
          <div className="cal-nav-links">
            <Link href="/">Inicio</Link>
            <a href="https://wa.me/5492214778280?text=Hola%2C%20quiero%20consultar%20por%20Delta%20Consultorios." target="_blank" rel="noreferrer">
              221 477 8280
            </a>
            <Link href="/auth/login" className="cal-nav-cta">Ingresar</Link>
          </div>
        </nav>
      </header>

      <main className="cal-main">
        <div className="cal-hero-text">
          <h1 className="cal-hero-title">Agendas Delta</h1>
          <p className="cal-hero-sub">
            {spaces.length} espacios para alquilar y {agendaProfessionals.length} profesionales con agenda propia.
          </p>
          <div className="cal-flow-panel">
            <strong>Dos flujos independientes para la demo:</strong>
            <span>1. Alquiler de modulos: lo consulta el interesado y lo confirma administracion.</span>
            <span>2. Turnos profesionales: el paciente solicita turno con su profesional.</span>
            <span>3. Cada profesional ve sus turnos en su panel, separado del alquiler de espacios.</span>
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

        <section className="calendar-demo-section">
          <div className="calendar-demo-head">
            <span>Flujo 2</span>
            <h2>Turnos con profesionales</h2>
            <p>Los pacientes piden turno con un profesional. Ese pedido aparece en el panel independiente del profesional.</p>
          </div>
          <ProfessionalCalendar
            purpose="appointments"
            professionals={mapResources(agendaProfessionals)}
            appointments={appointments}
          />
        </section>
      </main>
    </div>
  );
}
