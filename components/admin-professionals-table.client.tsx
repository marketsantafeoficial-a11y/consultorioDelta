"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { prepareProfessionalPhoto } from "@/lib/client-image";

type ConsultoryOption = {
  id: number;
  name: string;
  city: string;
};

export type AdminProfessionalRow = {
  id: number;
  fullName: string;
  email: string;
  specialty: string;
  serves: string | null;
  whatsapp: string | null;
  photoUrl: string | null;
  consultoryId: number;
  consultoryName: string;
  modalidadAtencion: string | null;
  atencionCobertura: string | null;
  poblacion: string | null;
  orientacionTeorica: string | null;
  prestaciones: string | null;
  areasExperiencia: string | null;
  presentacionProfesional: string | null;
};

const MODALIDADES = ["Presencial", "Virtual", "Presencial y virtual"];

type EditForm = {
  fullName: string;
  specialty: string;
  modalidadAtencion: string;
  atencionCobertura: string;
  poblacion: string;
  orientacionTeorica: string;
  prestaciones: string;
  areasExperiencia: string;
  presentacionProfesional: string;
  whatsapp: string;
  photoUrl: string;
  consultoryId: string;
};

function toEditForm(row: AdminProfessionalRow): EditForm {
  return {
    fullName: row.fullName,
    specialty: row.specialty,
    modalidadAtencion: row.modalidadAtencion ?? "",
    atencionCobertura: row.atencionCobertura ?? "",
    poblacion: row.poblacion ?? "",
    orientacionTeorica: row.orientacionTeorica ?? "",
    prestaciones: row.prestaciones ?? "",
    areasExperiencia: row.areasExperiencia ?? "",
    presentacionProfesional: row.presentacionProfesional ?? "",
    whatsapp: row.whatsapp ?? "",
    photoUrl: row.photoUrl ?? "",
    consultoryId: String(row.consultoryId),
  };
}

