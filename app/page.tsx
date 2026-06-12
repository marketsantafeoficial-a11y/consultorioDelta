import Link from "next/link";
import { DrawTitle } from "@/components/TextAnimations.client";
import { RevealOnScroll } from "@/components/RevealOnScroll.client";
import { instagramDemo } from "@/lib/instagram-demo";
import { FloatingWhatsApp, SiteHeader } from "@/components/site-header";
import ConsultorioSchedules from "@/components/ConsultorioSchedules.client";
import { CalendarIcon, HeartIcon, PinIcon, SpecialtyIcon, StarIcon, UserIcon, UsersIcon } from "@/components/ui/site-icons";

export const metadata = {
  title: "Delta Espacios Profesionales | City Bell",
  description:
    "Consultorios para profesionales de la salud en City Bell. Psicologia, salud integral, turnos por WhatsApp y alquiler de espacios por modulo.",
};

const SPECIALTIES = [
  { id: "psicologia", label: "Psicologia", desc: "Acompanamiento emocional, procesos personales, ansiedad, autoestima, duelos y vinculos." },
  { id: "psicopedagogia", label: "Psicopedagogia", desc: "Procesos de aprendizaje, orientacion y acompanamiento personalizado." },
  { id: "terapia-ocupacional", label: "Terapia ocupacional", desc: "Autonomia, bienestar y calidad de vida a traves de actividades significativas." },
  { id: "nutricion", label: "Nutricion", desc: "Habitos saludables, alimentacion consciente y bienestar integral." },
  { id: "optometria", label: "Optometria", desc: "Evaluacion, prevencion y cuidado de la salud visual." },
  { id: "seguros", label: "Productora de seguros", desc: "Asesoramiento personalizado para personas, bienes y proyectos." },
];

const stats = [
  [<UsersIcon key="users" />, "1", "Sede"],
  [<StarIcon key="star" />, "7", "Consultorios"],
  [<HeartIcon key="heart" />, "6", "Especialidades"],
  [<PinIcon key="pin" />, "City Bell", "Ubicacion estrategica"],
];

const consultorioGallery = [
  ["Recepcion", "/delta-assets/consultorio-hero-ai.png"],
  ["Sala de espera", "/delta-assets/consultorio-equipo-ai.png"],
  ["Consultorio 1", "/delta-assets/consultorio-alquiler-ai.png"],
  ["Consultorio 3", "/delta-assets/ig-post-consultorio.jpg"],
];

const testimonials = [
  ["Maria G.", "Excelente atencion y espacios muy comodos. Me senti muy bien acompanada."],
  ["Juan P.", "Encontre varios profesionales en un mismo lugar. Super recomendable."],
  ["Sofia L.", "La coordinacion por WhatsApp fue practica y agil."],
];

