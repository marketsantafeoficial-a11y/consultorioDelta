"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type ConsultoryOption = {
  id: number;
  name: string;
  city: string;
};

type ScheduleInput = {
  id?: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
};

type ModuleResource = {
  id: number;
  fullName: string;
  specialty: string;
  bio: string;
  serves?: string | null;
  photoUrl?: string | null;
  consultoryId: number;
  schedules: ScheduleInput[];
};

type Occupancy = {
  id: number;
  patientName: string;
  startsAt: string;
  professionalId: number;
  professionalName: string;
  status: string;
};

type Props = {
  consultories: ConsultoryOption[];
  modules: ModuleResource[];
  occupancies: Occupancy[];
};

const dayNames = [
  { value: 1, label: "Lunes" },
  { value: 2, label: "Martes" },
  { value: 3, label: "Miércoles" },
  { value: 4, label: "Jueves" },
  { value: 5, label: "Viernes" },
  { value: 6, label: "Sábado" },
];

const fixedModules = [
  { id: "morning", label: "Mañana", startTime: "09:00", endTime: "12:00" },
  { id: "midday", label: "Mediodía", startTime: "12:00", endTime: "16:00" },
  { id: "afternoon", label: "Tarde", startTime: "16:00", endTime: "20:00" },
];

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

function toTime(date: string) {
  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(date));
}

function defaultFixedSchedules() {
  return dayNames.flatMap((day) =>
    fixedModules.map((module) => ({
      dayOfWeek: day.value,
      startTime: module.startTime,
      endTime: module.endTime,
    })),
  );
}

function toMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function normalizeFixedSchedules(schedules: ScheduleInput[]) {
  if (schedules.length === 0) return defaultFixedSchedules();

  return schedules.flatMap((schedule) => {
    const start = toMinutes(schedule.startTime);
    const end = toMinutes(schedule.endTime);
    const coveredModules = fixedModules.filter(
      (module) => start <= toMinutes(module.startTime) && end >= toMinutes(module.endTime),
    );

    if (coveredModules.length === 0) return [schedule];

    return coveredModules.map((module) => ({
      dayOfWeek: schedule.dayOfWeek,
      startTime: module.startTime,
      endTime: module.endTime,
    }));
  });
}

function isScheduleEnabled(schedules: ScheduleInput[], dayOfWeek: number, startTime: string) {
  return schedules.some((schedule) => schedule.dayOfWeek === dayOfWeek && schedule.startTime === startTime);
}

