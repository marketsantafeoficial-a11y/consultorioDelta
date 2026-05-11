import { prisma } from "@/lib/prisma";
import { isSpaceResource } from "@/lib/resource-kind";
import { TeamReferralForm } from "@/components/team-referral-form.client";
import { FloatingWhatsApp, SiteHeader } from "@/components/site-header";
import { TeamDirectory } from "@/components/team-directory.client";

export const dynamic = "force-dynamic";

export default async function ProfesionalesPage() {
  const professionals = await prisma.professional.findMany({
    include: {
      consultory: true,
    },
    orderBy: { fullName: "asc" },
  });
  const teamProfessionals = professionals.filter((item) => !isSpaceResource(item));

  return (
    <>
      <SiteHeader />
      <main className="page-wrap team-page">
      <section className="section-stack team-section">
        <div className="section-head">
          <h1>Nuestro equipo</h1>
          <p>
            Conoce los perfiles del equipo, sus areas de trabajo y su forma de
            atencion. Podes escribir por WhatsApp directamente desde cada ficha.
          </p>
        </div>

        <TeamDirectory
          professionals={teamProfessionals.map((professional) => ({
            id: professional.id,
            fullName: professional.fullName,
            specialty: professional.specialty,
            bio: professional.bio,
            photoUrl: professional.photoUrl,
            whatsapp: professional.whatsapp,
            serves: professional.serves,
            consultory: professional.consultory
              ? {
                  name: professional.consultory.name,
                  city: professional.consultory.city,
                }
              : null,
          }))}
        />

        <TeamReferralForm
          professionals={teamProfessionals.map((professional) => ({
            id: professional.id,
            fullName: professional.fullName,
            specialty: professional.specialty,
          }))}
        />
      </section>
    </main>
    <FloatingWhatsApp />
    </>
  );
}