export default function HomePage() {
  return (
    <div className="lp-shell">
      <SiteHeader />
      <main>
        <section className="lp-hero lp-hero-showcase">
          <div className="lp-hero-copy">
            <img
              src="/delta-assets/delta-logo-citybell.png"
              alt="Delta Espacios Profesionales City Bell"
              className="lp-hero-logo"
            />
            <p className="lp-eyebrow">Cantilo N 146 · City Bell</p>
            <h1 className="lp-hero-title">
              Vida para tu espacio
              <br />
              y profesionales para acompanarte
            </h1>
            <p className="lp-hero-sub">
              Delta reune consultorios preparados para psicologos, profesionales de la salud y espacios de escucha, terapia, entrevistas y atencion presencial. Tambien podes conocer al equipo, ver sus perfiles y escribir por WhatsApp sin pasar por una agenda automatica.
            </p>
            <div className="lp-hero-actions">
              <Link href="/#agenda-turno" className="lp-cta-primary"><CalendarIcon />Reservar turno</Link>
              <Link href="/profesionales" className="lp-cta-secondary"><UserIcon />Conocer profesionales</Link>
            </div>
          </div>
          <div className="lp-hero-visual" aria-hidden="true">
            <img src="/delta-assets/consultorio-hero-ai.png" alt="" />
          </div>
        </section>

        <section className="lp-stats-strip" aria-label="Datos de Delta">
          {stats.map(([icon, value, label]) => (
            <article key={String(label)}>
              <span className="stat-icon">{icon}</span>
              <strong>{value}</strong>
              <span>{label}</span>
            </article>
          ))}
        </section>

        <section id="quienes-somos" className="lp-section">
          <div className="lp-section-inner">
            <RevealOnScroll><DrawTitle tag="h2" className="lp-section-title">Quienes somos</DrawTitle></RevealOnScroll>
            <RevealOnScroll delay={120}>
              <div className="quienes-somos-text">
                <p>Delta es un espacio profesional en el centro de City Bell, pensado para reunir distintas disciplinas en un entorno calido, comodo y funcional.</p>
                <p>Trabajamos como red interdisciplinaria, con profesionales de diferentes areas y una atencion cercana, organizada y respetuosa.</p>
                <p>El espacio cuenta con consultorios equipados, ambientes luminosos, sala de espera y condiciones preparadas para brindar comodidad, privacidad y continuidad de trabajo.</p>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        <section id="especialidades" className="lp-section lp-how">
          <div className="lp-section-inner">
            <RevealOnScroll><DrawTitle tag="h2" className="lp-section-title">Especialidades</DrawTitle></RevealOnScroll>
            <RevealOnScroll delay={100}>
              <p className="lp-section-sub">Conoce las disciplinas que forman parte de nuestra red profesional.</p>
            </RevealOnScroll>
            <div className="specialty-card-grid">
              {SPECIALTIES.map((spec, i) => (
                <RevealOnScroll key={spec.id} delay={i * 50}>
                  <article className="specialty-ui-card">
                    <SpecialtyIcon className="specialty-ui-icon" />
                    <h3>{spec.label}</h3>
                    <p>{spec.desc}</p>
                  </article>
                </RevealOnScroll>
              ))}
            </div>
            <div className="lp-cta-center-wrap">
              <Link href="/profesionales" className="lp-cta-secondary">Ver todas las especialidades</Link>
            </div>
          </div>
        </section>

        <section id="red-profesionales" className="lp-section">
          <div className="lp-section-inner">
            <RevealOnScroll>
              <DrawTitle tag="h2" className="lp-section-title">Nuestros profesionales</DrawTitle>
            </RevealOnScroll>
            <RevealOnScroll delay={120}>
              <p className="lp-section-sub">Conoce a nuestro equipo interdisciplinario y completa el formulario para coordinar tu consulta.</p>
            </RevealOnScroll>
            <div className="lp-feature-row">
              <div>
                <img src="/delta-assets/consultorio-equipo-ai.png" alt="Espacio de espera Delta" />
              </div>
              <article>
                <h3>Atencion con cita previa</h3>
                <p>Las consultas se coordinan por WhatsApp. Te orientamos para encontrar el profesional o la especialidad que mejor se adapte a lo que estas buscando.</p>
                <Link href="/profesionales" className="lp-cta-primary">Ver profesionales</Link>
              </article>
            </div>
          </div>
        </section>

        <section id="agenda-turno" className="lp-section lp-how">
          <div className="lp-section-inner">
            <div className="dual-cta-grid">
              <RevealOnScroll>
                <article className="soft-cta-card">
                  <h2>¿Buscas un profesional?</h2>
                  <p>Encontra al especialista indicado y reserva tu consulta en menos de 1 minuto.</p>
                  <Link href="/profesionales#derivacion" className="lp-cta-primary"><CalendarIcon />Reservar turno</Link>
                </article>
              </RevealOnScroll>
              <RevealOnScroll delay={120}>
                <article className="soft-cta-card">
                  <h2>¿Buscas un espacio para atender?</h2>
                  <p>Sumate a nuestro equipo de profesionales y empeza a trabajar con nosotros.</p>
                  <a
                    href="https://wa.me/5492214778280?text=Hola%2C%20quiero%20reservar%20un%20modulo%20en%20Delta.%20Mi%20profesion%20es%3A"
                    className="lp-cta-primary"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <CalendarIcon />Reservar modulo
                  </a>
                </article>
              </RevealOnScroll>
            </div>
          </div>
        </section>

        <section id="alquila-espacio" className="lp-section">
          <div className="lp-section-inner">
            <RevealOnScroll>
              <DrawTitle tag="h2" className="lp-section-title">Nuestros consultorios</DrawTitle>
            </RevealOnScroll>
            <RevealOnScroll delay={100}>
              <p className="lp-section-sub">Espacios disenados para el bienestar, la comodidad y el trabajo profesional.</p>
            </RevealOnScroll>
            <div className="consultorio-gallery">
              {consultorioGallery.map(([label, image]) => (
                <article key={label}>
                  <img src={image} alt={label} />
                  <span>{label}</span>
                </article>
              ))}
            </div>
            <RevealOnScroll delay={180}>
              <div className="schedules-section">
                <h3 className="schedules-title">Disponibilidad de consultorios</h3>
                <p className="schedules-subtitle">Hace clic en cada consultorio para ver horarios libres, ocupados o reservados.</p>
                <ConsultorioSchedules />
              </div>
            </RevealOnScroll>
          </div>
        </section>

        <section className="lp-section lp-how">
          <div className="lp-section-inner">
            <RevealOnScroll><DrawTitle tag="h2" className="lp-section-title">Lo que dicen nuestros pacientes</DrawTitle></RevealOnScroll>
            <div className="testimonial-grid">
              {testimonials.map(([name, text]) => (
                <article key={name} className="testimonial-card">
                  <span>★★★★★</span>
                  <p>{text}</p>
                  <strong>{name}</strong>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="contacto" className="lp-section">
          <div className="lp-section-inner">
            <RevealOnScroll><DrawTitle tag="h2" className="lp-section-title">Contacto</DrawTitle></RevealOnScroll>
            <RevealOnScroll delay={120}>
              <div className="contact-grid">
                <div className="contact-info-card">
                  <h3>WhatsApp</h3>
                  <p>221 477 8280</p>
                  <a href="https://wa.me/5492214778280?text=Hola%2C%20quiero%20consultar%20por%20Delta." className="lp-cta-primary" target="_blank" rel="noreferrer">Escribinos por WhatsApp</a>
                </div>
                <div className="contact-info-card">
                  <h3>Ubicacion</h3>
                  <p>Cantilo N 146, City Bell 1896</p>
                  <p>Lunes a sabados de 9 a 20 hs</p>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </section>
      </main>

      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <div>
            <img src="/delta-assets/delta-logo-citybell.png" alt="Delta Espacios Profesionales" className="footer-logo" />
            <p className="lp-footer-tagline">{instagramDemo.location}</p>
          </div>
          <div className="lp-footer-links">
            <Link href="/">Inicio</Link>
            <Link href="/profesionales">Profesionales</Link>
            <Link href="/#especialidades">Especialidades</Link>
            <Link href="/#alquila-espacio">Alquiler de espacios</Link>
            <Link href="/auth/login" className="footer-admin-link">Admin</Link>
          </div>
        </div>
      </footer>
      <FloatingWhatsApp />
    </div>
  );
}
