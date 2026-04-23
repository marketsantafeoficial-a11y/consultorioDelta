"use client";

import React, { useMemo, useState } from "react";

type Professional = {
  id: string;
  fullName: string;
  photoUrl?: string | null;
  specialty?: string | null;
  consultory?: { name?: string | null } | null;
};

type Appointment = {
  id: string;
  professionalId: string;
  patientName?: string | null;
  startsAt: string; // ISO
  endsAt?: string | null;
  status?: string | null;
};

export default function ProfessionalCalendar({
  professionals,
  appointments,
}: {
  professionals: Professional[];
  appointments: Appointment[];
}) {
  const [selectedId, setSelectedId] = useState<string | null>(
    professionals?.[0]?.id ?? null
  );

  const today = new Date();
  const days = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      d.setHours(0, 0, 0, 0);
      return d;
    });
  }, [today]);

  const hours = Array.from({ length: 10 }).map((_, i) => 8 + i); // 8..17

  const apptsByProfessional = useMemo(() => {
    const map: Record<string, Appointment[]> = {};
    (appointments || []).forEach((a) => {
      map[a.professionalId] = map[a.professionalId] || [];
      map[a.professionalId].push(a);
    });
    return map;
  }, [appointments]);

  const selectedAppts = apptsByProfessional[selectedId ?? ""] || [];

  function isSlotBusy(day: Date, hour: number) {
    const start = new Date(day);
    start.setHours(hour, 0, 0, 0);
    const end = new Date(start);
    end.setHours(hour + 1);

    return selectedAppts.some((a) => {
      const s = new Date(a.startsAt);
      const e = a.endsAt ? new Date(a.endsAt) : new Date(s.getTime() + 1000 * 60 * 50);
      return s < end && e > start;
    });
  }

  return (
    <div className="scheduler-grid">
      <aside className="scheduler-left">
        <h3>Profesionales</h3>
        <div className="professionals-list">
          {professionals.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedId(p.id)}
              className={`prof-item ${selectedId === p.id ? "active" : ""}`}
            >
              <img
                src={p.photoUrl ?? "https://placehold.co/80x80?text=+"}
                alt={p.fullName}
                width={56}
                height={56}
              />
              <div className="prof-meta">
                <div className="prof-name">{p.fullName}</div>
                <div className="prof-sub">{p.specialty ?? "-"}</div>
              </div>
            </button>
          ))}
        </div>
      </aside>

      <div className="scheduler-right">
        <div className="calendar-head">
          <h3>Disponibilidad</h3>
          <div className="muted">Seleccioná un profesional para ver sus turnos</div>
        </div>

        <div className="calendar-grid">
          <div className="calendar-row calendar-row-head">
            <div className="calendar-cell time-col"></div>
            {days.map((d) => (
              <div key={d.toISOString()} className="calendar-cell day-col">
                {d.toLocaleDateString(undefined, { weekday: "short", day: "numeric" })}
              </div>
            ))}
          </div>

          {hours.map((h) => (
            <div key={h} className="calendar-row">
              <div className="calendar-cell time-col">{h}:00</div>
              {days.map((d) => {
                const busy = isSlotBusy(d, h);
                return (
                  <div
                    key={d.toISOString() + h}
                    className={`calendar-cell slot ${busy ? "busy" : "available"}`}
                  >
                    {busy ? "Ocupado" : "Disponible"}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
