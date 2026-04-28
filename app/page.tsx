import Link from "next/link";
import { DrawTitle, TypewriterText } from "@/components/TextAnimations.client";
import { RevealOnScroll } from "@/components/RevealOnScroll.client";
import SpecialtiesAccordion from "@/components/SpecialtiesAccordion.client";
import BackgroundPattern from "@/components/BackgroundPattern";

export const metadata = {
  title: "Delta Consultorios | Psicólogos y especialistas en La Plata",
  description:
    "Encontrá tu psicólogo, terapeuta o especialista en salud en La Plata. Turnos online y presenciales, confirmación inmediata.",
};

const HOW_STEPS = [
  {
    num: "01",
    title: "Elegí tu especialista",
    body: "Filtrá por especialidad y modalidad. Leé la bio y el enfoque de cada profesional antes de decidir.",
  },
  {
    num: "02",
    title: "Seleccioná un turno",
    body: "Mirá la disponibilidad en tiempo real y elegí el horario que mejor se adapte a tu rutina.",
  },
  {
    num: "03",
    title: "Empezá tu proceso",
    body: "Recibís la confirmación al instante. Primera sesión online o presencial en consultorio en La Plata.",
  },
];



export default function HomePage() {
  return (
    <div className="lp-shell">
      <BackgroundPattern />
      {/* ════════════════════════════════════
          NAVBAR
      ════════════════════════════════════ */}
      <header className="lp-nav-wrap">
        <nav className="lp-nav">
          <span className="lp-brand">Delta Consultorios</span>
          <div className="lp-nav-links">
            <a href="#como">¿Cómo funciona?</a>
            <a href="#especialidades">Especialidades</a>
            <Link href="/calendario">Profesionales</Link>
            <Link href="/auth/login" className="lp-nav-cta">Ingresar</Link>
          </div>
        </nav>
      </header>

      {/* ════════════════════════════════════
          HERO — above the fold
      ════════════════════════════════════ */}
      <section className="lp-hero">
        <div className="lp-hero-inner">
          <div className="lp-hero-content">
            <p className="lp-eyebrow">La Plata · Salud Mental &amp; Bienestar</p>
            <h1 className="lp-hero-title">
              <TypewriterText
                text="Tu psicólogo"
                speed={55}
                startDelay={300}
              />
              <br />
              <span className="lp-hero-title-accent">a un turno de distancia</span>
            </h1>
            <p className="lp-hero-sub">
              Conectamos personas con los mejores profesionales de salud en La Plata.
              Turnos disponibles hoy, online o en consultorio.
            </p>
            <div className="lp-hero-actions">
              <Link href="/calendario" className="lp-cta-primary">
                Ver profesionales
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <a href="#como" className="lp-cta-secondary">¿Cómo funciona?</a>
            </div>
            <div className="lp-hero-badges">
              <span className="lp-badge">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <circle cx="8" cy="8" r="7" stroke="#059669" strokeWidth="1.5"/>
                  <path d="M5 8l2 2 4-4" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Confirmación inmediata
              </span>
              <span className="lp-badge">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <circle cx="8" cy="8" r="7" stroke="#059669" strokeWidth="1.5"/>
                  <path d="M5 8l2 2 4-4" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Sin listas de espera
              </span>
              <span className="lp-badge">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <circle cx="8" cy="8" r="7" stroke="#059669" strokeWidth="1.5"/>
                  <path d="M5 8l2 2 4-4" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Online y presencial
              </span>
            </div>
          </div>

          {/* Hero right: floating card */}
          <div className="lp-hero-card-wrap" aria-hidden="true">
            <div className="lp-hero-card">
              <div className="lp-hero-card-head">
                <span className="lp-availability-dot" />
                <span>Disponibilidad hoy</span>
              </div>
              <div className="lp-slot-preview">
                {["09:00", "10:30", "14:00", "16:30"].map((t) => (
                  <div key={t} className="lp-slot-pill">{t}</div>
                ))}
              </div>
              <p className="lp-card-note">Seleccioná un profesional para ver su agenda completa</p>
              <Link href="/calendario" className="lp-card-btn">Ver agenda →</Link>
            </div>
            <div className="lp-hero-blob" aria-hidden="true" />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="lp-scroll-hint" aria-hidden="true">
          <span />
        </div>
      </section>



      {/* ════════════════════════════════════
          SPECIALTIES — scrollytelling step 2
      ════════════════════════════════════ */}
      <section id="especialidades" className="lp-section lp-specialties">
        <div className="lp-section-inner">
          <RevealOnScroll>
            <DrawTitle tag="h2" className="lp-section-title">
              ¿En qué podemos ayudarte?
            </DrawTitle>
          </RevealOnScroll>
          <RevealOnScroll delay={100}>
            <p className="lp-section-sub">
              Contamos con profesionales especializados en diferentes enfoques terapéuticos para acompañarte en cada etapa.
            </p>
          </RevealOnScroll>
          <RevealOnScroll delay={150}>
            <SpecialtiesAccordion />
          </RevealOnScroll>
          <RevealOnScroll delay={200}>
            <Link href="/calendario" className="lp-cta-primary lp-cta-center">
              Ver todos los profesionales
            </Link>
          </RevealOnScroll>
        </div>
      </section>

      {/* ════════════════════════════════════
          HOW IT WORKS — scrollytelling step 3
          Side-by-side sticky pattern (desktop)
      ════════════════════════════════════ */}
      <section id="como" className="lp-section lp-how">
        <div className="lp-section-inner">
          <RevealOnScroll>
            <DrawTitle tag="h2" className="lp-section-title" accentColor="#059669">
              Así de simple
            </DrawTitle>
          </RevealOnScroll>

          <div className="lp-how-grid">
            {/* Steps (scroll) */}
            <div className="lp-how-steps">
              {HOW_STEPS.map((step, i) => (
                <RevealOnScroll key={step.num} delay={i * 120} direction="left" className="lp-how-step">
                  <span className="lp-step-num">{step.num}</span>
                  <div>
                    <h3 className="lp-step-title">{step.title}</h3>
                    <p className="lp-step-body">{step.body}</p>
                  </div>
                </RevealOnScroll>
              ))}
            </div>

            {/* Sticky illustration */}
            <div className="lp-how-visual-wrap">
              <div className="lp-how-visual">
                <div className="lp-mock-browser">
                  <div className="lp-mock-bar">
                    <span /><span /><span />
                    <div className="lp-mock-url">deltaconsultorios.com.ar/calendario</div>
                  </div>
                  <div className="lp-mock-content">
                    <div className="lp-mock-prof">
                      <div className="lp-mock-avatar" />
                      <div className="lp-mock-info">
                        <div className="lp-mock-name" />
                        <div className="lp-mock-spec" />
                      </div>
                    </div>
                    <div className="lp-mock-slots">
                      {[1,2,3,4,5,6].map((n) => (
                        <div key={n} className={`lp-mock-slot ${n === 3 ? "lp-mock-slot-active" : ""}`} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <RevealOnScroll delay={150}>
            <Link href="/calendario" className="lp-cta-primary lp-cta-center">
              Reservar mi turno
            </Link>
          </RevealOnScroll>
        </div>
      </section>

      {/* ════════════════════════════════════
          FINAL CTA — scrollytelling climax
      ════════════════════════════════════ */}
      <section className="lp-final-cta">
        <div className="lp-final-inner">
          <RevealOnScroll direction="none">
            <DrawTitle tag="h2" className="lp-final-title" accentColor="#7dd3fc">
              El primer paso es el más importante
            </DrawTitle>
          </RevealOnScroll>
          <RevealOnScroll delay={150}>
            <p className="lp-final-sub">
              Reservá tu primera consulta hoy. Profesionales certificados, atención personalizada, en La Plata.
            </p>
          </RevealOnScroll>
          <RevealOnScroll delay={280}>
            <Link href="/calendario" className="lp-cta-white">
              Buscar mi psicólogo
            </Link>
          </RevealOnScroll>
        </div>
      </section>

      {/* ════════════════════════════════════
          FOOTER
      ════════════════════════════════════ */}
      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <div>
            <p className="lp-brand">Delta Consultorios</p>
            <p className="lp-footer-tagline">La Plata, Buenos Aires, Argentina</p>
          </div>
          <div className="lp-footer-links">
            <Link href="/calendario">Profesionales</Link>
            <Link href="/auth/login">Ingreso equipo</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
