"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type ConsultoryOption = {
  id: number;
  name: string;
  city: string;
};

type AdminProfessionalFormProps = {
  consultories: ConsultoryOption[];
};

const initialState = {
  fullName: "",
  specialty: "Psicologa",
  bio: "",
  serves: "",
  photoUrl: "",
  email: "",
  consultoryId: "",
};

export function AdminProfessionalForm({ consultories }: AdminProfessionalFormProps) {
  const router = useRouter();
  const [form, setForm] = useState({
    ...initialState,
    consultoryId: String(consultories[0]?.id ?? ""),
  });
  const [feedback, setFeedback] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setFeedback(null);

    const response = await fetch("/api/professionals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        consultoryId: Number(form.consultoryId),
      }),
    });

    const payload = await response.json();
    setSaving(false);

    if (!response.ok) {
      setFeedback(payload.error ?? "No se pudo cargar el profesional.");
      return;
    }

    setForm({ ...initialState, consultoryId: String(consultories[0]?.id ?? "") });
    setFeedback("Profesional cargado. Ya aparece en Nuestro equipo.");
    router.refresh();
  }

  return (
    <form className="admin-professional-form" onSubmit={onSubmit}>
      <div className="form-two-cols">
        <label>
          Nombre y apellido *
          <input
            value={form.fullName}
            onChange={(event) => updateField("fullName", event.target.value)}
            placeholder="Lic. Nombre Apellido"
            required
          />
        </label>
        <label>
          Especialidad *
          <input
            value={form.specialty}
            onChange={(event) => updateField("specialty", event.target.value)}
            placeholder="Psicologa, Psicologo, Psiquiatra..."
            required
          />
        </label>
      </div>

      <label>
        Descripcion / bio *
        <textarea
          value={form.bio}
          onChange={(event) => updateField("bio", event.target.value)}
          placeholder="Breve presentacion para mostrar en el popup del equipo."
          rows={3}
          required
        />
      </label>

      <label>
        Areas de atencion
        <input
          value={form.serves}
          onChange={(event) => updateField("serves", event.target.value)}
          placeholder="Ansiedad, adultos, adolescentes, pareja..."
        />
      </label>

      <div className="form-two-cols">
        <label>
          Foto URL
          <input
            value={form.photoUrl}
            onChange={(event) => updateField("photoUrl", event.target.value)}
            placeholder="https://..."
          />
        </label>
        <label>
          Email interno
          <input
            type="email"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            placeholder="opcional"
          />
        </label>
      </div>

      <label>
        Sede *
        <select
          value={form.consultoryId}
          onChange={(event) => updateField("consultoryId", event.target.value)}
          required
        >
          {consultories.map((consultory) => (
            <option key={consultory.id} value={consultory.id}>
              {consultory.name} - {consultory.city}
            </option>
          ))}
        </select>
      </label>

      <button type="submit" disabled={saving}>
        {saving ? "Cargando..." : "Cargar profesional"}
      </button>
      {feedback ? <p className="status-text" aria-live="polite">{feedback}</p> : null}
    </form>
  );
}
