import Link from "next/link";
import { LogoutButton } from "@/components/logout-button";

type AdminPageShellProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

export function AdminPageShell({ title, description, children }: AdminPageShellProps) {
  return (
    <div style={{ background: "var(--color-background)", minHeight: "100vh" }}>
      <header
        style={{
          alignItems: "center",
          background: "white",
          borderBottom: "1px solid var(--color-border)",
          display: "flex",
          justifyContent: "space-between",
          padding: "1rem 2rem",
        }}
      >
        <div style={{ alignItems: "center", display: "flex", gap: "0.75rem" }}>
          <img src="/delta-logo.svg" alt="Delta Consultorios City Bell" className="brand-logo small" />
          <div>
            <p style={{ color: "var(--color-muted)", fontSize: "0.8rem", fontWeight: 700, margin: 0 }}>
              ADMINISTRACION
            </p>
            <h1 style={{ color: "var(--color-primary)", fontSize: "1.25rem", margin: 0 }}>
              {title}
            </h1>
            {description ? <span className="admin-phone">{description}</span> : null}
          </div>
        </div>
        <div className="header-actions">
          <Link href="/dashboard" className="header-home-link">Panel</Link>
          <Link href="/admin/modulos" className="header-home-link">Modulos</Link>
          <Link href="/admin/profesionales" className="header-home-link">Profesionales</Link>
          <Link href="/admin/reservas" className="header-home-link">Reservas</Link>
          <Link href="/" className="header-home-link">Inicio</Link>
          <LogoutButton />
        </div>
      </header>
      <main className="admin-main-shell">
        {children}
      </main>
    </div>
  );
}
