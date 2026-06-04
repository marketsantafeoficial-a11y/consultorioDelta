"use client"
import React, { useState } from "react";
import BookingFunnelModal from "@/components/ui/BookingFunnelModal";

type Props = {
  title?: string;
  subtitle?: string;
};

export default function HeroBanner({
  title = "Espacios profesionales para la salud y el bienestar",
  subtitle = "Red interdisciplinaria de profesionales, consultorios equipados y agenda online.",
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <section className="hero-banner" style={{display:'grid',gridTemplateColumns:'1fr 420px',gap:32,alignItems:'center',padding:'48px 0'}}>
        <div>
          <h1 style={{fontFamily:'Cormorant Garamond, serif',fontSize:48,margin:0,color:'#2d2a26'}}>{title}</h1>
          <p style={{margin:'12px 0 20px',fontSize:18,color:'#5f564a'}}>{subtitle}</p>
          <div style={{display:'flex',gap:12}}>
            <button onClick={()=>setOpen(true)} className="btn-primary" style={{padding:'12px 20px',borderRadius:10,background:'#A78A6D',color:'#fff',border:0}}>Reservar Turno</button>
            <button onClick={()=>{document.getElementById('profesionales')?.scrollIntoView({behavior:'smooth'})}} className="btn-ghost" style={{padding:'12px 20px',borderRadius:10,background:'transparent',border:'1px solid rgba(107,93,77,0.12)'}}>Conocer Profesionales</button>
          </div>
          <div style={{display:'flex',gap:14,marginTop:24}}>
            <div style={{background:'#fff',padding:14,borderRadius:10,flex:1,textAlign:'center'}}><strong style={{display:'block',fontSize:18}}>+20</strong>Profesionales</div>
            <div style={{background:'#fff',padding:14,borderRadius:10,flex:1,textAlign:'center'}}><strong style={{display:'block',fontSize:18}}>+500</strong>Pacientes</div>
            <div style={{background:'#fff',padding:14,borderRadius:10,flex:1,textAlign:'center'}}><strong style={{display:'block',fontSize:18}}>6</strong>Especialidades</div>
            <div style={{background:'#fff',padding:14,borderRadius:10,flex:1,textAlign:'center'}}><strong style={{display:'block',fontSize:18}}>City Bell</strong></div>
          </div>
        </div>
        <div style={{borderRadius:12,overflow:'hidden',boxShadow:'0 10px 30px rgba(20,20,20,0.06)'}}>
          <img src="/delta-assets/ig-highlight-ambientes.jpg" alt="Ambientes" style={{width:'100%',height:'100%',display:'block',objectFit:'cover'}}/>
        </div>
      </section>
      {open && <BookingFunnelModal onClose={()=>setOpen(false)} />}
    </>
  );
}
