"use client";

import { useState } from "react";

const DAYS = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"];

export type ConsultorioAvailability = {
  id: string;
  name: string;
  modules: {
    id: string;
    label: string;
    time: string;
    days: boolean[];
  }[];
};

export default function ConsultorioSchedules({
  consultorios,
}: {
  consultorios: ConsultorioAvailability[];
}) {
  const [openId, setOpenId] = useState<string | null>(null);

  function toggle(id: string) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  if (consultorios.length === 0) {
    return (
      <p className="schedules-empty">
        Todavia no hay consultorios cargados. Escribinos por WhatsApp para consultar disponibilidad.
      </p>
    );
  }

  return (
    <div className="schedules-list">
      {consultorios.map((c) => {
        const isOpen = openId === c.id;
        return (
          <div key={c.id} className={`schedule-item ${isOpen ? "open" : ""}`}>
            <button
              type="button"
              className="schedule-header"
              onClick={() => toggle(c.id)}
            >
              <div className="schedule-header-text">
                <strong>{c.name}</strong>
              </div>
              <span className="schedule-chevron" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
            </button>
            {isOpen && (
              <div className="schedule-table-wrap">
                <div className="schedule-table-scroll">
                  <table className="schedule-table">
                    <thead>
                      <tr>
                        <th>Modulo</th>
                        {DAYS.map((d) => (
                          <th key={d}>{d}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {c.modules.map((module) => (
                        <tr key={module.id}>
                          <td className="schedule-hour">
                            <strong>{module.label}</strong>
                            <span>{module.time}</span>
                          </td>
                          {DAYS.map((day, i) => {
                            const occupied = module.days[i];
                            return (
                              <td
                                key={day}
                                className={occupied ? "schedule-occupied" : "schedule-free"}
                              >
                                <span className="schedule-state">
                                  {occupied ? "Ocupado" : "Disponible"}
                                </span>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
