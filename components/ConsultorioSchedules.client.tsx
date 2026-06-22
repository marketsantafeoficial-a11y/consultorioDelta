"use client";

import { useState } from "react";

const DAYS = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"];
const HOURS = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
const MODULES = [
  { id: "manana", label: "Modulo MANANA", time: "9 a 12 hs", hours: [9, 10, 11] },
  { id: "mediodia", label: "Modulo MEDIODIA", time: "12 a 16 hs", hours: [12, 13, 14, 15] },
  { id: "tarde", label: "Modulo TARDE", time: "16 a 20 hs", hours: [16, 17, 18, 19] },
];

type ScheduleGrid = Record<number, string[]>;

type Consultorio = {
  id: string;
  name: string;
  subtitle: string;
  schedule: ScheduleGrid;
};

const CONSULTORIOS: Consultorio[] = [
  {
    id: "c1",
    name: "Consultorio 1",
    subtitle: "Planta Baja",
    schedule: Object.fromEntries(HOURS.map((h) => [h, ["", "", "", "", "", ""]])) as ScheduleGrid,
  },
  {
    id: "c2",
    name: "Consultorio 2",
    subtitle: "Planta Baja",
    schedule: Object.fromEntries(HOURS.map((h) => [h, ["", "", "", "", "", ""]])) as ScheduleGrid,
  },
  {
    id: "c3",
    name: "Consultorio 3",
    subtitle: "Planta Baja Ninos",
    schedule: {
      9: ["", "", "Antonella", "", "", ""],
      10: ["", "", "Antonella", "", "", ""],
      11: ["", "", "Antonella", "", "", ""],
      12: ["", "", "", "M Julia", "Angie", ""],
      13: ["", "Angie", "Angie", "M Julia", "", ""],
      14: ["Angie", "Angie", "Angie", "M Julia", "", ""],
      15: ["Angie", "Angie", "", "M Julia", "", ""],
      16: ["Angie", "", "", "", "Agustina", ""],
      17: ["Angie", "", "", "", "Agustina", "Angie"],
      18: ["", "Angie", "Angie", "Agustina", "Angie", ""],
      19: ["", "Angie", "Angie", "Agustina", "Angie", ""],
    },
  },
  {
    id: "c4",
    name: "Consultorio 4",
    subtitle: "1er Piso Frente",
    schedule: {
      9: ["Patricia", "", "Noelia", "", "", ""],
      10: ["Patricia", "", "Noelia", "", "", ""],
      11: ["Patricia", "", "Noelia", "", "", ""],
      12: ["Patricia", "", "", "", "Fernanda", ""],
      13: ["Patricia", "", "", "", "Fernanda", ""],
      14: ["Patricia", "", "", "Carolina", "Fernanda", ""],
      15: ["Patricia", "", "", "Carolina", "Fernanda", ""],
      16: ["Noelia", "Emilia", "Fernanda", "Carolina", "", ""],
      17: ["Noelia", "Emilia", "Fernanda", "Carolina", "", ""],
      18: ["Noelia", "Emilia", "Fernanda", "Carolina", "", ""],
      19: ["Noelia", "Emilia", "Fernanda", "", "", ""],
    },
  },
  {
    id: "c5",
    name: "Consultorio 5",
    subtitle: "1er Piso Frente",
    schedule: {
      9: ["", "Dalila", "Dalila", "", "", ""],
      10: ["", "Dalila", "Dalila", "", "", ""],
      11: ["", "Dalila", "Dalila", "", "", ""],
      12: ["", "", "Dalila", "", "", ""],
      13: ["", "", "Dalila", "", "", ""],
      14: ["", "Carolina", "Dalila", "", "", ""],
      15: ["", "Carolina", "Dalila", "", "", ""],
      16: ["", "Carolina", "Flavia", "Gabriela", "Mariano", ""],
      17: ["", "Carolina", "Flavia", "Gabriela", "Mariano", ""],
      18: ["", "Carolina", "Flavia", "Gabriela", "Mariano", ""],
      19: ["", "", "Flavia", "Gabriela", "Mariano", ""],
    },
  },
  {
    id: "c6",
    name: "Consultorio 6",
    subtitle: "1er Piso Atras",
    schedule: {
      9: ["", "Lujan", "", "", "", ""],
      10: ["", "Lujan", "", "", "", ""],
      11: ["", "Lujan", "", "", "", ""],
      12: ["Angeles", "", "Veronica", "", "Paula", ""],
      13: ["Angeles", "Daniel", "Veronica", "", "Paula", ""],
      14: ["Angeles", "Daniel", "Veronica", "Yamila", "Paula", ""],
      15: ["Angeles", "Daniel", "Veronica", "Yamila", "Paula", ""],
      16: ["Angeles", "Silvia", "Veronica", "Yamila", "Lujan", ""],
      17: ["Angeles", "Silvia", "Veronica", "", "Lujan", "Lujan"],
      18: ["Angeles", "Silvia", "Veronica", "", "Lujan", "Lujan"],
      19: ["Angeles", "Silvia", "Veronica", "", "Lujan", "Lujan"],
    },
  },
  {
    id: "c7",
    name: "Consultorio 7",
    subtitle: "1er Piso Atras",
    schedule: {
      9: ["", "", "Yanina", "Patricia", "", ""],
      10: ["", "", "Yanina", "Patricia", "", ""],
      11: ["", "", "Yanina", "Patricia", "", ""],
      12: ["", "Angeles", "", "Patricia", "", ""],
      13: ["", "Angeles", "", "Patricia", "Carolina", ""],
      14: ["", "Angeles", "", "Patricia", "Carolina", ""],
      15: ["", "Angeles", "", "Patricia", "Carolina", ""],
      16: ["Paula S", "Angeles", "Belen", "Maira", "Carolina", ""],
      17: ["Paula S", "Angeles", "Belen", "Maira", "Carolina", ""],
      18: ["Paula S", "Angeles", "Belen", "Maira", "", ""],
      19: ["Paula S", "Angeles", "Belen", "Maira", "", ""],
    },
  },
];

function getModuleDayStatus(schedule: ScheduleGrid, hours: number[], dayIndex: number) {
  const owners = hours
    .map((hour) => schedule[hour]?.[dayIndex]?.trim())
    .filter(Boolean);
  const uniqueOwners = Array.from(new Set(owners));

  return {
    occupied: uniqueOwners.length > 0,
    owners: uniqueOwners.join(", "),
  };
}

export default function ConsultorioSchedules() {
  const [openId, setOpenId] = useState<string | null>(null);

  function toggle(id: string) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  return (
    <div className="schedules-list">
      {CONSULTORIOS.map((c) => {
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
                <span>{c.subtitle}</span>
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
                      {MODULES.map((module) => (
                        <tr key={module.id}>
                          <td className="schedule-hour">
                            <strong>{module.label}</strong>
                            <span>{module.time}</span>
                          </td>
                          {DAYS.map((day, i) => {
                            const status = getModuleDayStatus(c.schedule, module.hours, i);
                            return (
                              <td
                                key={day}
                                className={status.occupied ? "schedule-occupied" : "schedule-free"}
                              >
                                <span className="schedule-state">
                                  {status.occupied ? "Ocupado" : "Disponible"}
                                </span>
                                {status.occupied ? <span className="schedule-owner">{status.owners}</span> : null}
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
