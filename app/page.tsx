import Link from "next/link";
import Image from "next/image";
import { getDashboardData } from "@/lib/dashboard-data";
import ProfessionalCalendar from "@/components/ProfessionalCalendar.client";

const dateFormatter = new Intl.DateTimeFormat("es-AR", {
  dateStyle: "short",
  timeStyle: "short",
});

export default async function Home() {
  const { consultories, professionals, upcomingAppointments } = await getDashboardData();

  return (
    <main className="landing-shell">
      <header className="tt-nav-wrap">
        <nav className="tt-nav page-wrap">
          <p className="tt-brand">Delta Consultorios</p>
          <div className="tt-nav-links">
            <a href="#como">Como funciona</a>
            <a href="#equipo">Equipo</a>
            <a href="#precios">Precios</a>
            <Link href="/auth/login">Ingresar</Link>
          </div>
        </nav>
      </header>

      <section className="tt-hero page-wrap">
        <article className="tt-hero-content">
          <p className="tt-kicker">Tu Agenda Terapia</p>
          <h1>Encontra tu profesional en segundos</h1>
          <p className="tt-rotate-line">
            Quiero <span>sentirme mejor</span> <span>que me escuchen</span> <span>tener guia profesional</span>
          </p>
          <div className="tt-hero-cta">
            <Link href="/profesionales" className="tt-cta-main">
              Quiero probarlo
            </Link>
            <Link href="/auth/login" className="tt-cta-alt">
              Soy profesional
            </Link>
          </div>
        </article>
        <article className="tt-hero-card">
          <h3>Proximos turnos</h3>
          <ul>
            {upcomingAppointments.slice(0, 3).map((appointment) => (
              <li key={appointment.id}>
                <strong>{appointment.professional.fullName}</strong>
                <span>{appointment.patientName}</span>
                <span>{dateFormatter.format(appointment.startsAt)}</span>
              </li>
            ))}
          </ul>
          <p className="tt-mini">{consultories.length} sedes activas · {professionals.length} profesionales</p>
        </article>
      </section>
        <section className="tt-scheduler page-wrap">
          {/* Professional selector (left) + Calendar (right) client component */}
          <ProfessionalCalendar
            professionals={professionals.map((p) => ({ ...p, id: String(p.id) }))}
            appointments={upcomingAppointments.map((a) => ({
              id: String(a.id),
              professionalId: String(a.professionalId ?? a.professional?.id),
              patientName: a.patientName,
              startsAt: a.startsAt instanceof Date ? a.startsAt.toISOString() : String(a.startsAt),
              status: a.status,
            }))}
          />
        </section>

      <section className="tt-help page-wrap">
        <div>
          <h2>Como te podemos ayudar?</h2>
          <p>
            Centralizamos la agenda de consultorios para que pacientes y profesionales coordinen sin friccion, desde web y celular.
          </p>
        </div>
        <div className="tt-tags-grid">
          <span>Ansiedad</span>
          <span>Relaciones</span>
          <span>Estres laboral</span>
          <span>Autoestima</span>
          <span>Crisis vitales</span>
        </div>
      </section>

      <section id="equipo" className="tt-team page-wrap">
        <div className="tt-section-heading">
          <h2>Equipo</h2>
          <p>Licenciados con experiencia clinica para atencion presencial y online.</p>
        </div>
        <div className="tt-team-grid">
          {professionals.map((professional) => (
            <article key={professional.id} className="tt-team-card">
              <Image
                src={professional.photoUrl ?? "https://placehold.co/420x360?text=Profesional"}
                alt={professional.fullName}
                width={420}
                height={360}
              />
              <div>
                <h3>{professional.fullName}</h3>
                <p>{professional.specialty}</p>
                <small>{professional.consultory.name}</small>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="como" className="tt-steps page-wrap">
        <h2>Como funciona?</h2>
        <div className="tt-step-grid">
          <article>
            <strong>Paso 1</strong>
            <h3>Elegi un profesional</h3>
            <p>Filtra por especialidad y sede para encontrar quien mejor encaje con tu necesidad.</p>
            <span>1</span>
          </article>
          <article>
            <strong>Paso 2</strong>
            <h3>Reserva tu turno</h3>
            <p>Selecciona horario disponible y deja tu solicitud en estado pendiente para confirmacion.</p>
            <span>2</span>
          </article>
        </div>
        <Link href="/profesionales" className="tt-cta-main">
          Quiero probarlo
        </Link>
      </section>

      <section id="precios" className="tt-pricing page-wrap">
        <h2>Elige modalidad</h2>
        <div className="tt-price-grid">
          <article>
            <p>Online</p>
            <h3>ARS 31.000</h3>
          </article>
          <article>
            <p>Presencial</p>
            <h3>ARS 36.000</h3>
          </article>
        </div>
        <small>Podes cambiar modalidad segun disponibilidad profesional.</small>
      </section>

      <section className="tt-consultories page-wrap">
        {consultories.map((consultory) => (
          <article key={consultory.id}>
            <h3>{consultory.name}</h3>
            <p>{consultory.city} · {consultory.address}</p>
          </article>
        ))}
      </section>

      <footer className="tt-footer page-wrap">
        <p>Delta Consultorios</p>
        <Link href="/auth/login">Ingreso equipo</Link>
      </footer>
    </main>
  );
}
