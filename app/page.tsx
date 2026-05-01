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
  "Consultorios equipados",
  "Alquiler por modulos",
  "Centro de City Bell",
  "Gestion administrada",
];

const steps = [
  ["01", "Ver modulos"],
  ["02", "Contactar administracion"],
  ["03", "Conocer equipo"],
  ["04", "Derivacion por WhatsApp"],
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
                  <TypewriterText text="Hoy es el dia" speed={55} startDelay={250} />
                  <br />
                  <span className="lp-hero-title-accent">para encontrar tu espacio</span>
                </h1>
                <div className="lp-hero-divider" aria-hidden="true" />
                <p className="lp-hero-sub">
                  Delta ofrece espacios listos para profesionales de la salud,
                  entrevistas, terapia, reuniones y atencion presencial. Los
                  modulos se consultan por agenda y las derivaciones del equipo
                  se coordinan por WhatsApp.
                </p>
              </RevealOnScroll>

              <RevealOnScroll delay={180}>
                <div className="lp-hero-actions">
                  <Link href="/calendario" className="lp-cta-primary">
                    Ver agenda de modulos
                  </Link>
                  <Link href="/profesionales" className="lp-cta-secondary">
                    Nuestro equipo
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
                      <span>Disponibilidad por agenda</span>
                    </div>
                    <p className="lp-card-note">
                      Modulos administrados por Delta con confirmacion por
                      WhatsApp.
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
                  "Miramos juntos que estas necesitando para orientarte con criterio.",
                  "Te ofrecemos profesionales del equipo y modalidades posibles.",
                  "Podes entrar al perfil de cada profesional y consultar por WhatsApp.",
                  "Administracion acompaña la coordinacion y tambien gestiona gabinetes.",
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
                Fotos cargadas desde el material del emprendimiento para mostrar los
                ambientes y servicios durante la demo.
              </p>
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
              <Link href="/calendario" className="lp-cta-primary lp-cta-center">
                Ver disponibilidad de modulos
              </Link>
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
