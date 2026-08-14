"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { prepareProfessionalPhoto } from "@/lib/client-image";

type ConsultoryOption = {
  id: number;
  name: string;
  city: string;
};

type AdminProfessionalFormProps = {
  consultories: ConsultoryOption[];
};

const MODALIDADES = ["Presencial", "Virtual", "Presencial y virtual"];

const initialState = {
  fullName: "",
  specialty: "",
  modalidadAtencion: "",
  atencionCobertura: "",
  poblacion: "",
  orientacionTeorica: "",
  prestaciones: "",
  areasExperiencia: "",
  presentacionProfesional: "",
  whatsapp: "",
  photoUrl: "",
  consultoryId: "",
};

export function AdminProfessionalForm({ consultories }: AdminProfessionalFormProps) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    ...initialState,
    consultoryId: String(consultories[0]?.id ?? ""),
  });
  const [feedback, setFeedback] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setFeedback(null);

    try {
      const preparedFile = await prepareProfessionalPhoto(file);
      const localPreview = URL.createObjectURL(preparedFile);
      setPreviewUrl(localPreview);

      const body = new FormData();
      body.append("file", preparedFile);

      const res = await fetch("/api/upload", { method: "POST", body });
      const payload = await res.json();

      if (!res.ok) {
        setFeedback(payload.error ?? "No se pudo subir la imagen.");
        return;
      }

      updateField("photoUrl", payload.url);
      setPreviewUrl(payload.url);
      URL.revokeObjectURL(localPreview);
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "No se pudo preparar la imagen.");
    } finally {
      setUploading(false);
    }
  }

  function handlePreviewRemove() {
    updateField("photoUrl", "");
    setPreviewUrl(null);
    if (fileRef.current) fileRef.current.value = "";
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
    setPreviewUrl(null);
    if (fileRef.current) fileRef.current.value = "";
    setFeedback("Profesional cargado correctamente.");
    router.refresh();
  }

  const displayPreview = previewUrl || form.photoUrl;

  return (
    <form className="admin-professional-form" onSubmit={onSubmit}>
      <div className="admin-form-section">
        <h3>Información básica</h3>
        <div className="admin-form-two-cols">
          <label>
            <span>Nombre completo *</span>
            <input
              value={form.fullName}
              onChange={(event) => updateField("fullName", event.target.value)}
              placeholder="Ej: Lic. María Pérez"
              required
            />
          </label>
          <label>
            <span>Especialidad *</span>
            <textarea
              value={form.specialty}
              onChange={(event) => updateField("specialty", event.target.value)}
              placeholder="Ej: Psicología&#10;Psicología clínica&#10;Especialista en adolescentes"
              rows={3}
              required
            />
          </label>
        </div>
        <div className="admin-form-two-cols">
          <label>
            <span>Sede</span>
            <select
              value={form.consultoryId}
              onChange={(event) => updateField("consultoryId", event.target.value)}
            >
              {consultories.map((consultory) => (
                <option key={consultory.id} value={consultory.id}>
                  {consultory.name} - {consultory.city}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Modalidad de atención</span>
            <select
              value={form.modalidadAtencion}
              onChange={(event) => updateField("modalidadAtencion", event.target.value)}
            >
              <option value="">Seleccionar...</option>
              {MODALIDADES.map((mod) => (
                <option key={mod} value={mod}>{mod}</option>
              ))}
            </select>
          </label>
        </div>
        <label>
          <span>Foto del profesional</span>
          <div className="admin-photo-upload">
            {displayPreview ? (
              <div className="admin-photo-preview">
                <img src={displayPreview} alt="Vista previa" />
                <button type="button" className="admin-photo-remove" onClick={handlePreviewRemove}>
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
              onChange={handleFileChange}
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
            value={form.atencionCobertura}
            onChange={(event) => updateField("atencionCobertura", event.target.value)}
            placeholder="Ej: Obras sociales&#10;Reintegro&#10;Particular"
            rows={3}
          />
        </label>
        <div className="admin-form-two-cols">
          <label>
            <span>Población con la que trabaja</span>
            <textarea
              value={form.poblacion}
              onChange={(event) => updateField("poblacion", event.target.value)}
              placeholder="Ej: Niños&#10;Adolescentes&#10;Adultos&#10;Familias"
              rows={3}
            />
          </label>
          <label>
            <span>Orientación teórica</span>
            <textarea
              value={form.orientacionTeorica}
              onChange={(event) => updateField("orientacionTeorica", event.target.value)}
              placeholder="Orientación teórica del profesional"
              rows={3}
            />
          </label>
        </div>
      </div>

      <div className="admin-form-section">
        <h3>Experiencia y servicios</h3>
        <div className="admin-form-two-cols">
          <label>
            <span>Prestaciones que brinda</span>
            <textarea
              value={form.prestaciones}
              onChange={(event) => updateField("prestaciones", event.target.value)}
              placeholder="Ej: Evaluación psicológica&#10;Psicoterapia individual&#10;Orientación a padres&#10;Evaluaciones&#10;Tratamientos&#10;Seguimiento"
              rows={6}
            />
          </label>
          <label>
            <span>Áreas de experiencia y problemáticas que aborda</span>
            <textarea
              value={form.areasExperiencia}
              onChange={(event) => updateField("areasExperiencia", event.target.value)}
              placeholder="Ej: Ansiedad&#10;Depresion&#10;Trastornos de conducta&#10;Dificultades escolares&#10;Problemas vinculares&#10;Duelo"
              rows={6}
            />
          </label>
        </div>
      </div>

      <div className="admin-form-section">
        <h3>Presentación y contacto</h3>
        <label>
          <span>Presentación profesional</span>
          <textarea
            value={form.presentacionProfesional}
            onChange={(event) => updateField("presentacionProfesional", event.target.value)}
            placeholder="Soy Licenciada en Psicología con experiencia en atención de adolescentes y adultos..."
            rows={5}
          />
        </label>
        <label>
          <span>WhatsApp *</span>
          <input
            type="tel"
            value={form.whatsapp}
            onChange={(event) => updateField("whatsapp", event.target.value)}
            placeholder="Ej: 5492214778280"
            required
          />
        </label>
      </div>

      <button type="submit" disabled={saving || uploading} className="admin-submit-btn">
        {saving ? "Cargando..." : uploading ? "Espera que termine la subida..." : "Cargar profesional"}
      </button>
      {feedback ? (
        <p className={`admin-feedback ${feedback.startsWith("Profesional") ? "admin-feedback-ok" : ""}`}>
          {feedback}
        </p>
      ) : null}
    </form>
  );
}
