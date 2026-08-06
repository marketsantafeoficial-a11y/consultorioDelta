import Link from "next/link";
import { DrawTitle } from "@/components/TextAnimations.client";
import { RevealOnScroll } from "@/components/RevealOnScroll.client";
import { instagramDemo } from "@/lib/instagram-demo";
import { getConsultorioAvailability } from "@/lib/dashboard-data";
import { FloatingWhatsApp, SiteHeader } from "@/components/site-header";
import ConsultorioSchedules from "@/components/ConsultorioSchedules.client";
import { CalendarIcon, HeartIcon, PinIcon, SpecialtyIcon, StarIcon, UserIcon, UsersIcon } from "@/components/ui/site-icons";
import { getWhatsAppHref } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

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
  [<PinIcon key="pin" />, "City Bell", ""],
];

const FIXED_MODULES: [string, string][] = [
  ["Manana", "9 a 12 hs"],
  ["Mediodia", "12 a 16 hs"],
  ["Tarde", "16 a 20 hs"],
];

const consultorioGallery = [
  ["Sala de espera", "/delta-assets/delta-sala-espera.webp"],
  ["Consultorio 3 - planta baja", "/delta-assets/delta-consultorio-3.webp"],
  ["Consultorio 4 - arriba", "/delta-assets/delta-consultorio-4.webp"],
  ["Consultorio 5 - arriba", "/delta-assets/delta-consultorio-5.webp"],
  ["Consultorio 6 - arriba", "/delta-assets/delta-consultorio-6.webp"],
  ["Consultorio 7 - arriba", "/delta-assets/delta-consultorio-7.webp"],
];

const testimonials = [
  ["Paciente Delta", "El espacio es tranquilo, comodo y la atencion fue muy cercana desde el primer contacto."],
  ["Familia consultante", "Pudimos coordinar por WhatsApp de forma simple y llegar a la consulta con todo claro."],
  ["Profesional de la red", "Los consultorios son luminosos, funcionales y estan cuidados para trabajar con comodidad."],
];

