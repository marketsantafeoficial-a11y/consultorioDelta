import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ProfesionalesPage() {
  const professionals = await prisma.professional.findMany({
    include: {
      consultory: true,
    },
    orderBy: { fullName: "asc" },
  });

  return (
    <main className="page-wrap">
      <section className="section-stack">
        <div className="section-head">
          <h1>Consultorios disponibles</h1>
          <p>Elegi un espacio para ver disponibilidad y reservar un modulo.</p>
        </div>
        <div className="cards-grid professionals-grid">
          {professionals.map((professional) => (
            <article className="card professional-card" key={professional.id}>
              <h3>{professional.fullName}</h3>
              <p>{professional.specialty}</p>
              <p>{professional.bio}</p>
              <div className="meta-row">
                <span>{professional.consultory.name}</span>
                <span>{professional.serves ?? "Adultos y adolescentes"}</span>
              </div>
              <Link href={`/profesionales/${professional.id}`} className="link-button">
                Ver disponibilidad
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
