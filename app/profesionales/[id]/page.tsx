import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { BookingForm } from "@/components/booking-form";
import { TeamReferralForm } from "@/components/team-referral-form.client";
import { isSpaceResource } from "@/lib/resource-kind";
import { FloatingWhatsApp, SiteHeader, getWhatsAppHref } from "@/components/site-header";

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

  const isSpace = isSpaceResource(professional);
  const teamProfessionals = isSpace
    ? []
    : (await prisma.professional.findMany({ orderBy: { fullName: "asc" } })).filter(
        (item) => !isSpaceResource(item),
      );

  return (
    <>
    <SiteHeader />
    <main className="page-wrap">
      <Link href="/profesionales" className="header-home-link">Volver al equipo</Link>

      <section className="profile-hero">
        <img
          src={professional.photoUrl ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(professional.fullName)}&size=260&background=eee5df&color=62615d&bold=true&rounded=true`}
          alt={professional.fullName}
          className="profile-avatar"
        />
        <div>
          <span className="section-kicker">{isSpace ? "Modulo disponible" : "Profesional del equipo"}</span>
          <h1>{professional.fullName}</h1>
          <p>{professional.specialty}</p>
          <p>{professional.bio}</p>
          <p className="muted">
            {professional.consultory.name} - {professional.consultory.address}
          </p>
          {!isSpace ? (
            <div className="profile-actions">
              <a
                className="lp-cta-primary"
                href={getWhatsAppHref(`Hola, quiero consultar por ${professional.fullName} de Delta Consultorios.`)}
                target="_blank"
                rel="noreferrer"
              >
                Contactar por WhatsApp
              </a>
              <Link href="/profesionales#derivacion" className="lp-cta-secondary">
                Formulario de derivacion
              </Link>
            </div>
          ) : null}
        </div>
      </section>

      {isSpace ? (
        <BookingForm professionalId={professional.id} purpose="spaces" />
      ) : (
        <TeamReferralForm
          preferredProfessional={professional.fullName}
          professionals={teamProfessionals.map((item) => ({
            id: item.id,
            fullName: item.fullName,
            specialty: item.specialty,
          }))}
        />
      )}
    </main>
    <FloatingWhatsApp />
    </>
  );
}
