"use client";

import { useMemo, useState } from "react";

type ProfessionalOption = {
  id: number;
  fullName: string;
  specialty: string;
};

type TeamReferralFormProps = {
  professionals: ProfessionalOption[];
  preferredProfessional?: string;
};

const ADMIN_PHONE = "5492214778280";

const startOptions = [
  "Terapia individual",
  "Terapia de pareja",
  "Terapia familiar / vincular",
  "Orientacion para elegir profesional",
  "Consulta por autoestima, ansiedad o duelos",
  "Otra consulta",
];

const modalityOptions = [
  "Presencial",
  "Virtual",
  "Me sirve cualquiera",
];

export function TeamReferralForm({
  professionals,
  preferredProfessional = "",
}: TeamReferralFormProps) {
  const [form, setForm] = useState({
    email: "",
    fullName: "",
    startType: "",
    modality: modalityOptions[2],
    phone: "",
    age: "",
    availability: "",
    reason: "",
    professionalPreference: preferredProfessional,
  });
  const [feedback, setFeedback] = useState<string | null>(null);

  const selectedProfessional = useMemo(
    () => professionals.find((item) => item.fullName === form.professionalPreference),
    [form.professionalPreference, professionals],
  );

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const message = [
      "Hola, quiero iniciar una derivacion para terapia con el equipo de DELTA – ESPACIOS PROFESIONALES.",
      "",
      `Correo electronico: ${form.email}`,
      `Nombre y apellido: ${form.fullName}`,
      `Tipo de consulta: ${form.startType}`,
      `Modalidad preferida: ${form.modality}`,
      `Telefono: ${form.phone}`,
      `Edad: ${form.age}`,
      `Disponibilidad de dias y horarios: ${form.availability}`,
      `Motivo de la consulta: ${form.reason}`,
      `Preferencia de profesional: ${form.professionalPreference || "Secretaria virtual de Delta"}`,
      selectedProfessional?.specialty ? `Especialidad del profesional elegido: ${selectedProfessional.specialty}` : null,
      "Nota: No atendemos por IOMA.",
    ].filter(Boolean).join("\n");

    window.open(`https://wa.me/${ADMIN_PHONE}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    setFeedback("Te abrimos WhatsApp con la informacion lista para que administracion pueda derivarte.");
  }

  return (
    <section className="referral-section" id="derivacion">
      <div className="referral-copy">
        <h2>Dejanos tu consulta en el siguiente formulario para comunicarnos por WhatsApp.</h2>
        <p>Desplegá la flecha para contactar directamente al profesional de tu interés o comunicate con la secretaria virtual de Delta para recibir asesoramiento.</p>
      </div>

      <form className="referral-form" onSubmit={onSubmit}>
        <label>
          Telefono *
          <input
            type="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            required
          />
        </label>

        <label>
          Nombre y apellido *
          <input
            autoComplete="name"
            value={form.fullName}
            onChange={(event) => updateField("fullName", event.target.value)}
            required
          />
        </label>

        <label>
          Tipo de consulta *
          <input
            list="consulta-sugerencias"
            value={form.startType}
            onChange={(event) => updateField("startType", event.target.value)}
            placeholder="Escribi tu consulta o elegi una sugerencia"
            required
          />
          <datalist id="consulta-sugerencias">
            {startOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </datalist>
        </label>

        <fieldset>
          <legend>Modalidad preferida *</legend>
          {modalityOptions.map((option) => (
            <label className="radio-row" key={option}>
              <input
                type="radio"
                name="modality"
                value={option}
                checked={form.modality === option}
                onChange={(event) => updateField("modality", event.target.value)}
              />
              {option}
            </label>
          ))}
        </fieldset>

        <div className="form-two-cols">
          <label>
            Correo electronico *
            <input
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
              required
            />
          </label>
          <label>
            Edad *
            <input
              inputMode="numeric"
              value={form.age}
              onChange={(event) => updateField("age", event.target.value)}
              required
            />
          </label>
        </div>

        <label>
          Disponibilidad de dias y horarios *
          <input
            value={form.availability}
            onChange={(event) => updateField("availability", event.target.value)}
            placeholder="Ej: lunes por la tarde, viernes por la manana"
            required
          />
        </label>

        <label>
          Motivo de la consulta *
          <textarea
            rows={4}
            value={form.reason}
            onChange={(event) => updateField("reason", event.target.value)}
            required
          />
        </label>

        <label>
          Profesional requerido
          <select
            value={form.professionalPreference}
            onChange={(event) => updateField("professionalPreference", event.target.value)}
          >
            <option value="">Secretaria virtual de Delta</option>
            {professionals.map((professional) => (
              <option key={professional.id} value={professional.fullName}>
                {professional.fullName} - {professional.specialty}
              </option>
            ))}
          </select>
        </label>

        <p className="form-note">No atendemos por IOMA.</p>

        <button type="submit">Abrir WhatsApp con mis datos</button>
        {feedback ? <p className="status-text" aria-live="polite">{feedback}</p> : null}
      </form>
    </section>
  );
}
