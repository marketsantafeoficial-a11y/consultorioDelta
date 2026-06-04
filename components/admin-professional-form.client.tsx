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
  specialty: "",
  bio: "",
  serves: "",
  photoUrl: "",
  whatsapp: "",
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
    setFeedback("✓ Profesional cargado correctamente.");
    router.refresh();
  }

  return (
    <form className="admin-simple-form" onSubmit={onSubmit}>
      <div className="admin-form-section">
        <h3>Datos básicos</h3>
        <label>
          <span>Nombre completo *</span>
          <input
            value={form.fullName}
            onChange={(event) => updateField("fullName", event.target.value)}
            placeholder="Ej: Lic. María González"
            required
          />
        </label>
        <label>
          <span>Especialidad *</span>
          <input
            value={form.specialty}
            onChange={(event) => updateField("specialty", event.target.value)}
            placeholder="Ej: Psicóloga, Nutricionista..."
            required
          />
        </label>
        <label>
          <span>Sede *</span>
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
      </div>

      <div className="admin-form-section">
        <h3>Presentación</h3>
        <label>
          <span>Biografía / Descripción *</span>
          <textarea
            value={form.bio}
            onChange={(event) => updateField("bio", event.target.value)}
            placeholder="Breve presentación para mostrar en el perfil público..."
            rows={4}
            required
          />
        </label>
        <label>
          <span>Áreas de atención</span>
          <input
            value={form.serves}
            onChange={(event) => updateField("serves", event.target.value)}
            placeholder="Ej: Ansiedad, adolescentes, terapia de pareja..."
          />
        </label>
      </div>

      <div className="admin-form-section">
        <h3>Contacto</h3>
        <label>
          <span>WhatsApp directo</span>
          <input
            type="tel"
            value={form.whatsapp}
            onChange={(event) => updateField("whatsapp", event.target.value)}
            placeholder="Ej: 5492214778280"
          />
        </label>
        <label>
          <span>Email interno</span>
          <input
            type="email"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            placeholder="opcional@ejemplo.com"
          />
        </label>
        <label>
          <span>Foto (URL)</span>
          <input
            value={form.photoUrl}
            onChange={(event) => updateField("photoUrl", event.target.value)}
            placeholder="https://..."
          />
        </label>
      </div>

      <button type="submit" disabled={saving} className="admin-submit-btn">
        {saving ? "Cargando..." : "Cargar profesional"}
      </button>
      {feedback && <p className="admin-feedback">{feedback}</p>}
    </form>
  );
}
