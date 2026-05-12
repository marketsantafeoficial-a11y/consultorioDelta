import Link from "next/link";
import { DrawTitle, TypewriterText } from "@/components/TextAnimations.client";
import { RevealOnScroll } from "@/components/RevealOnScroll.client";
import { instagramDemo } from "@/lib/instagram-demo";
import { FloatingWhatsApp, SiteHeader } from "@/components/site-header";

export const metadata = {
  title: "Delta Consultorios | Consultorios en City Bell",
  description:
    "Alquiler de consultorios y oficinas equipadas en City Bell. Consulta disponibilidad y coordina con administracion.",
};

const features = [
  "Equipo profesional",
  "WhatsApp directo",
  "Consultorios en City Bell",
  "Administracion simple",
];

const steps = [
  ["01", "Conocer perfiles"],
  ["02", "Elegir profesional"],
  ["03", "Enviar WhatsApp"],
  ["04", "Coordinar atencion"],
];

const moduleBlocks = [
  ["Manana", "8 a 12 hs", "Modulo fijo"],
  ["Mediodia", "12 a 16 hs", "Modulo fijo"],
  ["Tarde", "16 a 20 hs", "Modulo fijo"],
  ["Hora suelta", "$5.000", "Uso ocasional"],
];

const priceBlocks = [
  ["1 modulo (4 hs)", "$4.000 por hora", "Total: $16.000"],
  ["2 modulos (8 hs)", "$3.500 por hora", "Total: $28.000"],
  ["3 modulos (dia completo)", "$3.000 por hora", "Total: $36.000"],
  ["Promo lanzamiento", "Modulo manana 4x3", "Total: $12.000"],
];

