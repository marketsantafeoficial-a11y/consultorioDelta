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
  { value: 3, label: "Miercoles" },
  { value: 4, label: "Jueves" },
  { value: 5, label: "Viernes" },
  { value: 6, label: "Sabado" },
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

export function AdminModulesManager({ consultories, modules, occupancies }: Props) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState(modules[0]?.id ?? 0);
  const selectedModule = modules.find((item) => item.id === selectedId) ?? modules[0];
  const [moduleForm, setModuleForm] = useState(() => ({
    id: selectedModule?.id as number | undefined,
    fullName: selectedModule?.fullName ?? "Consultorio nuevo",
    specialty: selectedModule?.specialty ?? "Modulo por hora",
    bio: selectedModule?.bio ?? "Espacio disponible para alquiler por modulo.",
    serves: selectedModule?.serves ?? "",
    photoUrl: selectedModule?.photoUrl ?? "",
    consultoryId: String(selectedModule?.consultoryId ?? consultories[0]?.id ?? ""),
  }));
  const [schedules, setSchedules] = useState<ScheduleInput[]>(selectedModule?.schedules ?? []);
  const [occupancyForm, setOccupancyForm] = useState({
    professionalId: String(selectedModule?.id ?? ""),
    date: todayString(),
    time: "09:00",
    patientName: "",
    reason: "",
  });
  const [editingAppointmentId, setEditingAppointmentId] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);

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
    setSchedules(room.schedules);
    setOccupancyForm((current) => ({ ...current, professionalId: String(room.id) }));
  }

  function newModule() {
    setSelectedId(0);
    setModuleForm({
      id: undefined,
      fullName: "Consultorio nuevo",
      specialty: "Modulo por hora",
      bio: "Espacio disponible para alquiler por modulo.",
      serves: "",
      photoUrl: "",
      consultoryId: String(consultories[0]?.id ?? ""),
    });
    setSchedules([
      { dayOfWeek: 1, startTime: "08:00", endTime: "20:00" },
      { dayOfWeek: 2, startTime: "08:00", endTime: "20:00" },
      { dayOfWeek: 3, startTime: "08:00", endTime: "20:00" },
      { dayOfWeek: 4, startTime: "08:00", endTime: "20:00" },
      { dayOfWeek: 5, startTime: "08:00", endTime: "20:00" },
      { dayOfWeek: 6, startTime: "08:00", endTime: "20:00" },
    ]);
  }

  function updateSchedule(index: number, patch: Partial<ScheduleInput>) {
    setSchedules((current) => current.map((item, idx) => idx === index ? { ...item, ...patch } : item));
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
      setMessage(payload.error ?? "No se pudo guardar el modulo.");
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
      setMessage(schedulePayload.error ?? "Modulo guardado, pero no se pudieron guardar horarios.");
      return;
    }

    setMessage("Modulo y horarios guardados.");
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
      setMessage(payload.error ?? "No se pudo guardar la ocupacion.");
      return;
    }

    setMessage(editingAppointmentId ? "Horario movido/editado." : "Ocupacion cargada en agenda.");
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
      reason: "Editado manualmente por administracion",
    });
    setMessage("Editando horario: cambia modulo, fecha, hora o nombre y guarda.");
  }

  function cancelEdit() {
    setEditingAppointmentId(null);
    setOccupancyForm({
      professionalId: String(selectedModule?.id ?? ""),
      date: todayString(),
      time: "09:00",
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

    setMessage("Horario liberado.");
    router.refresh();
  }

  return (
    <div className="admin-modules-manager">
      <div className="module-picker">
        {modules.map((room) => (
          <button
            type="button"
            key={room.id}
            className={`filter-pill ${selectedId === room.id ? "active" : ""}`}
            onClick={() => selectModule(room.id)}
          >
            {room.fullName}
          </button>
        ))}
        <button type="button" className="ghost-button" onClick={newModule}>
          Nuevo modulo
        </button>
      </div>

      <div className="admin-board-grid">
        <section className="card admin-edit-card admin-board-card">
          <span className="admin-board-kicker">Paso 1</span>
          <h3>Datos del modulo</h3>
          <p className="admin-board-note">Crea o edita el gabinete que se muestra en la agenda publica.</p>
          <div className="form-two-cols">
            <label>
              Nombre
              <input value={moduleForm.fullName} onChange={(event) => setModuleForm({ ...moduleForm, fullName: event.target.value })} />
            </label>
            <label>
              Detalle
              <input value={moduleForm.specialty} onChange={(event) => setModuleForm({ ...moduleForm, specialty: event.target.value })} />
            </label>
          </div>
          <label>
            Descripcion
            <textarea rows={3} value={moduleForm.bio} onChange={(event) => setModuleForm({ ...moduleForm, bio: event.target.value })} />
          </label>
          <label>
            Usos / equipamiento
            <input value={moduleForm.serves} onChange={(event) => setModuleForm({ ...moduleForm, serves: event.target.value })} />
          </label>
          <div className="form-two-cols">
            <label>
              Foto URL
              <input value={moduleForm.photoUrl} onChange={(event) => setModuleForm({ ...moduleForm, photoUrl: event.target.value })} />
            </label>
            <label>
              Sede
              <select value={moduleForm.consultoryId} onChange={(event) => setModuleForm({ ...moduleForm, consultoryId: event.target.value })}>
                {consultories.map((consultory) => (
                  <option key={consultory.id} value={consultory.id}>{consultory.name}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="admin-inline-actions">
            <button type="button" onClick={saveModule}>Guardar datos del modulo</button>
          </div>
        </section>

        <section className="card admin-edit-card admin-board-card">
          <span className="admin-board-kicker">Paso 2</span>
          <h3>Disponibilidad semanal</h3>
          <p className="admin-board-note">Define que dias y rangos horarios existen para este modulo.</p>
          <div className="availability-grid">
            {schedules.map((schedule, index) => (
              <article className="availability-row" key={`${schedule.dayOfWeek}-${index}`}>
                <select value={schedule.dayOfWeek} onChange={(event) => updateSchedule(index, { dayOfWeek: Number(event.target.value) })}>
                  {dayNames.map((day) => (
                    <option key={day.value} value={day.value}>{day.label}</option>
                  ))}
                </select>
                <input type="time" value={schedule.startTime} onChange={(event) => updateSchedule(index, { startTime: event.target.value })} />
                <input type="time" value={schedule.endTime} onChange={(event) => updateSchedule(index, { endTime: event.target.value })} />
                <button type="button" onClick={() => setSchedules((current) => current.filter((_, idx) => idx !== index))}>Quitar</button>
              </article>
            ))}
          </div>
          <div className="admin-inline-actions">
            <button type="button" onClick={() => setSchedules((current) => [...current, { dayOfWeek: 1, startTime: "08:00", endTime: "20:00" }])}>
              Agregar horario
            </button>
            <button type="button" onClick={saveModule}>Guardar horarios</button>
          </div>
        </section>

        <section className="card admin-edit-card admin-board-card">
          <span className="admin-board-kicker">Paso 3</span>
          <h3>{editingAppointmentId ? "Mover / editar horario" : "Ocupar horario"}</h3>
          <p className="admin-board-note">Carga un nombre en un dia y hora, o mueve una ocupacion existente.</p>
          <form className="admin-professional-form" onSubmit={saveOccupancy}>
            <label>
              Modulo
              <select value={occupancyForm.professionalId} onChange={(event) => setOccupancyForm({ ...occupancyForm, professionalId: event.target.value })}>
                {modules.map((room) => (
                  <option key={room.id} value={room.id}>{room.fullName}</option>
                ))}
              </select>
            </label>
            <div className="form-two-cols">
              <label>
                Fecha
                <input type="date" value={occupancyForm.date} onChange={(event) => setOccupancyForm({ ...occupancyForm, date: event.target.value })} />
              </label>
              <label>
                Hora
                <input type="time" value={occupancyForm.time} onChange={(event) => setOccupancyForm({ ...occupancyForm, time: event.target.value })} />
              </label>
            </div>
            <label>
              Nombre que aparece en agenda
              <input value={occupancyForm.patientName} onChange={(event) => setOccupancyForm({ ...occupancyForm, patientName: event.target.value })} required />
            </label>
            <label>
              Nota
              <input value={occupancyForm.reason} onChange={(event) => setOccupancyForm({ ...occupancyForm, reason: event.target.value })} />
            </label>
            <div className="admin-inline-actions">
              <button type="submit">{editingAppointmentId ? "Guardar cambios" : "Cargar ocupacion"}</button>
              {editingAppointmentId ? (
                <button type="button" onClick={cancelEdit}>Cancelar edicion</button>
              ) : null}
            </div>
          </form>
        </section>

        <section className="card admin-edit-card admin-board-card">
          <span className="admin-board-kicker">Paso 4</span>
          <h3>Ultimos horarios ocupados</h3>
          <p className="admin-board-note">Usa Mover para cambiar dia, hora o modulo. Usa Liberar para dejarlo disponible.</p>
          <div className="admin-occupancy-list">
            {visibleOccupancies.map((item) => (
              <article key={item.id} className="admin-occupancy-row">
                <div>
                  <strong>{item.patientName}</strong>
                  <span>{item.professionalName} - {toTime(item.startsAt)}</span>
                </div>
                <div className="admin-row-actions">
                  <button type="button" onClick={() => editOccupancy(item)}>Mover</button>
                  <button type="button" onClick={() => cancelOccupancy(item.id)}>Liberar</button>
                </div>
              </article>
            ))}
            {visibleOccupancies.length === 0 ? (
              <p className="muted">Todavia no hay horarios ocupados.</p>
            ) : null}
          </div>
        </section>
      </div>
      {message ? <p className="status-text">{message}</p> : null}
    </div>
  );
}
