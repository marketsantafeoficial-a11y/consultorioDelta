"use client";

import { useState } from "react";

type ScheduleInput = {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  telehealth: boolean;
};

type Props = {
  initialSchedules: ScheduleInput[];
};

const dayNames = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];

export function ProfessionalAvailabilityEditor({ initialSchedules }: Props) {
  const [schedules, setSchedules] = useState<ScheduleInput[]>(initialSchedules);
  const [message, setMessage] = useState<string | null>(null);

  function addRow() {
    setSchedules((prev) => [...prev, { dayOfWeek: 1, startTime: "09:00", endTime: "13:00", telehealth: false }]);
  }

  function updateRow(index: number, patch: Partial<ScheduleInput>) {
    setSchedules((prev) => prev.map((item, idx) => (idx === index ? { ...item, ...patch } : item)));
  }

  function removeRow(index: number) {
    setSchedules((prev) => prev.filter((_, idx) => idx !== index));
  }

  async function save() {
    const response = await fetch("/api/professional/availability", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ schedules }),
    });

    const payload = await response.json();
    if (!response.ok) {
      setMessage(payload.error ?? "No se pudo actualizar disponibilidad.");
      return;
    }

    setMessage("Disponibilidad actualizada.");
  }

  return (
    <section className="card">
      <div className="section-head-inline">
        <h2>Mi disponibilidad</h2>
        <button type="button" onClick={addRow}>Agregar bloque</button>
      </div>
      <div className="availability-grid">
        {schedules.map((item, index) => (
          <article className="availability-row" key={`${item.dayOfWeek}-${index}`}>
            <select
              value={item.dayOfWeek}
              onChange={(event) => updateRow(index, { dayOfWeek: Number(event.target.value) })}
            >
              {dayNames.map((name, day) => (
                <option key={name} value={day}>
                  {name}
                </option>
              ))}
            </select>
            <input
              type="time"
              value={item.startTime}
              onChange={(event) => updateRow(index, { startTime: event.target.value })}
            />
            <input
              type="time"
              value={item.endTime}
              onChange={(event) => updateRow(index, { endTime: event.target.value })}
            />
            <label className="checkbox-inline">
              <input
                type="checkbox"
                checked={item.telehealth}
                onChange={(event) => updateRow(index, { telehealth: event.target.checked })}
              />
              Online
            </label>
            <button type="button" onClick={() => removeRow(index)}>
              Quitar
            </button>
          </article>
        ))}
      </div>
      <button type="button" onClick={save}>Guardar disponibilidad</button>
      {message ? <p className="status-text">{message}</p> : null}
    </section>
  );
}
