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
          <img src="/delta-logo.svg" alt="Delta Espacios Profesionales" className="brand-logo" />
          DELTA – ESPACIOS PROFESIONALES
        </Link>
        <div className="lp-nav-links">
          <Link href="/#quienes-somos">Quiénes somos</Link>
          <Link href="/#red-profesionales">Red de profesionales</Link>
          <Link href="/#agenda-turno" className="lp-nav-highlight">
            Agenda tu turno
          </Link>
          <Link href="/#alquila-espacio">Alquila tu espacio</Link>
          <Link href="/#contacto" className="lp-nav-cta">
            Contacto
          </Link>
        </div>
        <div className="header-actions">
          <Link href="/#agenda-turno" className="lp-cta-primary">Reservar turno</Link>
        </div>
      </nav>
    </header>
  );
}

export function FloatingWhatsApp() {
  return (
    <a
      className="whatsapp-float"
      href={getWhatsAppHref("Hola, quiero consultar por Delta – Espacios Profesionales.")}
      target="_blank"
      rel="noreferrer"
      aria-label="Contactar por WhatsApp"
    >
      <span className="whatsapp-float-icon">WA</span>
      <span>Contactanos</span>
    </a>
  );
}
