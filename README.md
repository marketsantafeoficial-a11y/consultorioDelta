# Consultorios Multi-Sede

Aplicacion simple en Next.js para administrar varios consultorios, su equipo profesional y turnos proximos.

## Stack

- Next.js (App Router) + React + TypeScript
- Prisma ORM
- SQLite local

## Primer inicio

```bash
npm install
npm run db:migrate -- --name init
npm run db:seed
npm run dev
```

Abre `http://localhost:3000`.

## Scripts utiles

```bash
npm run dev        # entorno de desarrollo
npm run build      # build de produccion
npm run lint       # chequeo ESLint
npm run db:migrate # crear/aplicar migraciones
npm run db:seed    # cargar datos demo
```

## Datos incluidos en seed

- 2 consultorios
- 2 profesionales con disponibilidad semanal
- turnos de ejemplo para visualizar el tablero

## Rutas MVP implementadas

- `/profesionales` listado publico de profesionales
- `/profesionales/[id]` disponibilidad y reserva de turnos
- `/auth/login` login para admin y profesionales
- `/dashboard` tablero admin (protegido)
- `/professional` tablero profesional (protegido)

## Credenciales demo

- Admin:
	- email: `admin@consultorios.local`
	- password: `demo1234`
- Profesional 1:
	- email: `agustina.ferraro@centrovida.ar`
	- password: `demo1234`
- Profesional 2:
	- email: `tomas.ibarra@puertosalud.ar`
	- password: `demo1234`
