import Link from "next/link";
import { DrawTitle, TypewriterText } from "@/components/TextAnimations.client";
import { RevealOnScroll } from "@/components/RevealOnScroll.client";
import { instagramDemo } from "@/lib/instagram-demo";
import { FloatingWhatsApp, SiteHeader } from "@/components/site-header";
import ConsultorioSchedules from "@/components/ConsultorioSchedules.client";

export const metadata = {
  title: "Delta – Espacios Profesionales | City Bell",
  description:
    "Red interdisciplinaria de profesionales en City Bell. Consultorios equipados, agenda online y alquiler de espacios.",
};

const trustIndicators = [
  { value: "+20", label: "Profesionales" },
  { value: "+500", label: "Pacientes\natendidos" },
  { value: "6", label: "Especialidades" },
  { value: "City Bell", label: "Ubicación" },
];

const SPECIALTIES = [
  { id: "psicologia", icon: "🧠", label: "Psicología", desc: "Acompañamiento y escucha orientado al bienestar emocional y el desarrollo personal." },
  { id: "psicopedagogia", icon: "📚", label: "Psicopedagogía", desc: "Acompañamiento en procesos de aprendizaje, desarrollo y orientación." },
  { id: "terapia-ocupacional", icon: "🤲", label: "Terapia Ocupacional", desc: "Intervenciones para promover autonomía, bienestar y calidad de vida." },
  { id: "nutricion", icon: "🥗", label: "Nutrición", desc: "Hábitos saludables, alimentación consciente y bienestar integral." },
  { id: "optometria", icon: "👁️", label: "Optometría", desc: "Evaluación, prevención y cuidado de la salud visual." },
  { id: "seguros", icon: "🛡️", label: "Productora de Seguros", desc: "Asesoramiento para protección de personas, bienes y proyectos." },
  { id: "agrimensura", icon: "📐", label: "Agrimensura", desc: "Mensuras, subdivisiones, estados parcelarios y asesoramiento técnico." },
];

const testimonials = [
  { stars: 5, text: "Excelente atención y espacios muy cómodos. Encontré distintos profesionales en un mismo lugar.", author: "María L." },
  { stars: 5, text: "La agenda online es muy simple de utilizar. Coordinar turno con WhatsApp me resultó rapidísimo.", author: "Carlos R." },
  { stars: 5, text: "Un espacio cálido y profesional. Se nota el cuidado en cada detalle del lugar.", author: "Lucía M." },
];

const featuredProfessionals = [
  { name: "Lic. María López", specialty: "Psicología", photoUrl: "/delta-assets/professional-avatar.svg" },
  { name: "Lic. Carla Ruiz", specialty: "Psicopedagogía", photoUrl: "/delta-assets/professional-avatar.svg" },
  { name: "Lic. Florencia Jaime", specialty: "Terapia Ocupacional", photoUrl: "/delta-assets/professional-avatar.svg" },
  { name: "Lic. Julieta Gómez", specialty: "Nutrición", photoUrl: "/delta-assets/professional-avatar.svg" },
];

const moduleBlocks = [
  ["Mañana", "9 a 12 hs"],
  ["Mediodía", "12 a 16 hs"],
  ["Tarde", "16 a 20 hs"],
  ["Jornada completa", "9 a 20 hs"],
];

const benefits = [
  { icon: "📍", text: "Excelente ubicación en el centro de City Bell" },
  { icon: "🪑", text: "Consultorios totalmente equipados" },
  { icon: "📶", text: "WiFi de alta velocidad" },
  { icon: "🛋️", text: "Sala de espera confortable" },
  { icon: "❄️", text: "Aire acondicionado frío/calor" },
  { icon: "🏢", text: "Ambiente profesional y luminoso" },
];

