import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { isSpaceResource } from "@/lib/resource-kind";

export const dynamic = "force-dynamic";

export default async function ProfesionalesPage() {
  const professionals = await prisma.professional.findMany({
    include: {
      consultory: true,
    },
    orderBy: { fullName: "asc" },
  });
  const spaces = professionals.filter(isSpaceResource);
  const agendaProfessionals = professionals.filter((item) => !isSpaceResource(item));

  return (
    <main className="page-wrap">
      <Link href="/" className="header-home-link">Volver al inicio</Link>
      <section className="section-stack">
        <div className="section-head">
          <h1>Agendas Delta</h1>
          <p>Consulta modulos de alquiler o pedi turno con un profesional.</p>
        </div>
        <h2>Alquiler de modulos</h2>
        <div className="cards-grid professionals-grid">
          {spaces.map((professional) => (
            <article className="card professional-card" key={professional.id}>
              <h3>{professional.fullName}</h3>
              <p>{professional.specialty}</p>
              <p>{professional.bio}</p>
              <div className="meta-row">
                <span>{professional.consultory.name}</span>
                <span>{professional.serves ?? "Adultos y adolescentes"}</span>
              </div>
              <Link href={`/profesionales/${professional.id}`} className="link-button">
                Consultar modulo
              </Link>
            </article>
          ))}
        </div>

        <h2>Turnos profesionales</h2>
        <div className="cards-grid professionals-grid">
          {agendaProfessionals.map((professional) => (
            <article className="card professional-card" key={professional.id}>
              <h3>{professional.fullName}</h3>
              <p>{professional.specialty}</p>
              <p>{professional.bio}</p>
              <div className="meta-row">
                <span>{professional.consultory.name}</span>
                <span>{professional.serves ?? "Adultos y adolescentes"}</span>
              </div>
              <Link href={`/profesionales/${professional.id}`} className="link-button">
                Pedir turno
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
