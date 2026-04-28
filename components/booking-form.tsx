"use client";

import { useMemo, useState } from "react";

type BookingFormProps = {
  professionalId: number;
};

const dtFormatter = new Intl.DateTimeFormat("es-AR", {
  dateStyle: "short",
  timeStyle: "short",
});

export function BookingForm({ professionalId }: BookingFormProps) {
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
      setFeedback(payload.error ?? "No se pudo reservar el turno.");
      return;
    }

    setFeedback("Reserva solicitada en estado pendiente.");
    setPatientName("");
    setPatientEmail("");
    setReason("");
    setSelectedSlot("");
    await loadAvailability();
  }

  return (
    <div className="card booking-card">
      <h2>Reservar modulo</h2>
      <div className="booking-row">
        <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        <button type="button" onClick={loadAvailability}>
          Ver horarios
        </button>
      </div>

      {prettySlots.length > 0 ? (
        <select value={selectedSlot} onChange={(event) => setSelectedSlot(event.target.value)}>
          <option value="">Selecciona un horario</option>
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
          placeholder="Nombre, apellido o estudio"
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
          placeholder="Uso del espacio o comentario"
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          rows={3}
          required
        />
        <button type="submit">Solicitar reserva</button>
      </form>

      {feedback ? <p className="status-text">{feedback}</p> : null}
    </div>
  );
}