export default function HomePage() {
  return (
    <div className="lp-shell">
      <SiteHeader />

      <main>
        {/* ═══ HERO ═══ */}
        <section className="lp-hero">
          <div className="lp-hero-inner">
            <div className="lp-hero-content">
              <img src="/delta-logo.svg" alt="Delta Espacios Profesionales" className="lp-hero-logo" />
              <RevealOnScroll direction="left">
                <p className="lp-eyebrow">Cantilo N 146 · City Bell</p>
                <h1 className="lp-hero-title">
                  <TypewriterText text="Espacios profesionales" speed={55} startDelay={250} />
                  <br />
                  <span className="lp-hero-title-accent">para la salud y el bienestar.</span>
                </h1>
                <div className="lp-hero-divider" aria-hidden="true" />
                <p className="lp-hero-sub">
                  Red interdisciplinaria de profesionales, consultorios equipados y agenda online.
                </p>
              </RevealOnScroll>
              <RevealOnScroll delay={180}>
                <div className="lp-hero-actions">
                  <Link href="/#agenda-turno" className="lp-cta-primary">Reservar turno</Link>
                  <Link href="/profesionales" className="lp-cta-secondary">Conocer profesionales</Link>
                </div>
              </RevealOnScroll>
            </div>
            <div className="lp-hero-card-wrap lp-hero-photo-strip">
              <RevealOnScroll direction="right" delay={120}>
                <div className="lp-hero-card">
                  <div className="lp-featured-media">
                    <img alt="Delta Espacios Profesionales" src="/delta-assets/ig-highlight-ambientes.jpg" />
                  </div>
                  <div style={{ marginTop: "1rem" }}>
                    <div className="lp-hero-card-head">
                      <span className="lp-availability-dot" />
                      <span>Contacto directo</span>
                    </div>
                    <p className="lp-card-note">Turnos por WhatsApp. Atención con cita previa.</p>
                  </div>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </section>

        {/* ═══ TRUST INDICATORS ═══ */}
        <section className="lp-trust">
          <div className="lp-trust-inner">
            {trustIndicators.map((item, i) => (
              <RevealOnScroll key={item.label} delay={i * 80}>
                <article className="trust-stat">
                  <span className="trust-stat-value">{item.value}</span>
                  <span className="trust-stat-label">{item.label}</span>
                </article>
              </RevealOnScroll>
            ))}
          </div>
        </section>

        {/* ═══ QUIÉNES SOMOS ═══ */}
        <section id="quienes-somos" className="lp-section lp-how">
          <div className="lp-section-inner">
            <RevealOnScroll><DrawTitle tag="h2" className="lp-section-title">Quiénes somos</DrawTitle></RevealOnScroll>
            <RevealOnScroll delay={120}>
              <div className="quienes-somos-text">
                <p className="quienes-somos-lead">Delta es un espacio profesional en el centro de City Bell que reúne disciplinas en un entorno cálido, cómodo y funcional.</p>
                <p>En nuestro espacio trabajan profesionales de diferentes áreas, generando una comunidad interdisciplinaria basada en el respeto, la cercanía y el compromiso con cada persona que nos elige.</p>
                <p>Contamos con consultorios equipados, espacios luminosos y un entorno preparado para brindar comodidad, tranquilidad y privacidad.</p>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* ═══ ESPECIALIDADES ═══ */}
        <section id="especialidades" className="lp-section">
          <div className="lp-section-inner">
            <RevealOnScroll><DrawTitle tag="h2" className="lp-section-title">Especialidades</DrawTitle></RevealOnScroll>
            <RevealOnScroll delay={100}>
              <p className="lp-section-sub">Conocé las disciplinas que se atienden en nuestro espacio. Hacé clic para ver los profesionales.</p>
            </RevealOnScroll>
            <div className="lp-spec-grid">
              {SPECIALTIES.map((spec, i) => (
                <RevealOnScroll key={spec.id} delay={i * 60}>
                  <Link href={`/profesionales?specialty=${spec.id}`} className="lp-spec-card">
                    <span className="lp-spec-icon">{spec.icon}</span>
                    <h3 className="lp-spec-name">{spec.label}</h3>
                    <p className="lp-spec-desc">{spec.desc}</p>
                    <span className="lp-spec-cta">Ver profesionales →</span>
                  </Link>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ RED DE PROFESIONALES ═══ */}
        <section id="red-profesionales" className="lp-section lp-how">
          <div className="lp-section-inner">
            <RevealOnScroll>
              <p className="lp-section-kicker">Red de profesionales</p>
              <DrawTitle tag="h2" className="lp-section-title">Nuestro equipo</DrawTitle>
            </RevealOnScroll>
            <RevealOnScroll delay={120}>
              <p className="lp-section-sub">Conocé a los profesionales que forman parte de Delta. Cada uno con su especialidad, enfoque y modalidad de atención.</p>
            </RevealOnScroll>
            <RevealOnScroll delay={180}>
              <div className="featured-team-grid">
                {featuredProfessionals.map((professional) => (
                  <article className="featured-team-card" key={professional.name}>
                    <img src={professional.photoUrl} alt={professional.name} className="featured-team-avatar" />
                    <h3>{professional.name}</h3>
                    <p>{professional.specialty}</p>
                    <Link href="/profesionales" className="featured-team-link">Ver perfil</Link>
                  </article>
                ))}
              </div>
            </RevealOnScroll>
            <RevealOnScroll delay={260}>
              <div className="lp-cta-center-wrap">
                <Link href="/profesionales" className="lp-cta-primary">Ver todos los profesionales</Link>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* ═══ AGENDA TU TURNO ═══ */}
        <section id="agenda-turno" className="lp-section">
          <div className="lp-section-inner">
            <RevealOnScroll><DrawTitle tag="h2" className="lp-section-title">Agendá tu turno</DrawTitle></RevealOnScroll>
            <RevealOnScroll delay={100}>
              <p className="lp-section-sub">Atención con cita previa coordinada por WhatsApp. Solicitá tu turno de manera 100% virtual.</p>
            </RevealOnScroll>
            <div className="work-steps-grid agenda-steps-grid">
              {[
                { v: "01", l: "Seleccionar especialidad", b: "Elegí el área profesional que necesitás según tu consulta. Contamos con diferentes especialidades." },
                { v: "02", l: "Elegir profesional", b: "Conocé a nuestros profesionales y seleccioná el que mejor se adapte, según disponibilidad y modalidad." },
                { v: "03", l: "Enviar WhatsApp", b: "Comunicate por WhatsApp para coordinar tu cita y recibir toda la información necesaria." },
              ].map(({ v, l, b }, i) => (
                <RevealOnScroll key={v} delay={i * 100}>
                  <article className="work-step-card"><span>{v}</span><h3>{l}</h3><p>{b}</p></article>
                </RevealOnScroll>
              ))}
            </div>
            <RevealOnScroll delay={350}>
              <div className="agenda-contact-note">
                <p>Si tenés alguna duda, contactanos por WhatsApp al{" "}
                  <a href="https://wa.me/5492214778280" target="_blank" rel="noreferrer" className="agenda-phone-link">221 477 8280</a>{" "}
                  y te ayudaremos a encontrar la mejor opción.
                </p>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* ═══ ALQUILA TU ESPACIO ═══ */}
        <section id="alquila-espacio" className="lp-section lp-how">
          <div className="lp-section-inner">
            <RevealOnScroll>
              <p className="lp-section-kicker">Alquiler de consultorios</p>
              <DrawTitle tag="h2" className="lp-section-title">Alquila tu espacio</DrawTitle>
            </RevealOnScroll>
            <RevealOnScroll delay={100}>
              <div className="alquila-intro">
                <p className="alquila-intro-lead">¿Buscás un espacio listo para atender? Este lugar es ideal para vos.</p>
                <p>En Delta contamos con consultorios totalmente equipados, ideal para profesionales que deseen trabajar en un espacio cómodo, luminoso y bien ubicado.</p>
                <p className="alquila-modality">Se alquila por módulos o jornada completa.</p>
              </div>
            </RevealOnScroll>
            <RevealOnScroll delay={140}>
              <div className="benefits-grid">
                {benefits.map((item) => (
                  <article key={item.text} className="benefit-card">
                    <span className="benefit-icon">{item.icon}</span>
                    <span>{item.text}</span>
                  </article>
                ))}
              </div>
            </RevealOnScroll>
            <RevealOnScroll delay={180}>
              <div className="module-info-grid">
                <div className="module-info-title"><span>Alquiler por módulos fijos</span></div>
                {moduleBlocks.map(([label, value]) => (
                  <article key={label}><span>{label}</span><strong>{value}</strong></article>
                ))}
              </div>
            </RevealOnScroll>
            <RevealOnScroll delay={220}>
              <div className="alquila-values-note">
                <p>Los valores se adaptan según la cantidad de módulos que necesites. Consultanos y te contamos sobre disponibilidad y promociones vigentes.</p>
              </div>
            </RevealOnScroll>
            <RevealOnScroll delay={260}>
              <a href="https://wa.me/5492214778280?text=Hola%2C%20quiero%20consultar%20por%20alquiler%20de%20consultorios%20en%20Delta." className="lp-cta-primary lp-cta-center lp-cta-large" target="_blank" rel="noreferrer">
                Solicitar información
              </a>
            </RevealOnScroll>
          </div>
        </section>

        {/* ═══ CONSULTORIOS ═══ */}
        <section id="consultorios" className="lp-section">
          <div className="lp-section-inner">
            <RevealOnScroll>
              <p className="lp-section-kicker">Nuestros espacios</p>
              <DrawTitle tag="h2" className="lp-section-title">Consultorios</DrawTitle>
            </RevealOnScroll>
            <RevealOnScroll delay={120}>
              <div className="consultorio-gallery">
                {instagramDemo.posts.slice(0, 4).map((post) => (
                  <article key={post.image} className="consultorio-gallery-item">
                    <div className="lp-gallery-media">
                      <img alt={post.title} src={post.image} />
                    </div>
                    <p className="consultorio-gallery-name">{post.title}</p>
                  </article>
                ))}
              </div>
            </RevealOnScroll>
            <RevealOnScroll delay={200}>
              <div className="schedules-section">
                <h3 className="schedules-title">Disponibilidad horaria</h3>
                <p className="schedules-subtitle">Hacé clic en cada consultorio para ver su disponibilidad.</p>
                <ConsultorioSchedules />
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* ═══ TESTIMONIOS ═══ */}
        <section id="testimonios" className="lp-section lp-how">
          <div className="lp-section-inner">
            <RevealOnScroll><DrawTitle tag="h2" className="lp-section-title">Testimonios</DrawTitle></RevealOnScroll>
            <RevealOnScroll delay={100}><p className="lp-section-sub">Lo que dicen quienes nos eligen.</p></RevealOnScroll>
            <div className="testimonials-grid">
              {testimonials.map((item, i) => (
                <RevealOnScroll key={item.author} delay={i * 120}>
                  <article className="testimonial-card">
                    <div className="testimonial-stars">{"★".repeat(item.stars)}</div>
                    <p className="testimonial-text">&ldquo;{item.text}&rdquo;</p>
                    <p className="testimonial-author">— {item.author}</p>
                  </article>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ CTA FINAL ═══ */}
        <section className="lp-final-cta">
          <div className="lp-final-inner">
            <RevealOnScroll>
              <h2 className="lp-final-title">¿Buscás un profesional?</h2>
              <p className="lp-final-sub">Encontrá el especialista indicado y coordiná tu consulta en menos de un minuto.</p>
              <Link href="/profesionales" className="lp-cta-white">Ver profesionales</Link>
            </RevealOnScroll>
          </div>
        </section>
      </main>

      {/* ═══ FOOTER PREMIUM ═══ */}
      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <div className="footer-brand-col">
            <div className="footer-brand-row">
              <img src="/delta-logo.svg" alt="Delta" className="brand-logo small" />
              <div>
                <p className="footer-brand-name">DELTA – ESPACIOS PROFESIONALES</p>
                <p className="footer-brand-sub">Espacios donde los encuentros acompañan el cambio.</p>
              </div>
            </div>
          </div>
          <div className="footer-links-col">
            <h4>Contacto</h4>
            <p>📍 Cantilo N 146, City Bell 1896</p>
            <p><a href="https://wa.me/5492214778280" target="_blank" rel="noreferrer">📱 WhatsApp: 221 477 8280</a></p>
            <p>🕐 Lunes a Sábados, 9 a 20 hs</p>
            <p><a href={`https://www.instagram.com/${instagramDemo.username}`} target="_blank" rel="noreferrer">📷 @{instagramDemo.username}</a></p>
          </div>
          <div className="footer-links-col">
            <h4>Secciones</h4>
            <Link href="/#quienes-somos">Quiénes somos</Link>
            <Link href="/#especialidades">Especialidades</Link>
            <Link href="/profesionales">Profesionales</Link>
            <Link href="/#alquila-espacio">Alquiler</Link>
            <Link href="/admin">Admin</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Delta – Espacios Profesionales. Todos los derechos reservados.</p>
        </div>
      </footer>
      <FloatingWhatsApp />
    </div>
  );
}
