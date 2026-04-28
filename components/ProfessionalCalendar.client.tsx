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

const DAY_NAMES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MONTH_NAMES = [
  "Ene", "Feb", "Mar", "Abr", "May", "Jun",
  "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
];

function getWeekDays(offset = 0) {
  return Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + offset * 7 + i);
    d.setHours(0, 0, 0, 0);
    return d;
  });
}

function generateSlots(
  schedules: Professional["schedules"],
  mode: "online" | "presencial"
): string[] {
  const slots: string[] = [];
  if (!schedules) return slots;
  const relevant = schedules.filter(
    (s) => mode === "online" ? s.telehealth : !s.telehealth
  );
  for (const s of relevant) {
    const [sh, sm] = s.startTime.split(":").map(Number);
    const [eh, em] = s.endTime.split(":").map(Number);
    let h = sh, m = sm;
    while (h < eh || (h === eh && m < em)) {
      slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
      m += 30;
      if (m >= 60) { h++; m -= 60; }
    }
  }
  return [...new Set(slots)].sort();
}

function isSlotBusy(
  appts: Appointment[],
  day: Date,
  slot: string
): boolean {
  const [h, m] = slot.split(":").map(Number);
  const start = new Date(day);
  start.setHours(h, m, 0, 0);
  const end = new Date(start.getTime() + 50 * 60 * 1000);
  return appts.some((a) => {
    const s = new Date(a.startsAt);
    const e = new Date(s.getTime() + 50 * 60 * 1000);
    return s < end && e > start;
  });
}

function SpecialtyTag({ label }: { label: string }) {
  return <span className="spec-tag">{label}</span>;
}

function ProfCard({
  professional,
  appointments,
}: {
  professional: Professional;
  appointments: Appointment[];
}) {
  const [mode, setMode] = useState<"online" | "presencial">("online");
  const [weekOffset, setWeekOffset] = useState(0);

  const days = useMemo(() => getWeekDays(weekOffset), [weekOffset]);
  const allSlots = useMemo(
    () => generateSlots(professional.schedules, mode),
    [professional.schedules, mode]
  );

  // Fallback: show some default slots if no schedules configured
  const displaySlots = allSlots.length > 0
    ? allSlots
    : ["09:00", "09:30", "10:00", "10:30", "11:00", "14:00", "14:30", "15:00", "16:00"];

  const hasOnline = professional.schedules?.some((s) => s.telehealth) ?? true;
  const hasPresencial = professional.schedules?.some((s) => !s.telehealth) ?? true;

  const specsRaw = professional.serves ?? professional.specialty ?? "";
  const specs = specsRaw.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 5);

  return (
    <article className="prof-card">
      {/* ── Left: bio ── */}
      <div className="prof-card-bio">
        <div className="prof-avatar-wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={professional.photoUrl ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(professional.fullName)}&size=160&background=e8e4f8&color=4a4080&bold=true&rounded=true`}
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
              📍 {professional.consultory.city ?? professional.consultory.name}
            </p>
          )}
          {specs.length > 0 && (
            <div className="prof-specs">
              {specs.map((s) => <SpecialtyTag key={s} label={s} />)}
            </div>
          )}
          <Link href={`/profesionales/${professional.id}`} className="link-button" style={{ marginTop: "0.75rem", width: "fit-content" }}>
            Reservar modulo
          </Link>
        </div>
      </div>

      {/* ── Right: calendar ── */}
      <div className="prof-card-calendar">
        {/* Modalidad */}
        <div className="mode-toggle">
          <button
            className={`mode-btn ${mode === "online" ? "active" : ""}`}
            onClick={() => setMode("online")}
          >
            Virtual
          </button>
          <button
            className={`mode-btn ${mode === "presencial" ? "active" : ""}`}
            onClick={() => setMode("presencial")}
          >
            Presencial
          </button>
        </div>

        {/* Week navigation + day headers */}
        <div className="week-nav">
          <button
            className="week-arrow"
            onClick={() => setWeekOffset((o) => Math.max(0, o - 1))}
            disabled={weekOffset === 0}
            aria-label="Semana anterior"
          >
            ‹
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
            ›
          </button>
        </div>

        {/* Slots grid */}
        <div className="slots-scroll">
          <div className="slots-grid">
            {days.map((day) => {
              const dayOfWeek = day.getDay();
              const hasSchedule = professional.schedules?.some(
                (s) => s.dayOfWeek === dayOfWeek &&
                  (mode === "online" ? s.telehealth : !s.telehealth)
              ) ?? true; // fallback: show all days

              return (
                <div key={day.toISOString()} className="slots-col">
                  {hasSchedule ? (
                    displaySlots.map((slot) => {
                      const busy = isSlotBusy(appointments, day, slot);
                      return (
                        <button
                          key={slot}
                          className={`slot-btn ${busy ? "slot-busy" : "slot-free"}`}
                          disabled={busy}
                          title={busy ? "Ocupado" : `Disponible ${slot}`}
                        >
                          {slot}
                        </button>
                      );
                    })
                  ) : (
                    <p className="no-slots">—</p>
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

// ─── Main exported component ────────────────────────────────────────────────

export default function ProfessionalCalendar({
  professionals,
  appointments,
}: {
  professionals: Professional[];
  appointments: Appointment[];
}) {
  const [filter, setFilter] = useState<string>("Todos");

  // Collect unique resource types
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
      {/* Resource filter pills */}
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

      {/* Professional cards */}
      <div className="prof-cards-list">
        {filtered.map((p) => (
          <ProfCard
            key={p.id}
            professional={p}
            appointments={apptsByProfessional[p.id] ?? []}
          />
        ))}
        {filtered.length === 0 && (
          <p className="no-results">No hay consultorios disponibles con ese filtro.</p>
        )}
      </div>
    </div>
  );
}
