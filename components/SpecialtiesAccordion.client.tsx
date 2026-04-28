"use client";

import { useState } from "react";

const SPECIALTIES = [
  { 
    id: "psicologia", 
    icon: "🧠", 
    label: "Psicología", 
    desc: "La psicología clínica se centra en el diagnóstico y tratamiento de problemas emocionales y de comportamiento. Puede ayudarte a superar la ansiedad, depresión, y mejorar tu bienestar general a través de sesiones individuales, de pareja o familiares." 
  },
  { 
    id: "psicoanalisis", 
    icon: "💬", 
    label: "Psicoanálisis", 
    desc: "Un enfoque terapéutico profundo que explora el inconsciente para entender patrones de comportamiento y conflictos internos. Ideal para quienes buscan un autoconocimiento exhaustivo y cambios sostenidos a largo plazo." 
  },
  { 
    id: "tcc", 
    icon: "🌿", 
    label: "TCC", 
    desc: "La Terapia Cognitivo Conductual es un enfoque práctico y orientado a objetivos. Te ayuda a identificar y cambiar patrones de pensamiento negativos para modificar comportamientos y superar fobias, TOC y trastornos de ansiedad." 
  },
  { 
    id: "pareja", 
    icon: "🤝", 
    label: "Terapia de Pareja", 
    desc: "Un espacio neutral y mediado para resolver conflictos, mejorar la comunicación y reconstruir la confianza en la relación. Acompañamiento profesional en momentos de crisis o para fortalecer el vínculo." 
  },
];

export default function SpecialtiesAccordion() {
  const [activeId, setActiveId] = useState<string>(SPECIALTIES[0].id);

  return (
    <div className="lp-accordion-layout">
      {/* Columna Izquierda: Acordeón */}
      <div className="lp-accordion-list">
        {SPECIALTIES.map((s) => {
          const isActive = activeId === s.id;
          return (
            <div 
              key={s.id} 
              className={`lp-accordion-item ${isActive ? "active" : ""}`}
              onClick={() => setActiveId(s.id)}
            >
              <div className="lp-accordion-header">
                <span className="lp-accordion-icon" aria-hidden="true">{s.icon}</span>
                <h3 className="lp-accordion-title">{s.label}</h3>
                <span className="lp-accordion-chevron" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </span>
              </div>
              <div 
                className="lp-accordion-content"
                style={{
                  gridTemplateRows: isActive ? "1fr" : "0fr",
                  opacity: isActive ? 1 : 0
                }}
              >
                <div className="lp-accordion-inner">
                  <p>{s.desc}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Columna Derecha: Placeholder Visual */}
      <div className="lp-accordion-visual">
        <div className="lp-accordion-placeholder">
          <div className="lp-placeholder-blob" />
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lp-placeholder-icon">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
          <p className="lp-placeholder-text">
            Imagen ilustrativa de <br/>
            <strong>{SPECIALTIES.find(s => s.id === activeId)?.label}</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
