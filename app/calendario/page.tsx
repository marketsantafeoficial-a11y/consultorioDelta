import Link from "next/link";
import { getDashboardData } from "@/lib/dashboard-data";
import ProfessionalCalendar from "@/components/ProfessionalCalendar.client";

export const metadata = {
  title: "Agenda | Delta Consultorios",
  description: "Consulta la disponibilidad de consultorios y reserva tu modulo.",
};

export default async function CalendarioPage() {
  const { consultories, professionals, upcomingAppointments } = await getDashboardData();

  return (
    <div className="cal-shell">
      {/* Navbar */}
      <header className="cal-navbar">
        <nav className="cal-navbar-inner">
          <Link href="/" className="cal-brand">Delta Consultorios</Link>
          <div className="cal-nav-links">
            <Link href="/">Inicio</Link>
            <Link href="/auth/login" className="cal-nav-cta">Ingresar</Link>
          </div>
        </nav>
      </header>

      <main className="cal-main">
        <div className="cal-hero-text">
          <h1 className="cal-hero-title">Agenda de consultorios</h1>
          <p className="cal-hero-sub">
            {professionals.length} espacios disponibles ·{" "}
            {consultories.length} sedes en City Bell
          </p>
        </div>

        <ProfessionalCalendar
          professionals={professionals.map((p) => ({
            ...p,
            id: String(p.id),
            consultory: p.consultory
              ? { name: p.consultory.name, city: p.consultory.city }
              : null,
          }))}
          appointments={upcomingAppointments.map((a) => ({
            id: String(a.id),
            professionalId: String(a.professionalId ?? a.professional?.id),
            patientName: a.patientName,
            startsAt:
              a.startsAt instanceof Date
                ? a.startsAt.toISOString()
                : String(a.startsAt),
            status: a.status,
          }))}
        />
      </main>
    </div>
  );
}
