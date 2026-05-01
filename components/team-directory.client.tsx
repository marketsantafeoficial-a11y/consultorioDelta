"use client";

import { useState } from "react";
import { getWhatsAppHref } from "@/components/site-header";

type TeamProfessional = {
  id: number;
  fullName: string;
  specialty: string;
  bio: string;
  photoUrl?: string | null;
  serves?: string | null;
  consultory?: {
    name: string;
    city: string;
  } | null;
};

export function TeamDirectory({ professionals }: { professionals: TeamProfessional[] }) {
  const [selected, setSelected] = useState<TeamProfessional | null>(null);

  return (
    <>
      <div className="team-grid">
        {professionals.map((professional) => (
          <article className="team-card" key={professional.id}>
            <button
              type="button"
              className="team-avatar-link"
              onClick={() => setSelected(professional)}
              aria-label={`Ver perfil de ${professional.fullName}`}
            >
              <img
                src={professional.photoUrl ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(professional.fullName)}&size=240&background=eee5df&color=62615d&bold=true&rounded=true`}
                alt={professional.fullName}
                className="team-avatar"
              />
            </button>
            <h2>{professional.fullName}</h2>
            <p>{professional.specialty}</p>
            <button type="button" className="ghost-button" onClick={() => setSelected(professional)}>
              Ver perfil
            </button>
            <a
              className="team-whatsapp-link"
              href={getWhatsAppHref(`Hola, quiero consultar por ${professional.fullName} de Delta Consultorios.`)}
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp
            </a>
          </article>
        ))}
      </div>

      {selected ? (
        <div className="team-modal-backdrop" role="presentation" onClick={() => setSelected(null)}>
          <section
            className="team-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="team-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="team-modal-close"
              onClick={() => setSelected(null)}
              aria-label="Cerrar perfil"
            >
              x
            </button>
            <img
              src={selected.photoUrl ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(selected.fullName)}&size=260&background=eee5df&color=62615d&bold=true&rounded=true`}
              alt={selected.fullName}
              className="profile-avatar"
            />
            <div className="team-modal-copy">
              <span className="section-kicker">Profesional del equipo</span>
              <h2 id="team-modal-title">{selected.fullName}</h2>
              <p className="team-modal-specialty">{selected.specialty}</p>
              <p>{selected.bio}</p>
              {selected.serves ? <p className="muted">Areas: {selected.serves}</p> : null}
              {selected.consultory ? (
                <p className="muted">
                  {selected.consultory.name} - {selected.consultory.city}
                </p>
              ) : null}
              <div className="profile-actions">
                <a
                  className="lp-cta-primary"
                  href={getWhatsAppHref(`Hola, quiero consultar por ${selected.fullName} de Delta Consultorios.`)}
                  target="_blank"
                  rel="noreferrer"
                >
                  Contactar por WhatsApp
                </a>
                <a className="lp-cta-secondary" href="#derivacion" onClick={() => setSelected(null)}>
                  Completar formulario
                </a>
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
