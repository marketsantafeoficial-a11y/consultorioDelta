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
  "Terapia individual (solo un consultante)",
  "Terapia de pareja (dos consultantes juntos con el mismo profesional)",
  "Terapia familiar / vincular (dos o mas consultantes con un mismo profesional)",
];

const modalityOptions = [
  "Si, solo presencial",
  "Prefiero online",
  "Si hay presencial por mi zona mejor, si no online esta bien tambien",
];

export function TeamReferralForm({
  professionals,
  preferredProfessional = "",
}: TeamReferralFormProps) {
  const [form, setForm] = useState({
    email: "",
    fullName: "",
    startType: startOptions[0],
    modality: modalityOptions[2],
    phone: "",
    age: "",
    province: "",
    country: "",
    neighborhood: "",
    reason: "",
    professionalPreference: preferredProfessional,
    whatsappContact: "",
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
      "Hola, quiero iniciar una derivacion para terapia con el equipo de Delta Consultorios.",
      "",
      "Estas a un paso de tener tu turno con un psicologo de nuestro equipo.",
      "La derivacion no es al azar: elegimos al mejor profesional para cada consultante.",
      "",
      `Correo electronico: ${form.email}`,
      `Nombre y apellido: ${form.fullName}`,
      `Quiero comenzar: ${form.startType}`,
      `Modalidad preferida: ${form.modality}`,
      `Telefono: ${form.phone}`,
      `Edad: ${form.age}`,
      `Provincia en Argentina: ${form.province || "No indicado"}`,
      `Pais / ciudad si no vive en Argentina: ${form.country || "No indicado"}`,
      `Barrio si vive en CABA o Buenos Aires: ${form.neighborhood || "No indicado"}`,
      `Motivo para comenzar terapia: ${form.reason}`,
      `Preferencia de profesional: ${form.professionalPreference || "Sin preferencia"}`,
      selectedProfessional?.specialty ? `Especialidad del profesional elegido: ${selectedProfessional.specialty}` : null,
      `Numero para WhatsApp u otro medio: ${form.whatsappContact || form.phone}`,
    ].filter(Boolean).join("\n");

    window.open(`https://wa.me/${ADMIN_PHONE}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    setFeedback("Te abrimos WhatsApp con la informacion lista para que administracion pueda derivarte.");
  }

  return (
    <section className="referral-section" id="derivacion">
      <div className="referral-copy">
        <span className="section-kicker">Derivacion administrada</span>
        <h2>Estas a un paso de tener tu turno con nuestro equipo</h2>
        <p>
          La derivacion no es al azar: administracion revisa la informacion y elige
          el profesional mas adecuado para vos. Si alguna pregunta no te resulta
          comoda, podes dejarla sin responder cuando no sea obligatoria.
        </p>
      </div>

      <form className="referral-form" onSubmit={onSubmit}>
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
          Nombre y apellido *
          <input
            autoComplete="name"
            value={form.fullName}
            onChange={(event) => updateField("fullName", event.target.value)}
            required
          />
        </label>

        <label>
          Quiero comenzar *
          <select
            value={form.startType}
            onChange={(event) => updateField("startType", event.target.value)}
            required
          >
            {startOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>

        <fieldset>
          <legend>De ser posible te gustaria que las sesiones sean presenciales *</legend>
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
          Si vivis en Argentina, de que provincia sos? *
          <input
            value={form.province}
            onChange={(event) => updateField("province", event.target.value)}
            required
          />
        </label>

        <label>
          Si no sos de Argentina, donde vivis?
          <input
            value={form.country}
            onChange={(event) => updateField("country", event.target.value)}
          />
        </label>

        <label>
          Si sos de CABA o Buenos Aires, de que barrio sos?
          <input
            value={form.neighborhood}
            onChange={(event) => updateField("neighborhood", event.target.value)}
          />
        </label>

        <label>
          Por que te gustaria comenzar terapia? *
          <textarea
            rows={4}
            value={form.reason}
            onChange={(event) => updateField("reason", event.target.value)}
            required
          />
        </label>

        <label>
          Preferencia acerca del profesional
          <select
            value={form.professionalPreference}
            onChange={(event) => updateField("professionalPreference", event.target.value)}
          >
            <option value="">Sin preferencia</option>
            {professionals.map((professional) => (
              <option key={professional.id} value={professional.fullName}>
                {professional.fullName} - {professional.specialty}
              </option>
            ))}
          </select>
        </label>

        <label>
          Repetinos el numero tal como se agenda para WhatsApp
          <input
            type="tel"
            value={form.whatsappContact}
            onChange={(event) => updateField("whatsappContact", event.target.value)}
          />
        </label>

        <button type="submit">Enviar por WhatsApp a administracion</button>
        {feedback ? <p className="status-text" aria-live="polite">{feedback}</p> : null}
      </form>
    </section>
  );
}
