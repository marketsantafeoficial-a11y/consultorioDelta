"use client";

import { useState } from "react";
import Link from "next/link";

const ADMIN_PHONE = "5492214778280";
const WHATSAPP_ALIAS = "deltaespaciosprofesionales";
const WHATSAPP_ALIAS_URL = `https://wa.me/message/${WHATSAPP_ALIAS}`;

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/#quienes-somos", label: "Quienes somos" },
  { href: "/#especialidades", label: "Especialidades" },
  { href: "/profesionales", label: "Profesionales" },
  { href: "/#alquila-espacio", label: "Alquiler de espacios" },
  { href: "/#contacto", label: "Contacto" },
];

export function getWhatsAppHref(message: string) {
  return `https://wa.me/${ADMIN_PHONE}?text=${encodeURIComponent(message)}`;
}

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="lp-nav-wrap">
      <nav className="lp-nav">
        <Link href="/" className="lp-brand" aria-label="Delta Espacios Profesionales" onClick={closeMenu}>
          <img
            src="/delta-assets/delta-logo-citybell.png"
            alt="Delta Espacios Profesionales City Bell"
            className="brand-logo"
          />
          <span className="lp-brand-text">Delta - Espacios Profesionales</span>
        </Link>

        <button
          type="button"
          className="lp-menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="site-navigation"
          aria-label={menuOpen ? "Cerrar menu" : "Abrir menu"}
          onClick={() => setMenuOpen((current) => !current)}
        >
          <span />
          <span />
          <span />
        </button>

        <div id="site-navigation" className={`lp-nav-links ${menuOpen ? "is-open" : ""}`}>
          {navLinks.map((link) => (
            <Link key={link.href + link.label} href={link.href} onClick={closeMenu}>
              {link.label}
            </Link>
          ))}
          <Link href="/#agenda-turno" className="lp-nav-highlight" onClick={closeMenu}>
            Reservar turno
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
      href={WHATSAPP_ALIAS_URL}
      target="_blank"
      rel="noreferrer"
      aria-label="Contactar por WhatsApp"
    >
      <span className="whatsapp-float-icon">WA</span>
      <span>Contactanos</span>
    </a>
  );
}
