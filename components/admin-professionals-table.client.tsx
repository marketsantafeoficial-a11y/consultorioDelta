"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

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
  consultoryId: number;
  consultoryName: string;
};

type EditState = {
  fullName: string;
  specialty: string;
  serves: string;
  whatsapp: string;
  consultoryId: string;
};

function toEditState(row: AdminProfessionalRow): EditState {
  return {
    fullName: row.fullName,
    specialty: row.specialty,
    serves: row.serves ?? "",
    whatsapp: row.whatsapp ?? "",
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
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<EditState | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  function startEdit(row: AdminProfessionalRow) {
    setEditingId(row.id);
    setEditForm(toEditState(row));
    setError(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditForm(null);
    setError(null);
  }

  function updateEditField(field: keyof EditState, value: string) {
    setEditForm((current) => (current ? { ...current, [field]: value } : current));
  }

  async function saveEdit(id: number) {
    if (!editForm) return;
    setBusyId(id);
    setError(null);

    const response = await fetch(`/api/professionals/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: editForm.fullName,
        specialty: editForm.specialty,
        serves: editForm.serves,
        whatsapp: editForm.whatsapp,
        consultoryId: Number(editForm.consultoryId),
      }),
    });

    const payload = await response.json();
    setBusyId(null);

    if (!response.ok) {
      setError(payload.error ?? "No se pudo guardar el cambio.");
      return;
    }

    setEditingId(null);
    setEditForm(null);
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

  return (
    <div style={{ overflowX: "auto" }}>
      {error ? <p className="admin-feedback">{error}</p> : null}
      <table>
        <thead>
          <tr>
            <th>Profesional</th>
            <th>Especialidad</th>
            <th>Areas</th>
            <th>WhatsApp</th>
            <th>Sede</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {professionals.map((row) => {
            const isEditing = editingId === row.id;
            const isBusy = busyId === row.id;

            if (isEditing && editForm) {
              return (
                <tr key={row.id}>
                  <td>
                    <input
                      value={editForm.fullName}
                      onChange={(event) => updateEditField("fullName", event.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      value={editForm.specialty}
                      onChange={(event) => updateEditField("specialty", event.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      value={editForm.serves}
                      onChange={(event) => updateEditField("serves", event.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      value={editForm.whatsapp}
                      onChange={(event) => updateEditField("whatsapp", event.target.value)}
                    />
                  </td>
                  <td>
                    <select
                      value={editForm.consultoryId}
                      onChange={(event) => updateEditField("consultoryId", event.target.value)}
                    >
                      {consultories.map((consultory) => (
                        <option key={consultory.id} value={consultory.id}>
                          {consultory.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    <button type="button" disabled={isBusy} onClick={() => saveEdit(row.id)}>
                      {isBusy ? "Guardando..." : "Guardar"}
                    </button>{" "}
                    <button type="button" disabled={isBusy} onClick={cancelEdit}>
                      Cancelar
                    </button>
                  </td>
                </tr>
              );
            }

            return (
              <tr key={row.id}>
                <td>
                  <strong style={{ display: "block" }}>{row.fullName}</strong>
                  <span style={{ color: "var(--color-muted)", fontSize: "0.8rem" }}>{row.email}</span>
                </td>
                <td>{row.specialty}</td>
                <td>{row.serves ?? "Sin cargar"}</td>
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
    </div>
  );
}
