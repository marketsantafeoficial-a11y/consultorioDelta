"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";

type Professional = {
  id: string;
  fullName: string;
  photoUrl?: string | null;
  specialty?: string | null;
  bio?: string | null;
  serves?: string | null;
  colorToken?: string | null;
  consultory?: { name?: string | null; city?: string | null } | null;
  schedules?: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    telehealth: boolean;
  }[];
};

type Appointment = {
  id: string;
  professionalId: string;
  patientName?: string | null;
  startsAt: string;
  status?: string | null;
};

const DAY_NAMES = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];
const MONTH_NAMES = [
  "Ene", "Feb", "Mar", "Abr", "May", "Jun",
  "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
];
const ADMIN_PHONE = "5492214778280";
const ADMIN_EMAIL = "administracion@delta.local";
const FIXED_MODULES = [
  { label: "Manana", startTime: "09:00", endTime: "12:00" },
  { label: "Mediodia", startTime: "12:00", endTime: "16:00" },
  { label: "Tarde", startTime: "16:00", endTime: "20:00" },
];

function toMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function normalizeFixedSchedules(schedules: Professional["schedules"]) {
  if (!schedules || schedules.length === 0) {
    return Array.from({ length: 6 }).flatMap((_, index) =>
      FIXED_MODULES.map((module) => ({
        dayOfWeek: index + 1,
        startTime: module.startTime,
        endTime: module.endTime,
        telehealth: false,
      })),
    );
  }

  return schedules.flatMap((schedule) => {
    if (schedule.telehealth) return [schedule];

    const start = toMinutes(schedule.startTime);
    const end = toMinutes(schedule.endTime);
    const coveredModules = FIXED_MODULES.filter(
      (module) => start <= toMinutes(module.startTime) && end >= toMinutes(module.endTime),
    );

    if (coveredModules.length === 0) return [schedule];

    return coveredModules.map((module) => ({
      ...schedule,
      startTime: module.startTime,
      endTime: module.endTime,
    }));
  });
}

function getWeekDays(offset = 0) {
  const start = new Date();
  const day = start.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + diffToMonday + offset * 7);
  start.setHours(0, 0, 0, 0);

  return Array.from({ length: 6 }).map((_, i) => {
    const d = new Date();
    d.setDate(start.getDate() + i);
    d.setHours(0, 0, 0, 0);
    return d;
  });
}

function generateSlots(
  schedules: Professional["schedules"],
  mode: "online" | "presencial",
  intervalMinutes = 30,
  includeEnd = false,
): string[] {
  const slots: string[] = [];
  if (!schedules) return slots;

  const relevant = schedules.filter((s) =>
    mode === "online" ? s.telehealth : !s.telehealth,
  );

  if (intervalMinutes === 240) {
    return relevant
      .filter((schedule) =>
        FIXED_MODULES.some((module) => module.startTime === schedule.startTime && module.endTime === schedule.endTime),
      )
      .map((schedule) => schedule.startTime)
      .filter((slot, index, all) => all.indexOf(slot) === index)
      .sort();
  }

  for (const s of relevant) {
    const [sh, sm] = s.startTime.split(":").map(Number);
    const [eh, em] = s.endTime.split(":").map(Number);
    let h = sh;
    let m = sm;

    while (h < eh || (h === eh && (includeEnd ? m <= em : m < em))) {
      slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
      m += intervalMinutes;
      if (m >= 60) {
        h++;
        m -= 60;
      }
    }
  }

  return [...new Set(slots)].sort();
}

function findAppointmentForSlot(appts: Appointment[], day: Date, slot: string) {
  const [h, m] = slot.split(":").map(Number);
  const start = new Date(day);
  start.setHours(h, m, 0, 0);
  const end = new Date(start.getTime() + 4 * 60 * 60 * 1000);

  return appts.find((a) => {
    const s = new Date(a.startsAt);
    const e = new Date(s.getTime() + 4 * 60 * 60 * 1000);
    return s < end && e > start;
  });
}

function getFixedModuleLabel(slot: string) {
  const fixedModule = FIXED_MODULES.find((item) => item.startTime === slot);
  return fixedModule ? `${fixedModule.label} ${fixedModule.startTime}-${fixedModule.endTime}` : slot;
}

function getContactHref(professional: Professional, day: Date, slot: string) {
  const need = professional.specialty
    ? `alquiler de modulo para ${professional.specialty.toLowerCase()}`
    : "alquiler de modulo";
  const message = [
    "Hola, quiero consultar disponibilidad para DELTA – ESPACIOS PROFESIONALES.",
    `Necesidad: ${need}`,
    `Espacio: ${professional.fullName}`,
    professional.serves ? `Uso previsto: ${professional.serves}` : null,
    `Fecha: ${day.toLocaleDateString("es-AR")}`,
    `Modulo: ${slot}`,
  ].filter(Boolean).join("\n");

  return `https://wa.me/${ADMIN_PHONE}?text=${encodeURIComponent(message)}`;
}

