import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { BookingForm } from "@/components/booking-form";
import { isSpaceResource } from "@/lib/resource-kind";

export const dynamic = "force-dynamic";

type Params = {
  params: Promise<{ id: string }>;
};

export default async function ProfesionalDetallePage({ params }: Params) {
  const { id } = await params;
  const professionalId = Number(id);

  if (!professionalId) {
    notFound();
  }

  const professional = await prisma.professional.findUnique({
    where: { id: professionalId },
    include: {
      consultory: true,
      schedules: {
        orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
      },
    },
  });

  if (!professional) {
    notFound();
  }

  const purpose = isSpaceResource(professional) ? "spaces" : "appointments";

  return (
    <main className="page-wrap">
      <div className="header-actions">
        <Link href="/" className="header-home-link">Inicio</Link>
        <Link href="/calendario" className="header-home-link">Agenda publica</Link>
      </div>
      <section className="card">
        <h1>{professional.fullName}</h1>
        <p>{professional.specialty}</p>
        <p>{professional.bio}</p>
        <p>
          {professional.consultory.name} · {professional.consultory.address}
        </p>
      </section>
      <BookingForm professionalId={professional.id} purpose={purpose} />
    </main>
  );
}
