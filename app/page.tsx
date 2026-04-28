import Link from "next/link";
import { instagramDemo } from "@/lib/instagram-demo";

export const metadata = {
  title: "Delta Consultorios | Reserva de consultorios en City Bell",
  description:
    "Alquiler de consultorios y oficinas equipadas en City Bell. Reserva por modulos con agenda online.",
};

const features = [
  "Consultorios equipados",
  "Alquiler por modulos",
  "Centro de City Bell",
  "Gestion de reservas online",
];

export default function HomePage() {
  return (
    <div className="lp-shell">
      <header className="lp-nav-wrap">
        <nav className="lp-nav">
          <span className="lp-brand">Delta Consultorios</span>
          <div className="lp-nav-links">
            <a href="#espacios">Espacios</a>
            <a href="#fotos">Fotos</a>
            <Link href="/calendario">Agenda</Link>
            <Link href="/auth/login" className="lp-nav-cta">Admin</Link>
          </div>
        </nav>
      </header>

      <main>
        <section className="lp-hero">
          <div className="lp-hero-inner">
            <div className="lp-hero-content">
              <p className="lp-eyebrow">Cantilo N 146 · City Bell</p>
              <h1 className="lp-hero-title">
                Reserva consultorios equipados por modulo
              </h1>
              <p className="lp-hero-sub">
                Delta ofrece espacios listos para profesionales de la salud,
                entrevistas, terapia, reuniones y atencion presencial.
              </p>
              <div className="lp-hero-actions">
                <Link href="/calendario" className="lp-cta-primary">
                  Ver agenda
                </Link>
                <Link href="/auth/login" className="lp-cta-secondary">
                  Panel administrador
                </Link>
              </div>
              <div className="lp-hero-badges">
                {features.map((item) => (
                  <span className="lp-badge" key={item}>{item}</span>
                ))}
              </div>
            </div>

            <div className="lp-hero-card-wrap">
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
                    Solicitudes pendientes y confirmadas desde el panel admin.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="espacios" className="lp-section lp-how">
          <div className="lp-section-inner">
            <h2 className="lp-section-title">Como funciona</h2>
            <p className="lp-section-sub">
              La demo permite elegir un espacio, ver horarios disponibles y enviar
              una solicitud de reserva para que administracion la gestione.
            </p>
            <div className="lp-trust-inner">
              {[
                ["01", "Elegir consultorio"],
                ["02", "Seleccionar fecha y modulo"],
                ["03", "Enviar solicitud"],
                ["04", "Gestion confirma"],
              ].map(([value, label]) => (
                <div key={label}>
                  <span className="lp-trust-value">{value}</span>
                  <span className="lp-trust-label">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="fotos" className="lp-section">
          <div className="lp-section-inner">
            <h2 className="lp-section-title">Espacios Delta</h2>
            <p className="lp-section-sub">
              Fotos cargadas desde el material del emprendimiento para mostrar los
              ambientes y servicios durante la demo.
            </p>
            <div className="lp-spec-grid">
              {instagramDemo.posts.slice(0, 6).map((post) => (
                <article className="lp-spec-card" key={post.image}>
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
              ))}
            </div>
            <Link href="/calendario" className="lp-cta-primary lp-cta-center">
              Reservar un consultorio
            </Link>
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
