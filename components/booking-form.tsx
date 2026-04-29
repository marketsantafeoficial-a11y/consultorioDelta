"use client";

import { useMemo, useState } from "react";

type BookingFormProps = {
  professionalId: number;
  purpose?: "spaces" | "appointments";
};

const ADMIN_PHONE = "5492214778280";
const ADMIN_EMAIL = "administracion@delta.local";

const dtFormatter = new Intl.DateTimeFormat("es-AR", {
  dateStyle: "short",
  timeStyle: "short",
});

export function BookingForm({ professionalId, purpose = "appointments" }: BookingFormProps) {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [patientName, setPatientName] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [reason, setReason] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  const prettySlots = useMemo(
    () => slots.map((slot) => ({ value: slot, label: dtFormatter.format(new Date(slot)) })),
    [slots],
  );

  async function loadAvailability() {
    const response = await fetch(
      `/api/availability?professionalId=${professionalId}&date=${date}`,
      { cache: "no-store" },
    );

    const payload = await response.json();
    if (!response.ok) {
      setFeedback(payload.error ?? "No se pudo cargar la disponibilidad.");
      return;
    }

    setFeedback(null);
    setSlots(payload.slots ?? []);
    setSelectedSlot("");
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedSlot) {
      setFeedback("Selecciona un horario disponible.");
      return;
    }

    if (purpose === "spaces") {
      const selectedDate = dtFormatter.format(new Date(selectedSlot));
      const message = [
        "Hola, quiero consultar por un modulo en Delta Consultorios.",
        "Necesidad: alquiler de consultorio / modulo.",
        `Fecha y horario: ${selectedDate}`,
        `Nombre / estudio: ${patientName}`,
        `Email: ${patientEmail}`,
        `Uso previsto: ${reason}`,
      ].join("\n");

      window.open(`https://wa.me/${ADMIN_PHONE}?text=${encodeURIComponent(message)}`, "_blank");
      setFeedback("Te abrimos WhatsApp para coordinar con administracion. El mensaje ya incluye para que necesitas el espacio.");
      return;
    }

    const response = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patientName,
        patientEmail,
        reason,
        startsAt: selectedSlot,
        professionalId,
      }),
    });

    const payload = await response.json();

    if (!response.ok) {
      setFeedback(payload.error ?? "No se pudo pedir el turno.");
      return;
    }

    setFeedback("Turno solicitado. El profesional lo vera en su panel como pendiente.");
    setPatientName("");
    setPatientEmail("");
    setReason("");
    setSelectedSlot("");
    await loadAvailability();
  }

  return (
    <div className="card booking-card">
      <h2>{purpose === "spaces" ? "Contactar administracion" : "Pedir turno"}</h2>
      <p className="muted">
        {purpose === "spaces"
          ? "Elegi una fecha tentativa. Esto no confirma la reserva: administracion valida disponibilidad, condiciones y carga el bloqueo final en agenda."
          : "Elegi un horario disponible. El pedido queda pendiente y se refleja en la agenda del profesional."}
      </p>
      <div className="booking-row">
        <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        <button type="button" onClick={loadAvailability}>
          Ver horarios
        </button>
      </div>

      {prettySlots.length > 0 ? (
        <select value={selectedSlot} onChange={(event) => setSelectedSlot(event.target.value)}>
          <option value="">Selecciona un horario tentativo</option>
          {prettySlots.map((slot) => (
            <option key={slot.value} value={slot.value}>
              {slot.label}
            </option>
          ))}
        </select>
      ) : (
        <p className="muted">Primero elegi fecha y presiona &quot;Ver horarios&quot;.</p>
      )}

      <form onSubmit={onSubmit} className="booking-form-fields">
        <input
          placeholder={purpose === "spaces" ? "Nombre, profesional o institucion" : "Nombre del paciente"}
          value={patientName}
          onChange={(event) => setPatientName(event.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={patientEmail}
          onChange={(event) => setPatientEmail(event.target.value)}
          required
        />
        <textarea
          placeholder={purpose === "spaces" ? "Uso del espacio o comentario" : "Motivo de consulta"}
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          rows={3}
          required
        />
        <button type="submit">{purpose === "spaces" ? "Consultar por WhatsApp" : "Solicitar turno"}</button>
      </form>

      {purpose === "spaces" ? (
        <a className="ghost-button contact-email-link" href={`mailto:${ADMIN_EMAIL}`}>
          Consultar por email
        </a>
      ) : null}

      {feedback ? <p className="status-text">{feedback}</p> : null}
    </div>
  );
}
