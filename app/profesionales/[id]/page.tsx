import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BookingForm } from "@/components/booking-form";

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

  return (
    <main className="page-wrap">
      <section className="card">
        <h1>{professional.fullName}</h1>
        <p>{professional.specialty}</p>
        <p>{professional.bio}</p>
        <p>{professional.consultory.name}</p>
      </section>
      <BookingForm professionalId={professional.id} />
    </main>
  );
}