export function AdminModulesManager({ consultories, modules, occupancies }: Props) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState(modules[0]?.id ?? 0);
  const selectedModule = modules.find((item) => item.id === selectedId) ?? modules[0];
  const [moduleForm, setModuleForm] = useState(() => ({
    id: selectedModule?.id as number | undefined,
    fullName: selectedModule?.fullName ?? "Consultorio nuevo",
    specialty: selectedModule?.specialty ?? "Módulo por hora",
    bio: selectedModule?.bio ?? "Espacio disponible para alquiler por módulo.",
    serves: selectedModule?.serves ?? "",
    photoUrl: selectedModule?.photoUrl ?? "",
    consultoryId: String(selectedModule?.consultoryId ?? consultories[0]?.id ?? ""),
  }));
  const [schedules, setSchedules] = useState<ScheduleInput[]>(normalizeFixedSchedules(selectedModule?.schedules ?? []));
  const [occupancyForm, setOccupancyForm] = useState({
    professionalId: String(selectedModule?.id ?? ""),
    date: todayString(),
    time: fixedModules[0].startTime,
    patientName: "",
    reason: "",
  });
  const [editingAppointmentId, setEditingAppointmentId] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"info" | "schedule" | "occupy">("info");

  const visibleOccupancies = useMemo(
    () => occupancies.filter((item) => item.status !== "CANCELED").slice(0, 30),
    [occupancies],
  );

  function selectModule(id: number) {
    const room = modules.find((item) => item.id === id);
    if (!room) return;

    setSelectedId(id);
    setModuleForm({
      id: room.id,
      fullName: room.fullName,
      specialty: room.specialty,
      bio: room.bio,
      serves: room.serves ?? "",
      photoUrl: room.photoUrl ?? "",
      consultoryId: String(room.consultoryId),
    });
    setSchedules(normalizeFixedSchedules(room.schedules));
    setOccupancyForm((current) => ({ ...current, professionalId: String(room.id) }));
    setActiveTab("info");
  }

  function newModule() {
    setSelectedId(0);
    setModuleForm({
      id: undefined,
      fullName: "Consultorio nuevo",
      specialty: "Módulo por hora",
      bio: "Espacio disponible para alquiler por módulo.",
      serves: "",
      photoUrl: "",
      consultoryId: String(consultories[0]?.id ?? ""),
    });
    setSchedules([...defaultFixedSchedules()]);
    setActiveTab("info");
  }

  function toggleFixedSchedule(dayOfWeek: number, module: (typeof fixedModules)[number]) {
    setSchedules((current) => {
      const exists = isScheduleEnabled(current, dayOfWeek, module.startTime);

      if (exists) {
        return current.filter((schedule) => !(schedule.dayOfWeek === dayOfWeek && schedule.startTime === module.startTime));
      }

      return [
        ...current,
        {
          dayOfWeek,
          startTime: module.startTime,
          endTime: module.endTime,
        },
      ].sort((a, b) => a.dayOfWeek - b.dayOfWeek || a.startTime.localeCompare(b.startTime));
    });
  }

  async function saveModule() {
    const response = await fetch("/api/admin/modules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...moduleForm,
        consultoryId: Number(moduleForm.consultoryId),
      }),
    });
    const payload = await response.json();

    if (!response.ok) {
      setMessage(payload.error ?? "No se pudo guardar el módulo.");
      return;
    }

    const moduleId = payload.module.id as number;
    const scheduleResponse = await fetch("/api/admin/schedules", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        professionalId: moduleId,
        schedules,
      }),
    });
    const schedulePayload = await scheduleResponse.json();

    if (!scheduleResponse.ok) {
      setMessage(schedulePayload.error ?? "Módulo guardado, pero no se pudieron guardar horarios.");
      return;
    }

    setMessage("✓ Módulo y horarios guardados correctamente.");
    router.refresh();
  }

  async function saveOccupancy(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await fetch("/api/admin/occupancy", {
      method: editingAppointmentId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...occupancyForm,
        professionalId: Number(occupancyForm.professionalId),
        appointmentId: editingAppointmentId ?? undefined,
      }),
    });
    const payload = await response.json();

    if (!response.ok) {
      setMessage(payload.error ?? "No se pudo guardar la ocupación.");
      return;
    }

    setMessage(editingAppointmentId ? "✓ Horario movido/editado." : "✓ Ocupación cargada en agenda.");
    setOccupancyForm((current) => ({ ...current, patientName: "", reason: "" }));
    setEditingAppointmentId(null);
    router.refresh();
  }

  function editOccupancy(item: Occupancy) {
    const date = new Date(item.startsAt);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");

    setEditingAppointmentId(item.id);
    setOccupancyForm({
      professionalId: String(item.professionalId),
      date: `${yyyy}-${mm}-${dd}`,
      time: `${hh}:${min}`,
      patientName: item.patientName,
      reason: "Editado manualmente por administración",
    });
    setMessage("Editando horario: cambia módulo, fecha, hora o nombre y guarda.");
    setActiveTab("occupy");
  }

  function cancelEdit() {
    setEditingAppointmentId(null);
    setOccupancyForm({
      professionalId: String(selectedModule?.id ?? ""),
      date: todayString(),
      time: fixedModules[0].startTime,
      patientName: "",
      reason: "",
    });
    setMessage(null);
  }

  async function cancelOccupancy(appointmentId: number) {
    const response = await fetch("/api/admin/occupancy", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ appointmentId }),
    });
    const payload = await response.json();

    if (!response.ok) {
      setMessage(payload.error ?? "No se pudo liberar el horario.");
      return;
    }

    setMessage("✓ Horario liberado.");
    router.refresh();
  }

  return (
    <div className="admin-modules-simple">
      <div className="admin-module-selector">
        <div className="admin-module-tabs">
          {modules.map((room) => (
            <button
              type="button"
              key={room.id}
              className={`admin-module-tab ${selectedId === room.id ? "active" : ""}`}
              onClick={() => selectModule(room.id)}
            >
              {room.fullName}
            </button>
          ))}
          <button type="button" className="admin-module-tab add-new" onClick={newModule}>
            + Nuevo
          </button>
        </div>
      </div>

      <div className="admin-module-tabs-nav">
        <button
          type="button"
          className={`admin-tab-btn ${activeTab === "info" ? "active" : ""}`}
          onClick={() => setActiveTab("info")}
        >
          Información
        </button>
        <button
          type="button"
          className={`admin-tab-btn ${activeTab === "schedule" ? "active" : ""}`}
          onClick={() => setActiveTab("schedule")}
        >
          Horarios
        </button>
        <button
          type="button"
          className={`admin-tab-btn ${activeTab === "occupy" ? "active" : ""}`}
          onClick={() => setActiveTab("occupy")}
        >
          Ocupar horario
        </button>
      </div>

      {activeTab === "info" && (
        <section className="admin-tab-panel">
          <h3>Datos del consultorio</h3>
          <div className="admin-simple-form">
            <div className="admin-form-section">
              <label>
                <span>Nombre</span>
                <input value={moduleForm.fullName} onChange={(event) => setModuleForm({ ...moduleForm, fullName: event.target.value })} />
              </label>
              <label>
                <span>Detalle</span>
                <input value={moduleForm.specialty} onChange={(event) => setModuleForm({ ...moduleForm, specialty: event.target.value })} />
              </label>
              <label>
                <span>Descripción</span>
                <textarea rows={3} value={moduleForm.bio} onChange={(event) => setModuleForm({ ...moduleForm, bio: event.target.value })} />
              </label>
              <label>
                <span>Usos / equipamiento</span>
                <input value={moduleForm.serves} onChange={(event) => setModuleForm({ ...moduleForm, serves: event.target.value })} />
              </label>
              <label>
                <span>Foto (URL)</span>
                <input value={moduleForm.photoUrl} onChange={(event) => setModuleForm({ ...moduleForm, photoUrl: event.target.value })} />
              </label>
              <label>
                <span>Sede</span>
                <select value={moduleForm.consultoryId} onChange={(event) => setModuleForm({ ...moduleForm, consultoryId: event.target.value })}>
                  {consultories.map((consultory) => (
                    <option key={consultory.id} value={consultory.id}>{consultory.name}</option>
                  ))}
                </select>
              </label>
            </div>
            <button type="button" onClick={saveModule} className="admin-submit-btn">
              Guardar información
            </button>
          </div>
        </section>
      )}

      {activeTab === "schedule" && (
        <section className="admin-tab-panel">
          <h3>Disponibilidad semanal</h3>
          <p className="admin-tab-note">Activá los módulos disponibles para este consultorio.</p>
          <div className="admin-schedule-grid">
            <div className="admin-schedule-header">
              <span></span>
              {fixedModules.map((module) => (
                <div key={module.id} className="admin-schedule-module-head">
                  <strong>{module.label}</strong>
                  <span>{module.startTime} a {module.endTime} hs</span>
                </div>
              ))}
            </div>
            {dayNames.map((day) => (
              <div key={day.value} className="admin-schedule-row">
                <strong>{day.label}</strong>
                {fixedModules.map((module) => (
                  <label key={module.id} className="admin-schedule-checkbox">
                    <input
                      type="checkbox"
                      checked={isScheduleEnabled(schedules, day.value, module.startTime)}
                      onChange={() => toggleFixedSchedule(day.value, module)}
                    />
                    <span>✓</span>
                  </label>
                ))}
              </div>
            ))}
          </div>
          <div className="admin-schedule-actions">
            <button type="button" onClick={() => setSchedules(defaultFixedSchedules())} className="admin-ghost-btn">
              Activar todos
            </button>
            <button type="button" onClick={() => setSchedules([])} className="admin-ghost-btn">
              Vaciar
            </button>
            <button type="button" onClick={saveModule} className="admin-submit-btn">
              Guardar horarios
            </button>
          </div>
        </section>
      )}

      {activeTab === "occupy" && (
        <section className="admin-tab-panel">
          <h3>{editingAppointmentId ? "Mover / editar horario" : "Ocupar horario"}</h3>
          <p className="admin-tab-note">Cargá un nombre en un día y módulo, o mové una ocupación existente.</p>
          <form className="admin-simple-form" onSubmit={saveOccupancy}>
            <div className="admin-form-section">
              <label>
                <span>Consultorio</span>
                <select value={occupancyForm.professionalId} onChange={(event) => setOccupancyForm({ ...occupancyForm, professionalId: event.target.value })}>
                  {modules.map((room) => (
                    <option key={room.id} value={room.id}>{room.fullName}</option>
                  ))}
                </select>
              </label>
              <label>
                <span>Fecha</span>
                <input type="date" value={occupancyForm.date} onChange={(event) => setOccupancyForm({ ...occupancyForm, date: event.target.value })} />
              </label>
              <label>
                <span>Módulo horario</span>
                <select value={occupancyForm.time} onChange={(event) => setOccupancyForm({ ...occupancyForm, time: event.target.value })}>
                  {fixedModules.map((module) => (
                    <option key={module.id} value={module.startTime}>
                      {module.label} - {module.startTime} a {module.endTime} hs
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>Nombre que aparece en agenda</span>
                <input value={occupancyForm.patientName} onChange={(event) => setOccupancyForm({ ...occupancyForm, patientName: event.target.value })} required />
              </label>
              <label>
                <span>Nota</span>
                <input value={occupancyForm.reason} onChange={(event) => setOccupancyForm({ ...occupancyForm, reason: event.target.value })} />
              </label>
            </div>
            <div className="admin-form-actions">
              <button type="submit" className="admin-submit-btn">
                {editingAppointmentId ? "Guardar cambios" : "Cargar ocupación"}
              </button>
              {editingAppointmentId && (
                <button type="button" onClick={cancelEdit} className="admin-ghost-btn">
                  Cancelar edición
                </button>
              )}
            </div>
          </form>

          <div className="admin-occupancies-section">
            <h4>Últimos horarios ocupados</h4>
            <div className="admin-occupancies-list">
              {visibleOccupancies.map((item) => (
                <article key={item.id} className="admin-occupancy-row">
                  <div>
                    <strong>{item.patientName}</strong>
                    <span>{item.professionalName} - {toTime(item.startsAt)}</span>
                  </div>
                  <div className="admin-occupancy-actions">
                    <button type="button" onClick={() => editOccupancy(item)} className="admin-ghost-btn">
                      Mover
                    </button>
                    <button type="button" onClick={() => cancelOccupancy(item.id)} className="admin-ghost-btn danger">
                      Liberar
                    </button>
                  </div>
                </article>
              ))}
              {visibleOccupancies.length === 0 && (
                <p className="admin-empty">No hay horarios ocupados todavía.</p>
              )}
            </div>
          </div>
        </section>
      )}

      {message && <p className="admin-feedback">{message}</p>}
    </div>
  );
}