function getStatusLabel(status?: string | null) {
  if (status === "CONFIRMED") return "Reservado";
  if (status === "PENDING") return "En gestion";
  if (status === "CANCELED") return "Cancelado";
  return "Ocupado";
}

function SpecialtyTag({ label }: { label: string }) {
  return <span className="spec-tag">{label}</span>;
}

function ProfCard({
  professional,
  appointments,
  purpose,
}: {
  professional: Professional;
  appointments: Appointment[];
  purpose: "spaces" | "appointments";
}) {
  const [mode, setMode] = useState<"online" | "presencial">("presencial");
  const [weekOffset, setWeekOffset] = useState(0);

  const days = useMemo(() => getWeekDays(weekOffset), [weekOffset]);
  const schedulesForDisplay = useMemo(
    () => purpose === "spaces" ? normalizeFixedSchedules(professional.schedules) : professional.schedules,
    [professional.schedules, purpose],
  );
  const allSlots = useMemo(
    () => generateSlots(
      schedulesForDisplay,
      mode,
      purpose === "spaces" ? 60 : 30,
      purpose === "spaces",
    ),
    [schedulesForDisplay, mode, purpose],
  );
  const displaySlots = allSlots.length > 0
    ? allSlots
    : purpose === "spaces"
      ? FIXED_MODULES.map((module) => module.startTime)
      : ["09:00", "09:30", "10:00", "10:30", "11:00", "14:00", "14:30", "15:00", "16:00"];

  const hasOnline = schedulesForDisplay?.some((s) => s.telehealth) ?? false;
  const hasPresencial = schedulesForDisplay?.some((s) => !s.telehealth) ?? true;
  const specsRaw = professional.serves ?? professional.specialty ?? "";
  const specs = specsRaw.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 5);

  return (
    <article className={`prof-card ${purpose === "spaces" ? "space-agenda-card" : ""}`}>
      {purpose === "appointments" && (
        <div className="prof-card-bio">
          <div className="prof-avatar-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={professional.photoUrl ?? "/delta-assets/professional-avatar.svg"}
              alt={professional.fullName}
              className="prof-avatar"
            />
            <div className="prof-mode-badges">
              {hasOnline && <span className="mode-badge online">Virtual</span>}
              {hasPresencial && <span className="mode-badge presencial">Presencial</span>}
            </div>
          </div>

          <div className="prof-bio-text">
            <p className="prof-card-name">{professional.fullName}</p>
            <p className="prof-card-specialty">{professional.specialty}</p>
            {professional.consultory?.name && (
              <p className="prof-card-location">
                {professional.consultory.name} - {professional.consultory.city}
              </p>
            )}
            {specs.length > 0 && (
              <div className="prof-specs">
                {specs.map((s) => <SpecialtyTag key={s} label={s} />)}
              </div>
            )}
            <Link href={`/profesionales/${professional.id}`} className="link-button" style={{ marginTop: "0.75rem", width: "fit-content" }}>
              Pedir turno
            </Link>
          </div>
        </div>
      )}

      <div className="prof-card-calendar">
        {purpose === "spaces" && (
          <div className="space-calendar-title">
            <span>{professional.specialty}</span>
            <strong>{professional.fullName}</strong>
          </div>
        )}
        <div className="calendar-toolbar">
          <div className="mode-toggle">
            {hasOnline && (
              <button
                className={`mode-btn ${mode === "online" ? "active" : ""}`}
                onClick={() => setMode("online")}
              >
                Virtual
              </button>
            )}
            {hasPresencial && (
              <button
                className={`mode-btn ${mode === "presencial" ? "active" : ""}`}
                onClick={() => setMode("presencial")}
              >
                Presencial
              </button>
            )}
          </div>
          <div className="calendar-legend" aria-label="Referencias">
            <span><i className="legend-free" /> Libre</span>
            <span><i className="legend-pending" /> En gestion</span>
            <span><i className="legend-busy" /> Reservado</span>
          </div>
        </div>

        <div className="week-nav">
          <button
            className="week-arrow"
            onClick={() => setWeekOffset((o) => Math.max(0, o - 1))}
            disabled={weekOffset === 0}
            aria-label="Semana anterior"
          >
            {"<"}
          </button>
          <div className="week-days-header">
            {days.map((d) => (
              <div key={d.toISOString()} className="week-day-col">
                <span className="week-day-name">{DAY_NAMES[d.getDay()]}</span>
                <span className="week-day-num">
                  {d.getDate()} {MONTH_NAMES[d.getMonth()]}
                </span>
              </div>
            ))}
          </div>
          <button
            className="week-arrow"
            onClick={() => setWeekOffset((o) => o + 1)}
            aria-label="Semana siguiente"
          >
            {">"}
          </button>
        </div>

        <div className="slots-scroll">
          <div className="slots-grid">
            {days.map((day) => {
              const dayOfWeek = day.getDay();
              const daySchedules = schedulesForDisplay?.filter(
                (s) => s.dayOfWeek === dayOfWeek &&
                  (mode === "online" ? s.telehealth : !s.telehealth),
              ) ?? [];
              const daySlots = purpose === "spaces"
                ? generateSlots(daySchedules, mode, 240)
                : displaySlots;
              const hasSchedule = purpose === "spaces" ? daySlots.length > 0 : daySchedules.length > 0;

              return (
                <div key={day.toISOString()} className="slots-col">
                  {hasSchedule ? (
                    daySlots.map((slot) => {
                      const appointment = findAppointmentForSlot(appointments, day, slot);
                      const busy = Boolean(appointment);
                      const statusClass = appointment?.status === "PENDING"
                        ? "slot-pending"
                        : "slot-busy";

                      return (
                        <a
                          key={slot}
                          className={`slot-btn ${busy ? statusClass : "slot-free"}`}
                          href={busy ? undefined : purpose === "spaces"
                            ? getContactHref(professional, day, slot)
                            : `/profesionales/${professional.id}`}
                          target={busy || purpose === "appointments" ? undefined : "_blank"}
                          rel={busy || purpose === "appointments" ? undefined : "noreferrer"}
                          aria-disabled={busy}
                          title={busy ? getStatusLabel(appointment?.status) : purpose === "spaces" ? `Consultar ${getFixedModuleLabel(slot)}` : `Pedir turno ${slot}`}
                        >
                          {purpose === "spaces" ? getFixedModuleLabel(slot) : slot}
                          <span>
                            {busy
                              ? purpose === "spaces"
                                ? appointment?.patientName ?? getStatusLabel(appointment?.status)
                                : getStatusLabel(appointment?.status)
                              : purpose === "spaces" ? "Libre" : "Turno"}
                          </span>
                        </a>
                      );
                    })
                  ) : (
                    <p className="no-slots">-</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function ProfessionalCalendar({
  professionals,
  appointments,
  purpose = "spaces",
}: {
  professionals: Professional[];
  appointments: Appointment[];
  purpose?: "spaces" | "appointments";
}) {
  const [filter, setFilter] = useState<string>("Todos");

  const specialties = useMemo(() => {
    const set = new Set<string>();
    professionals.forEach((p) => {
      if (p.specialty) set.add(p.specialty);
    });
    return ["Todos", ...Array.from(set)];
  }, [professionals]);

  const filtered = filter === "Todos"
    ? professionals
    : professionals.filter((p) => p.specialty === filter);

  const apptsByProfessional = useMemo(() => {
    const map: Record<string, Appointment[]> = {};
    appointments.forEach((a) => {
      map[a.professionalId] = map[a.professionalId] || [];
      map[a.professionalId].push(a);
    });
    return map;
  }, [appointments]);

  return (
    <div className="agenda-root">
      <div className="agenda-contact-strip">
        <div>
          <strong>
            {purpose === "spaces"
              ? "Agenda de disponibilidad para alquiler de consultorios."
              : "Agenda de profesionales: el paciente puede pedir turno."}
          </strong>
          <p>
            {purpose === "spaces"
              ? "Los modulos fijos son manana 9 a 12, mediodia 12 a 16 y tarde 16 a 20 hs."
              : "Cada profesional tiene su propia agenda. Los turnos pedidos quedan pendientes y se ven en su panel independiente."}
          </p>
        </div>
        <div className="agenda-contact-actions">
          <a
            className="link-button"
            href={`https://wa.me/${ADMIN_PHONE}?text=${encodeURIComponent(
              purpose === "spaces"
                ? "Hola, quiero consultar por alquiler de modulos en DELTA – ESPACIOS PROFESIONALES. Necesito un espacio para: "
                : "Hola, quiero consultar por turnos profesionales en DELTA – ESPACIOS PROFESIONALES. Busco atencion de: ",
            )}`}
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp 221 477 8280
          </a>
          <a className="ghost-button" href={`mailto:${ADMIN_EMAIL}`}>
            Email
          </a>
        </div>
      </div>

      {specialties.length > 1 && (
        <div className="specialty-filters">
          {specialties.map((s) => (
            <button
              key={s}
              className={`filter-pill ${filter === s ? "active" : ""}`}
              onClick={() => setFilter(s)}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="prof-cards-list">
        {filtered.map((p) => (
          <ProfCard
            key={p.id}
            professional={p}
            appointments={apptsByProfessional[p.id] ?? []}
            purpose={purpose}
          />
        ))}
        {filtered.length === 0 && (
          <p className="no-results">No hay consultorios disponibles con ese filtro.</p>
        )}
      </div>
    </div>
  );
}
