"use client";

import { useState } from "react";
import { getWhatsAppHref } from "@/lib/whatsapp";

type TeamProfessional = {
  id: number;
  fullName: string;
  specialty: string;
  bio: string;
  photoUrl?: string | null;
  whatsapp?: string | null;
  serves?: string | null;
  consultory?: {
    name: string;
    city: string;
  } | null;
  modalidadAtencion?: string | null;
  atencionCobertura?: string | null;
  poblacion?: string | null;
  orientacionTeorica?: string | null;
  prestaciones?: string | null;
  areasExperiencia?: string | null;
  presentacionProfesional?: string | null;
};

function textToLines(text: string | null | undefined): string {
  if (!text) return "";
  return text;
}

export function TeamDirectory({ professionals }: { professionals: TeamProfessional[] }) {
  const [selected, setSelected] = useState<TeamProfessional | null>(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState("Todas");
  const specialties = [
    "Todas",
    ...Array.from(new Set(professionals.map((professional) => professional.specialty.split("\n")[0]))).sort(),
  ];
  const filteredProfessionals =
    selectedSpecialty === "Todas"
      ? professionals
      : professionals.filter((professional) => professional.specialty.split("\n")[0] === selectedSpecialty);

  function getProfessionalWhatsAppHref(professional: TeamProfessional) {
    const message = `Hola, quiero consultar por ${professional.fullName} de DELTA  ESPACIOS PROFESIONALES.`;

    if (!professional.whatsapp) {
      return getWhatsAppHref(message);
    }

    const phone = professional.whatsapp.replace(/\D/g, "");
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  }

  return (
    <>
      <div className="team-filter-panel" aria-label="Filtrar profesionales">
        <label>
          <span>Seleccionar por especialidad</span>
          <select
            value={selectedSpecialty}
            onChange={(event) => setSelectedSpecialty(event.target.value)}
          >
            {specialties.map((specialty) => (
              <option key={specialty} value={specialty}>
                {specialty}
              </option>
            ))}
          </select>
        </label>
        <p>
          {filteredProfessionals.length} profesional{filteredProfessionals.length === 1 ? "" : "es"} disponible
          {selectedSpecialty === "Todas" ? " en la red." : ` en ${selectedSpecialty}.`}
        </p>
      </div>

      <div className="team-grid">
        {filteredProfessionals.map((professional) => (
          <article className="team-card" key={professional.id}>
            <button
              type="button"
              className="team-avatar-link"
              onClick={() => setSelected(professional)}
              aria-label={`Ver perfil de ${professional.fullName}`}
            >
              <img
                src={professional.photoUrl ?? "/delta-assets/professional-avatar.svg"}
                alt={professional.fullName}
                className="team-avatar"
              />
            </button>
            <h2>{professional.fullName}</h2>
            <p style={{ whiteSpace: "pre-wrap", textAlign: "center", fontStyle: "normal" }}>
              {professional.specialty.split("\n")[0]}
            </p>
            {professional.modalidadAtencion ? (
              <span className="team-modalidad-badge">{professional.modalidadAtencion}</span>
            ) : null}
            <button type="button" className="ghost-button" onClick={() => setSelected(professional)}>
              Ver perfil
            </button>
            <a
              className="team-whatsapp-link"
              href={getProfessionalWhatsAppHref(professional)}
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
            className="team-modal team-modal-detail"
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
              src={selected.photoUrl ?? "/delta-assets/professional-avatar.svg"}
              alt={selected.fullName}
              className="profile-avatar"
            />
            <div className="team-modal-copy">
              <span className="section-kicker">Profesional del equipo</span>
              <h2 id="team-modal-title">{selected.fullName}</h2>
              <p className="team-modal-specialty" style={{ whiteSpace: "pre-wrap" }}>
                {selected.specialty}
              </p>

              {selected.modalidadAtencion ? (
                <div className="team-modal-field">
                  <strong>Modalidad</strong>
                  <span>{selected.modalidadAtencion}</span>
                </div>
              ) : null}

              {selected.presentacionProfesional ? (
                <div className="team-modal-field">
                  <p style={{ whiteSpace: "pre-wrap" }}>{selected.presentacionProfesional}</p>
                </div>
              ) : selected.bio ? (
                <div className="team-modal-field">
                  <p style={{ whiteSpace: "pre-wrap" }}>{selected.bio}</p>
                </div>
              ) : null}

              {selected.poblacion ? (
                <div className="team-modal-field">
                  <strong>Población</strong>
                  <span style={{ whiteSpace: "pre-wrap" }}>{textToLines(selected.poblacion)}</span>
                </div>
              ) : null}

              {selected.atencionCobertura ? (
                <div className="team-modal-field">
                  <strong>Cobertura / Atención</strong>
                  <span style={{ whiteSpace: "pre-wrap" }}>{textToLines(selected.atencionCobertura)}</span>
                </div>
              ) : null}

              {selected.orientacionTeorica ? (
                <div className="team-modal-field">
                  <strong>Orientación</strong>
                  <span style={{ whiteSpace: "pre-wrap" }}>{textToLines(selected.orientacionTeorica)}</span>
                </div>
              ) : null}

              {selected.prestaciones ? (
                <div className="team-modal-field">
                  <strong>Prestaciones</strong>
                  <span style={{ whiteSpace: "pre-wrap" }}>{textToLines(selected.prestaciones)}</span>
                </div>
              ) : null}

              {selected.areasExperiencia ? (
                <div className="team-modal-field">
                  <strong>Áreas de experiencia</strong>
                  <span style={{ whiteSpace: "pre-wrap" }}>{textToLines(selected.areasExperiencia)}</span>
                </div>
              ) : selected.serves ? (
                <div className="team-modal-field">
                  <strong>Áreas de experiencia</strong>
                  <span>{selected.serves}</span>
                </div>
              ) : null}

              {selected.consultory ? (
                <p className="muted">
                  {selected.consultory.name} - {selected.consultory.city}
                </p>
              ) : null}

              <div className="profile-actions">
                <a
                  className="lp-cta-primary"
                  href={getProfessionalWhatsAppHref(selected)}
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
