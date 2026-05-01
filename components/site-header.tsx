import Link from "next/link";

const ADMIN_PHONE = "5492214778280";

export function getWhatsAppHref(message: string) {
  return `https://wa.me/${ADMIN_PHONE}?text=${encodeURIComponent(message)}`;
}

export function SiteHeader() {
  return (
    <header className="lp-nav-wrap">
      <nav className="lp-nav">
        <Link href="/" className="lp-brand">
          <img src="/delta-logo.svg" alt="Delta Consultorios City Bell" className="brand-logo" />
          Delta Consultorios
        </Link>
        <div className="lp-nav-links">
          <Link href="/#como-trabajamos">Como trabajamos</Link>
          <Link href="/profesionales">Nuestro equipo</Link>
          <a
            href={getWhatsAppHref("Hola, soy profesional y quiero consultar para sumarme o alquilar un gabinete en Delta Consultorios.")}
            target="_blank"
            rel="noreferrer"
          >
            Soy profesional
          </a>
          <Link href="/calendario">Alquiler de gabinetes</Link>
          <Link href="/profesionales#derivacion" className="lp-nav-cta">
            Quiero mi sesion
          </Link>
        </div>
      </nav>
    </header>
  );
}

export function FloatingWhatsApp() {
  return (
    <a
      className="whatsapp-float"
      href={getWhatsAppHref("Hola, quiero consultar por Delta Consultorios.")}
      target="_blank"
      rel="noreferrer"
      aria-label="Contactar por WhatsApp"
    >
      <span className="whatsapp-float-icon">WA</span>
      <span>Contactanos</span>
    </a>
  );
}
