import { LogoutButton } from "@/components/logout-button";
import { requireRole } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { isSpaceResource } from "@/lib/resource-kind";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  await requireRole("ADMIN");

  const [sedes, recursos, reservas] = await Promise.all([
    prisma.consultory.findMany({ orderBy: { name: "asc" } }),
    prisma.professional.findMany({
      include: { consultory: true },
      orderBy: { fullName: "asc" },
    }),
    prisma.appointment.findMany({
      orderBy: { startsAt: "desc" },
      take: 10,
    }),
  ]);

  const profesionalesEquipo = recursos.filter((item) => !isSpaceResource(item));
  const consultorios = recursos.filter(isSpaceResource);
  const reservasPendientes = reservas.filter((item) => item.status === "PENDING").length;

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <div className="admin-header-left">
          <img src="/delta-logo.svg" alt="Delta" className="brand-logo small" />
          <div>
            <p className="admin-header-kicker">ADMINISTRACIÓN</p>
            <h1 className="admin-header-title">Panel de control</h1>
          </div>
        </div>
        <div className="admin-header-actions">
          <Link href="/" className="admin-header-link">Ver sitio</Link>
          <LogoutButton />
        </div>
      </header>

      <main className="admin-main">
        <section className="admin-stats-row">
          <article className="admin-stat-card">
            <strong>{profesionalesEquipo.length}</strong>
            <span>Profesionales</span>
          </article>
          <article className="admin-stat-card">
            <strong>{consultorios.length}</strong>
            <span>Consultorios</span>
          </article>
          <article className="admin-stat-card">
            <strong>{reservasPendientes}</strong>
            <span>Turnos pendientes</span>
          </article>
          <article className="admin-stat-card">
            <strong>{sedes.length}</strong>
            <span>Sedes</span>
          </article>
        </section>

        <section className="admin-actions-grid">
          <Link href="/admin/profesionales" className="admin-action-card">
            <div className="admin-action-icon">👤</div>
            <div className="admin-action-copy">
              <strong>Profesionales</strong>
              <p>Cargar, editar o eliminar perfiles del equipo.</p>
            </div>
            <span className="admin-action-arrow">→</span>
          </Link>

          <Link href="/admin/modulos" className="admin-action-card">
            <div className="admin-action-icon">🏢</div>
            <div className="admin-action-copy">
              <strong>Consultorios y horarios</strong>
              <p>Administrar disponibilidad y ocupaciones.</p>
            </div>
            <span className="admin-action-arrow">→</span>
          </Link>

          <Link href="/admin/reservas" className="admin-action-card">
            <div className="admin-action-icon">📋</div>
            <div className="admin-action-copy">
              <strong>Reservas</strong>
              <p>Ver todas las reservas y solicitudes.</p>
            </div>
            <span className="admin-action-arrow">→</span>
          </Link>
        </section>

        <section className="admin-recent-card">
          <h2>Últimas reservas</h2>
          {reservas.length === 0 ? (
            <p className="admin-empty">No hay reservas todavía.</p>
          ) : (
            <div className="admin-recent-list">
              {reservas.slice(0, 5).map((item) => (
                <div key={item.id} className="admin-recent-row">
                  <div>
                    <strong>{item.patientName}</strong>
                    <span>{item.reason}</span>
                  </div>
                  <span className={`admin-status admin-status-${item.status.toLowerCase()}`}>
                    {item.status === "PENDING" ? "Pendiente" : item.status === "CONFIRMED" ? "Confirmada" : item.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
