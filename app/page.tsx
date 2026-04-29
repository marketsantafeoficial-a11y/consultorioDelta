import Link from "next/link";
import { DrawTitle, TypewriterText } from "@/components/TextAnimations.client";
import { RevealOnScroll } from "@/components/RevealOnScroll.client";
import { instagramDemo } from "@/lib/instagram-demo";

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
  ["01", "Ver agenda"],
  ["02", "Detectar horarios libres"],
  ["03", "Contactar administracion"],
  ["04", "Admin confirma la reserva"],
];

export default function HomePage() {
  return (
    <div className="lp-shell">
      <header className="lp-nav-wrap">
        <nav className="lp-nav">
          <span className="lp-brand">
            <img src="/delta-logo.svg" alt="Delta Consultorios City Bell" className="brand-logo" />
            Delta Consultorios
          </span>
          <div className="lp-nav-links">
            <a href="#espacios">Espacios</a>
            <a href="#fotos">Fotos</a>
            <Link href="/calendario">Agenda</Link>
            <a href="https://wa.me/5492214778280?text=Hola%2C%20quiero%20consultar%20por%20Delta%20Consultorios." target="_blank" rel="noreferrer">
              221 477 8280
            </a>
            <Link href="/auth/login" className="lp-nav-cta">Admin</Link>
          </div>
        </nav>
      </header>

      <main>
        <section className="lp-hero">
          <div className="lp-hero-inner">
            <div className="lp-hero-content">
              <RevealOnScroll direction="left">
                <p className="lp-eyebrow">Cantilo N 146 · City Bell</p>
                <h1 className="lp-hero-title">
                  <TypewriterText text="Consulta disponibilidad" speed={55} startDelay={250} />
                  <br />
                  <span className="lp-hero-title-accent">y coordina por administracion</span>
                </h1>
                <p className="lp-hero-sub">
                  Delta ofrece espacios listos para profesionales de la salud,
                  entrevistas, terapia, reuniones y atencion presencial. La demo
                  separa alquiler de modulos y turnos de profesionales.
                </p>
              </RevealOnScroll>

              <RevealOnScroll delay={180}>
                <div className="lp-hero-actions">
                  <Link href="/calendario" className="lp-cta-primary">
                    Ver agenda publica
                  </Link>
                  <Link href="/auth/login" className="lp-cta-secondary">
                    Panel administrador
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

            <div className="lp-hero-card-wrap">
              <RevealOnScroll direction="right" delay={120}>
                <div className="lp-hero-card">
                  <img
                    alt="Consultorio Delta City Bell"
                    src={instagramDemo.posts[1].image}
                    style={{
                      aspectRatio: "4 / 5",
                      borderRadius: "12px",
                      display: "block",
                      objectFit: "cover",
                      width: "100%",
                    }}
                  />
                  <div style={{ marginTop: "1rem" }}>
                    <div className="lp-hero-card-head">
                      <span className="lp-availability-dot" />
                      <span>Disponibilidad por agenda</span>
                    </div>
                    <p className="lp-card-note">
                      Modulos administrados por Delta y turnos independientes
                      para cada profesional.
                    </p>
                  </div>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </section>

        <section id="espacios" className="lp-section lp-how">
          <div className="lp-section-inner">
            <RevealOnScroll>
              <DrawTitle tag="h2" className="lp-section-title">
                Como funciona
              </DrawTitle>
            </RevealOnScroll>
            <RevealOnScroll delay={120}>
              <p className="lp-section-sub">
                La demo muestra dos circuitos: administracion gestiona el alquiler
                de modulos, y cada profesional recibe sus propios pedidos de turno.
              </p>
            </RevealOnScroll>
            <div className="lp-trust-inner">
              {steps.map(([value, label], index) => (
                <RevealOnScroll key={label} delay={index * 100}>
                  <span className="lp-trust-value">{value}</span>
                  <span className="lp-trust-label">{label}</span>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        <section id="fotos" className="lp-section">
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
                    <img
                      alt={post.title}
                      src={post.image}
                      style={{
                        aspectRatio: "4 / 5",
                        borderRadius: "8px",
                        display: "block",
                        marginBottom: "1rem",
                        objectFit: "cover",
                        width: "100%",
                      }}
                    />
                    <h3 className="lp-spec-name">{post.title}</h3>
                    <p className="lp-spec-desc">{post.type}</p>
                  </article>
                </RevealOnScroll>
              ))}
            </div>
            <RevealOnScroll delay={160}>
              <Link href="/calendario" className="lp-cta-primary lp-cta-center">
                Ver disponibilidad
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
            <Link href="/calendario">Agenda</Link>
            <Link href="/auth/login">Admin</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
