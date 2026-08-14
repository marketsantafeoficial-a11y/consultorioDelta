import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { BookingForm } from "@/components/booking-form";
import { TeamReferralForm } from "@/components/team-referral-form.client";
import { isSpaceResource } from "@/lib/resource-kind";
import { FloatingWhatsApp, SiteHeader } from "@/components/site-header";
import { getWhatsAppHref } from "@/lib/whatsapp";

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

  const prof = professional;
  const isSpace = isSpaceResource(prof);

  function getProfessionalWhatsAppHref(): string {
    const message = `Hola, quiero consultar por ${prof.fullName} de DELTA  ESPACIOS PROFESIONALES.`;
    if (prof.whatsapp) {
      const phone = prof.whatsapp.replace(/\D/g, "");
      return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    }
    return getWhatsAppHref(message);
  }

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
          src={professional.photoUrl ?? "/delta-assets/professional-avatar.svg"}
          alt={professional.fullName}
          className="profile-avatar"
        />
        <div>
          <span className="section-kicker">{isSpace ? "Módulo disponible" : "Profesional del equipo"}</span>
          <h1>{professional.fullName}</h1>
          <p style={{ whiteSpace: "pre-wrap" }}>{professional.specialty}</p>

          {professional.presentacionProfesional ? (
            <p style={{ whiteSpace: "pre-wrap" }}>{professional.presentacionProfesional}</p>
          ) : (
            <p>{professional.bio}</p>
          )}

          {professional.modalidadAtencion ? (
            <p className="muted">Modalidad: {professional.modalidadAtencion}</p>
          ) : null}

          {professional.poblacion ? (
            <p className="muted" style={{ whiteSpace: "pre-wrap" }}>Población: {professional.poblacion}</p>
          ) : null}

          {professional.atencionCobertura ? (
            <p className="muted" style={{ whiteSpace: "pre-wrap" }}>Cobertura: {professional.atencionCobertura}</p>
          ) : null}

          {professional.orientacionTeorica ? (
            <p className="muted" style={{ whiteSpace: "pre-wrap" }}>Orientación: {professional.orientacionTeorica}</p>
          ) : null}

          {professional.prestaciones ? (
            <p className="muted" style={{ whiteSpace: "pre-wrap" }}>Prestaciones: {professional.prestaciones}</p>
          ) : null}

          {professional.areasExperiencia ? (
            <p className="muted" style={{ whiteSpace: "pre-wrap" }}>Áreas de experiencia: {professional.areasExperiencia}</p>
          ) : professional.serves ? (
            <p className="muted">Áreas de experiencia: {professional.serves}</p>
          ) : null}

          <p className="muted">
            {professional.consultory.name} - {professional.consultory.address}
          </p>
          {!isSpace ? (
            <div className="profile-actions">
              <a
                className="lp-cta-primary"
                href={getProfessionalWhatsAppHref()}
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
