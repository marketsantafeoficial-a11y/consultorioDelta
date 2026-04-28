"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@delta.local");
  const [password, setPassword] = useState("admin1234");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const payload = await response.json();

    if (!response.ok) {
      setError(payload.error ?? "No se pudo iniciar sesion.");
      setLoading(false);
      return;
    }

    router.push(payload.redirectTo);
    router.refresh();
  }

  return (
    <div className="login-container" style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      padding: '2rem'
    }}>
      <form onSubmit={onSubmit} style={{
        background: 'white',
        padding: '3rem 2.5rem',
        borderRadius: '16px',
        boxShadow: '0 10px 25px rgba(2, 132, 199, 0.1)',
        width: '100%',
        maxWidth: '420px',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <h1 style={{ 
            fontSize: '1.75rem', 
            fontWeight: '800', 
            color: 'var(--color-primary)', 
            marginBottom: '0.5rem',
            textTransform: 'uppercase'
          }}>
            Iniciar Sesión
          </h1>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.95rem' }}>
            Acceso para pacientes y profesionales
          </p>
          <p style={{ color: 'var(--color-primary)', fontSize: '0.85rem', fontWeight: 700, marginTop: '0.5rem' }}>
            Admin demo: admin@delta.local / admin1234
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="email" style={{ fontSize: '0.9rem', fontWeight: '600' }}>Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            style={{
              padding: '0.75rem',
              borderRadius: '8px',
              border: '1px solid var(--color-border)',
              outline: 'none'
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="password" style={{ fontSize: '0.9rem', fontWeight: '600' }}>Contraseña</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            style={{
              padding: '0.75rem',
              borderRadius: '8px',
              border: '1px solid var(--color-border)',
              outline: 'none'
            }}
          />
        </div>

        {error ? (
          <p style={{ 
            color: 'var(--color-destructive, #DC2626)', 
            fontSize: '0.875rem', 
            textAlign: 'center',
            backgroundColor: '#FEF2F2',
            padding: '0.5rem',
            borderRadius: '6px'
          }}>
            {error}
          </p>
        ) : null}

        <button 
          type="submit" 
          disabled={loading}
          style={{
            marginTop: '1rem',
            padding: '0.875rem',
            backgroundColor: 'var(--color-primary)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '700',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            transition: 'opacity 0.2s'
          }}
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </div>
  );
}