export function AdminProfessionalsTable({
  professionals,
  consultories,
}: {
  professionals: AdminProfessionalRow[];
  consultories: ConsultoryOption[];
}) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [editing, setEditing] = useState<AdminProfessionalRow | null>(null);
  const [editForm, setEditForm] = useState<EditForm | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  function startEdit(row: AdminProfessionalRow) {
    setEditing(row);
    setEditForm(toEditForm(row));
    setPreviewUrl(row.photoUrl ?? null);
    setError(null);
  }

  function cancelEdit() {
    setEditing(null);
    setEditForm(null);
    setPreviewUrl(null);
    setError(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  function updateEditField(field: keyof EditForm, value: string) {
    setEditForm((current) => (current ? { ...current, [field]: value } : current));
  }

  async function handleEditFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const preparedFile = await prepareProfessionalPhoto(file);
      const localPreview = URL.createObjectURL(preparedFile);
      setPreviewUrl(localPreview);

      const body = new FormData();
      body.append("file", preparedFile);

      const res = await fetch("/api/upload", { method: "POST", body });
      const payload = await res.json();

      if (!res.ok) {
        setError(payload.error ?? "No se pudo subir la imagen.");
        return;
      }

      updateEditField("photoUrl", payload.url);
      setPreviewUrl(payload.url);
      URL.revokeObjectURL(localPreview);
    } catch (error) {
      setError(error instanceof Error ? error.message : "No se pudo preparar la imagen.");
    } finally {
      setUploading(false);
    }
  }

  function handleEditPreviewRemove() {
    updateEditField("photoUrl", "");
    setPreviewUrl(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function saveEdit(id: number) {
    if (!editForm) return;
    setBusyId(id);
    setError(null);

    const response = await fetch(`/api/professionals/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...editForm,
        consultoryId: Number(editForm.consultoryId),
      }),
    });

    const payload = await response.json();
    setBusyId(null);

    if (!response.ok) {
      setError(payload.error ?? "No se pudo guardar el cambio.");
      return;
    }

    setEditing(null);
    setEditForm(null);
    setPreviewUrl(null);
    if (fileRef.current) fileRef.current.value = "";
    router.refresh();
  }

  async function removeProfessional(row: AdminProfessionalRow) {
    const confirmed = window.confirm(`Eliminar a "${row.fullName}"? Esta accion no se puede deshacer.`);
    if (!confirmed) return;

    setBusyId(row.id);
    setError(null);

    const response = await fetch(`/api/professionals/${row.id}`, { method: "DELETE" });
    const payload = await response.json().catch(() => ({}));
    setBusyId(null);

    if (!response.ok) {
      setError(payload.error ?? "No se pudo eliminar el profesional.");
      return;
    }

    router.refresh();
  }

  const displayPreview = previewUrl || editForm?.photoUrl;

  return (
    <div style={{ overflowX: "auto" }}>
      {error ? <p className="admin-feedback">{error}</p> : null}
      <table>
        <thead>
          <tr>
            <th>Profesional</th>
            <th>Especialidad</th>
            <th>WhatsApp</th>
            <th>Sede</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {professionals.map((row) => {
            const isBusy = busyId === row.id;

            return (
              <tr key={row.id}>
                <td>
                  <strong style={{ display: "block" }}>{row.fullName}</strong>
                </td>
                <td style={{ whiteSpace: "pre-wrap" }}>{row.specialty}</td>
                <td>{row.whatsapp ?? "General"}</td>
                <td>{row.consultoryName}</td>
                <td style={{ whiteSpace: "nowrap" }}>
                  <button type="button" disabled={isBusy} onClick={() => startEdit(row)}>
                    Editar
                  </button>{" "}
                  <button type="button" disabled={isBusy} onClick={() => removeProfessional(row)}>
                    {isBusy ? "..." : "Eliminar"}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {editing && editForm ? (
        <div className="team-modal-backdrop" role="presentation" onClick={cancelEdit}>
          <section
            className="team-modal admin-edit-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="team-modal-close"
              onClick={cancelEdit}
              aria-label="Cerrar edición"
            >
              x
            </button>
            <h2 id="edit-modal-title">Editar: {editing.fullName}</h2>
            {error ? <p className="admin-feedback">{error}</p> : null}

            <div className="admin-edit-form-content">
              <div className="admin-form-section">
                <h3>Información básica</h3>
                <div className="admin-form-two-cols">
                  <label>
                    <span>Nombre completo *</span>
                    <input
                      value={editForm.fullName}
                      onChange={(e) => updateEditField("fullName", e.target.value)}
                      required
                    />
                  </label>
                  <label>
                    <span>Especialidad *</span>
                    <textarea
                      value={editForm.specialty}
                      onChange={(e) => updateEditField("specialty", e.target.value)}
                      rows={3}
                      required
                    />
                  </label>
                </div>
                <div className="admin-form-two-cols">
                  <label>
                    <span>Sede</span>
                    <select
                      value={editForm.consultoryId}
                      onChange={(e) => updateEditField("consultoryId", e.target.value)}
                    >
                      {consultories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name} - {c.city}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span>Modalidad de atención</span>
                    <select
                      value={editForm.modalidadAtencion}
                      onChange={(e) => updateEditField("modalidadAtencion", e.target.value)}
                    >
                      <option value="">Seleccionar...</option>
                      {MODALIDADES.map((mod) => (
                        <option key={mod} value={mod}>{mod}</option>
                      ))}
                    </select>
                  </label>
                </div>
                <label>
                  <span>Foto</span>
                  <div className="admin-photo-upload">
                    {displayPreview ? (
                      <div className="admin-photo-preview">
                        <img src={displayPreview} alt="Vista previa" />
                        <button type="button" className="admin-photo-remove" onClick={handleEditPreviewRemove}>
                          Quitar
                        </button>
                      </div>
                    ) : (
                      <div className="admin-photo-placeholder">Sin foto</div>
                    )}
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleEditFileChange}
                    />
                    {uploading ? <span className="admin-uploading">Subiendo imagen...</span> : null}
                  </div>
                </label>
              </div>

              <div className="admin-form-section">
                <h3>Atención profesional</h3>
                <label>
                  <span>Atención / Obras sociales / Reintegro / Particular</span>
                  <textarea
                    value={editForm.atencionCobertura}
                    onChange={(e) => updateEditField("atencionCobertura", e.target.value)}
                    rows={3}
                  />
                </label>
                <div className="admin-form-two-cols">
                  <label>
                    <span>Población</span>
                    <textarea
                      value={editForm.poblacion}
                      onChange={(e) => updateEditField("poblacion", e.target.value)}
                      rows={3}
                    />
                  </label>
                  <label>
                    <span>Orientación teórica</span>
                    <textarea
                      value={editForm.orientacionTeorica}
                      onChange={(e) => updateEditField("orientacionTeorica", e.target.value)}
                      rows={3}
                    />
                  </label>
                </div>
              </div>

              <div className="admin-form-section">
                <h3>Experiencia y servicios</h3>
                <div className="admin-form-two-cols">
                  <label>
                    <span>Prestaciones</span>
                    <textarea
                      value={editForm.prestaciones}
                      onChange={(e) => updateEditField("prestaciones", e.target.value)}
                      rows={5}
                    />
                  </label>
                  <label>
                    <span>Áreas de experiencia</span>
                    <textarea
                      value={editForm.areasExperiencia}
                      onChange={(e) => updateEditField("areasExperiencia", e.target.value)}
                      rows={5}
                    />
                  </label>
                </div>
              </div>

              <div className="admin-form-section">
                <h3>Presentación y contacto</h3>
                <label>
                  <span>Presentación profesional</span>
                  <textarea
                    value={editForm.presentacionProfesional}
                    onChange={(e) => updateEditField("presentacionProfesional", e.target.value)}
                    rows={4}
                  />
                </label>
                <label>
                  <span>WhatsApp *</span>
                  <input
                    type="tel"
                    value={editForm.whatsapp}
                    onChange={(e) => updateEditField("whatsapp", e.target.value)}
                    required
                  />
                </label>
              </div>
            </div>

            <div className="admin-edit-modal-actions">
              <button type="button" disabled={busyId !== null || uploading} onClick={() => saveEdit(editing.id)}>
                {busyId !== null ? "Guardando..." : "Guardar cambios"}
              </button>
              <button type="button" className="ghost-button" disabled={busyId !== null} onClick={cancelEdit}>
                Cancelar
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
