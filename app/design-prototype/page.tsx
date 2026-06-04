import React from "react";
import HeroBanner from "@/components/ui/HeroBanner";
import KPIBar from "@/components/ui/KPIBar";
import ProfessionalCard from "@/components/ui/ProfessionalCard";

export const metadata = { title: "Prototype - DELTA" };

export default function Page(){
  return (
    <div style={{padding:'24px',maxWidth:1100,margin:'0 auto'}}>
      <HeroBanner />
      <KPIBar />

      <section style={{marginTop:40}}>
        <h2>Profesionales destacados</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,marginTop:12}}>
          <ProfessionalCard name="Antonella" specialty="Psicología" />
          <ProfessionalCard name="María" specialty="Nutrición" />
          <ProfessionalCard name="Carolina" specialty="Terapia Ocupacional" />
        </div>
      </section>
    </div>
  )
}