export default async function HomePage() {
  const consultorios = await getConsultorioAvailability();

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
            <p className="lp-eyebrow">City Bell</p>
            <h1 className="lp-hero-title">Espacios donde los encuentros acompanan el cambio.</h1>
            <p className="lp-hero-sub">
              En Delta encontraras profesionales de distintas disciplinas que comparten el compromiso de brindar atencion y asesoramiento inmediato para tus necesidades. Conoce sus perfiles y contactate de manera directa para coordinar una consulta.
            </p>
            <p className="lp-hero-note">Atencion unicamente con cita previa coordinada por WhatsApp.</p>
            <div className="lp-hero-actions">
              <Link href="/#agenda-turno" className="lp-cta-primary"><CalendarIcon />Reservar turno</Link>
              <Link href="/profesionales" className="lp-cta-secondary"><UserIcon />Conocer profesionales</Link>
            </div>
          </div>
          <div className="lp-hero-visual" aria-hidden="true">
            <img src="/delta-assets/delta-sala-espera.webp" alt="" />
          </div>
        </section>

        <section className="lp-stats-strip" aria-label="Datos de Delta">
          {stats.map(([icon, value, label]) => (
            <article key={String(value)}>
              <span className="stat-icon">{icon}</span>
              <strong>{value}</strong>
              {label ? <span>{label}</span> : null}
            </article>
          ))}
        </section>

        <section id="agenda-turno" className="lp-section lp-how">
          <div className="lp-section-inner">
            <div className="dual-cta-grid">
              <RevealOnScroll>
                <article className="soft-cta-card">
                  <h2>Buscas un profesional para acompanarte?</h2>
                  <p>Encontra el profesional indicado y coordina tu consulta de manera directa.</p>
                  <Link href="/profesionales#derivacion" className="lp-cta-primary"><CalendarIcon />Reservar turno</Link>
                </article>
              </RevealOnScroll>
              <RevealOnScroll delay={120}>
                <article className="soft-cta-card">
                  <h2>Buscas un espacio para atender?</h2>
                  <p>Sumate a nuestro equipo de profesionales y empeza a trabajar con nosotros.</p>
                  <a
                    href={getWhatsAppHref("Hola! Quiero consultar por alquilar un modulo en Delta.")}
                    className="lp-cta-primary"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <CalendarIcon />Alquilar modulo
                  </a>
                </article>
              </RevealOnScroll>
            </div>
          </div>
        </section>

        <section id="quienes-somos" className="lp-section">
          <div className="lp-section-inner">
            <RevealOnScroll><DrawTitle tag="h2" className="lp-section-title">Quienes somos</DrawTitle></RevealOnScroll>
            <RevealOnScroll delay={120}>
              <div className="quienes-somos-text">
                <p>Delta es un espacio profesional ubicado en el centro de City Bell. Desde 2023 reunimos distintas disciplinas en un entorno calido, comodo y funcional. Pensamos cada detalle para ofrecer un lugar agradable tanto para profesionales como para quienes llegan en busca de atencion y acompanamiento.</p>
                <p>En nuestro espacio trabajan profesionales de diferentes areas, generando una comunidad basada en el respeto, la cercania y el compromiso con cada persona que nos elige, de acuerdo a su necesidad.</p>
                <p>Contamos con consultorios equipados, espacios luminosos y un entorno preparado para brindar comodidad, tranquilidad y privacidad. Buscamos que cada encuentro, consulta o jornada de trabajo se desarrolle en un ambiente cuidado y organizado.</p>
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
              <p className="lp-section-sub">Conoce a los profesionales que forman parte de Delta y coordina tu consulta de manera simple y directa.</p>
            </RevealOnScroll>
            <div className="lp-feature-row">
              <div>
                <img src="/delta-assets/delta-consultorio-4.webp" alt="Consultorio equipado de Delta" />
              </div>
              <article>
                <h3>Atencion con cita previa</h3>
                <p>Trabajamos exclusivamente con turnos programados previamente. Conoce los perfiles profesionales y contactate directamente por WhatsApp para coordinar tu consulta, resolver dudas o recibir mas informacion.</p>
                <Link href="/profesionales" className="lp-cta-primary">Ver profesionales</Link>
              </article>
            </div>
          </div>
        </section>

        <section id="alquila-espacio" className="lp-section">
          <div className="lp-section-inner">
            <RevealOnScroll>
              <DrawTitle tag="h2" className="lp-section-title">Alquila tu espacio</DrawTitle>
            </RevealOnScroll>
            <RevealOnScroll delay={100}>
              <p className="lp-section-sub">Buscas un espacio listo para atender? Este lugar es ideal para vos. En Delta contamos con consultorios y oficinas totalmente equipadas, ideales para profesionales que deseen trabajar en un espacio comodo, luminoso y bien ubicado.</p>
            </RevealOnScroll>
            <div className="rental-detail-grid rental-detail-grid-wide">
              <article>
                <h3>El espacio cuenta con</h3>
                <p>WiFi, sala de espera, bano, cocina, AA frio/calor, escritorio, divan y portero individual. No contamos con secretaria.</p>
              </article>
              <article>
                <h3>Modalidad de alquiler</h3>
                <p>Se alquilan por modulos fijos o jornada completa. El valor se adapta segun la cantidad de modulos que necesites.</p>
              </article>
              <article>
                <h3>Beneficios exclusivos</h3>
                <p>Consultanos por los beneficios y promociones especiales para nuestros profesionales.</p>
              </article>
            </div>
            <div className="consultorio-gallery">
              {consultorioGallery.map(([label, image]) => (
                <article key={label}>
                  <img src={image} alt={label} loading="lazy" />
                  <span>{label}</span>
                </article>
              ))}
            </div>
            <RevealOnScroll delay={180}>
              <div className="schedules-section">
                <h3 className="schedules-title">Disponibilidad de consultorios</h3>
                <p className="schedules-subtitle">Hace clic en cada consultorio para ver los modulos disponibles u ocupados.</p>
                <div className="fixed-modules-summary">
                  <span className="fixed-modules-eyebrow">Disponibilidad por modulos fijos</span>
                  <div className="fixed-modules-grid">
                    {FIXED_MODULES.map(([label, hours]) => (
                      <article key={label}>
                        <span className="fixed-modules-label">{label}</span>
                        <strong className="fixed-modules-hours">{hours}</strong>
                        <span className="fixed-modules-tag">Modulo fijo</span>
                      </article>
                    ))}
                  </div>
                </div>
                <ConsultorioSchedules consultorios={consultorios} />
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
                  <span>*****</span>
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
            <RevealOnScroll delay={80}>
              <p className="lp-section-sub">Lunes a sabados de 9 a 20 hs.</p>
            </RevealOnScroll>
            <RevealOnScroll delay={120}>
              <div className="contact-grid">
                <div className="contact-info-card">
                  <h3>WhatsApp</h3>
                  <p>221 477 8280</p>
                  <a href={getWhatsAppHref("Hola! Quiero consultar por Delta Espacios Profesionales.")} className="lp-cta-primary" target="_blank" rel="noreferrer">Escribinos por WhatsApp</a>
                </div>
                <div className="contact-info-card">
                  <h3>Ubicacion</h3>
                  <p>Calle 467 N 164, e/13A y 13B, City Bell 1896</p>
                  <p className="contact-highlight">Solo con cita previa</p>
                </div>
                <div className="contact-info-card">
                  <h3>Redes</h3>
                  <p>Facebook: Delta Espacios Profesionales</p>
                  <p>Instagram: Delta Espacios Profesionales</p>
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
            <Link href="/#alquila-espacio">Alquiler de espacios</Link>
          </div>
        </div>
      </footer>
      <FloatingWhatsApp />
    </div>
  );
}
