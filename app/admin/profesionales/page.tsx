import { AdminProfessionalForm } from "@/components/admin-professional-form.client";
import { AdminProfessionalsTable } from "@/components/admin-professionals-table.client";
import { AdminPageShell } from "@/components/admin-page-shell";
import { prisma } from "@/lib/prisma";
import { isSpaceResource } from "@/lib/resource-kind";
import { requireRole } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function AdminProfesionalesPage() {
  await requireRole("ADMIN");

  const [sedes, recursos] = await Promise.all([
    prisma.consultory.findMany({ orderBy: { name: "asc" } }),
    prisma.professional.findMany({
      include: { consultory: true },
      orderBy: { fullName: "asc" },
    }),
  ]);

  const profesionalesEquipo = recursos.filter((item) => !isSpaceResource(item));

  return (
    <AdminPageShell
      title="Profesionales"
      description="Cargar y revisar perfiles publicos del equipo."
    >
      <section className="admin-split-grid">
        <article className="admin-panel-card card">
          <div className="admin-panel-head">
            <span>Alta de perfil</span>
            <h2>Cargar profesional</h2>
            <p>Estos perfiles aparecen en la pagina publica Nuestro equipo.</p>
          </div>
          <AdminProfessionalForm
            consultories={sedes.map((sede) => ({
              id: sede.id,
              name: sede.name,
              city: sede.city,
            }))}
          />
        </article>

        <article className="admin-panel-card card">
          <div className="admin-panel-head">
            <span>Listado publico</span>
            <h2>Profesionales cargados</h2>
            <p>Resumen de perfiles visibles para visitantes.</p>
          </div>
          <AdminProfessionalsTable
            professionals={profesionalesEquipo.map((item) => ({
              id: item.id,
              fullName: item.fullName,
              email: item.email,
              specialty: item.specialty,
              serves: item.serves,
              whatsapp: item.whatsapp,
              consultoryId: item.consultoryId,
              consultoryName: item.consultory.name,
            }))}
            consultories={sedes.map((sede) => ({
              id: sede.id,
              name: sede.name,
              city: sede.city,
            }))}
          />
        </article>
      </section>
    </AdminPageShell>
  );
}