export default function HomePage() {
  return (
    <div className="lp-shell">
      <SiteHeader />

      <main>
        <section className="lp-hero">
          <div className="lp-hero-inner lp-hero-centered">
            <div className="lp-hero-content">
              <img src="/delta-logo.svg" alt="Delta Consultorios City Bell" className="lp-hero-logo" />
              <RevealOnScroll direction="left">
                <p className="lp-eyebrow">Cantilo N 146 · City Bell</p>
                <h1 className="lp-hero-title">
                  <TypewriterText text="Vida para tu espacio" speed={55} startDelay={250} />
                  <br />
                  <span className="lp-hero-title-accent">y profesionales para acompanarte</span>
                </h1>
                <div className="lp-hero-divider" aria-hidden="true" />
                <p className="lp-hero-sub">
                  Delta ofrece espacios listos para profesionales de la salud,
                  entrevistas, terapia y atencion presencial. Tambien podes
                  conocer al equipo, ver sus perfiles y escribir por WhatsApp
                  sin pasar por una agenda automatica.
                </p>
              </RevealOnScroll>

              <RevealOnScroll delay={180}>
                <div className="lp-hero-actions">
                  <Link href="/profesionales" className="lp-cta-primary">
                    Ver profesionales
                  </Link>
                  <Link href="/calendario" className="lp-cta-secondary">
                    Alquiler de consultorios
                  </Link>
                </div>
              </RevealOnScroll>

              <RevealOnScroll delay={300}>
                <div className="lp-hero-badges">
                  {features.map((item) => (
                    <span className="lp-badge" key={item}>{item}</span>
                  ))}
                </div>
              </RevealOnScroll>
            </div>

            <div className="lp-hero-card-wrap lp-hero-photo-strip">
              <RevealOnScroll direction="right" delay={120}>
                <div className="lp-hero-card">
                  <div className="lp-featured-media">
                    <img
                      alt="Consultorio Delta City Bell"
                      src={instagramDemo.posts[0].image}
                    />
                  </div>
                  <div style={{ marginTop: "1rem" }}>
                    <div className="lp-hero-card-head">
                      <span className="lp-availability-dot" />
                      <span>Contacto directo</span>
                    </div>
                    <p className="lp-card-note">
                      Turnos y consultas se coordinan por WhatsApp. La agenda
                      automatica queda para una etapa posterior.
                    </p>
                  </div>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </section>

        <section id="como-trabajamos" className="lp-section lp-how">
          <div className="lp-section-inner">
            <RevealOnScroll>
              <DrawTitle tag="h2" className="lp-section-title">
                Como trabajamos
              </DrawTitle>
            </RevealOnScroll>
            <RevealOnScroll delay={120}>
              <p className="lp-section-sub">
                Te orientamos para elegir el mejor camino: si buscas atencion,
                te conectamos con el profesional adecuado; si sos profesional,
                podes consultar por alquiler de gabinetes equipados.
              </p>
            </RevealOnScroll>
            <div className="work-steps-grid">
              {steps.map(([value, label], index) => {
                const bodies = [
                  "Cada profesional muestra foto, especialidad, areas de trabajo y una breve presentacion.",
                  "La persona puede comparar perfiles y elegir con quien quiere conversar.",
                  "El contacto abre WhatsApp con un mensaje preparado para consultar rapido.",
                  "Administracion carga perfiles, fotos, formularios y datos del espacio desde el panel.",
                ];

                return (
                  <RevealOnScroll key={label} delay={index * 100}>
                    <article className="work-step-card">
                      <span>{value}</span>
                      <h3>{label}</h3>
                      <p>{bodies[index]}</p>
                    </article>
                  </RevealOnScroll>
                );
              })}
            </div>
          </div>
        </section>

        <section id="alquiler-gabinetes" className="lp-section">
          <div className="lp-section-inner">
            <RevealOnScroll>
              <DrawTitle tag="h2" className="lp-section-title" accentColor="#059669">
                Espacios Delta
              </DrawTitle>
            </RevealOnScroll>
            <RevealOnScroll delay={120}>
              <p className="lp-section-sub">
                Alquiler de consultorios en pleno centro de City Bell. Los
                espacios son amplios, luminosos y estan equipados para atencion
                profesional.
              </p>
            </RevealOnScroll>
            <RevealOnScroll delay={160}>
              <div className="module-info-grid">
                {moduleBlocks.map(([label, value, detail]) => (
                  <article key={label}>
                    <span>{label}</span>
                    <strong>{value}</strong>
                    <small>{detail}</small>
                  </article>
                ))}
              </div>
            </RevealOnScroll>
            <RevealOnScroll delay={180}>
              <div className="rental-detail-grid">
                <article>
                  <h3>El espacio cuenta con</h3>
                  <p>Wifi, sala de espera, bano, cocina, escritorios, aire frio/calor y divan.</p>
                </article>
                <article>
                  <h3>Modalidad</h3>
                  <p>Se alquilan por modulos fijos o jornada completa. No contamos con servicio de secretaria.</p>
                </article>
                <article>
                  <h3>Ajustes</h3>
                  <p>Noviembre, marzo y julio.</p>
                </article>
              </div>
            </RevealOnScroll>
            <RevealOnScroll delay={220}>
              <div className="rental-price-grid">
                {priceBlocks.map(([title, rate, total]) => (
                  <article key={title}>
                    <span>{title}</span>
                    <strong>{rate}</strong>
                    <p>{total}</p>
                  </article>
                ))}
              </div>
            </RevealOnScroll>
            <div className="lp-spec-grid">
              {instagramDemo.posts.slice(0, 6).map((post, index) => (
                <RevealOnScroll key={post.image} delay={index * 80}>
                  <article className="lp-spec-card">
                    <div className="lp-gallery-media">
                      <img alt={post.title} src={post.image} />
                    </div>
                    <h3 className="lp-spec-name">{post.title}</h3>
                    <p className="lp-spec-desc">{post.type}</p>
                  </article>
                </RevealOnScroll>
              ))}
            </div>
            <RevealOnScroll delay={160}>
              <a
                href="https://wa.me/5492214778280?text=Hola%2C%20quiero%20consultar%20por%20alquiler%20de%20consultorios%20en%20Delta.%20Mi%20profesion%20es%3A"
                className="lp-cta-primary lp-cta-center"
                target="_blank"
                rel="noreferrer"
              >
                Consultar alquiler por WhatsApp
              </a>
            </RevealOnScroll>
            <RevealOnScroll delay={220}>
              <p className="lp-section-note">
                Promo lanzamiento: modulo de la manana 4x3. Usas 4 horas y
                pagas solo 3.
              </p>
            </RevealOnScroll>
          </div>
        </section>
      </main>

      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <div>
            <p className="lp-brand">Delta Consultorios</p>
            <p className="lp-footer-tagline">{instagramDemo.location}</p>
          </div>
          <div className="lp-footer-links">
            <Link href="/calendario">Modulos</Link>
            <Link href="/profesionales">Equipo</Link>
            <Link href="/admin">Admin</Link>
          </div>
        </div>
      </footer>
      <FloatingWhatsApp />
    </div>
  );
}
