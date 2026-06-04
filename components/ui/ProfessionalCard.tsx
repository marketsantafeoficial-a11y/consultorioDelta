"use client"
import React from "react";

type Props = {
  name: string;
  specialty: string;
  bio?: string;
  image?: string;
};

export default function ProfessionalCard({name,specialty,bio,image="/delta-assets/professional-avatar.svg"}:Props){
  return (
    <article style={{background:'#fff',padding:16,borderRadius:12,boxShadow:'0 6px 16px rgba(20,20,20,0.04)'}}>
      <img src={image} alt={name} style={{width:'100%',height:220,objectFit:'cover',borderRadius:8,marginBottom:12}}/>
      <h3 style={{margin:'0 0 6px'}}>{name}</h3>
      <div style={{color:'#7a6f64',fontSize:14,marginBottom:8}}>{specialty}</div>
      <p style={{margin:0,color:'#5f564a'}}>{bio??'Profesional con experiencia. Descripción breve.'}</p>
      <div style={{marginTop:12}}><button style={{padding:'10px 14px',borderRadius:8,background:'#A78A6D',color:'#fff',border:0}}>Reservar Turno</button></div>
    </article>
  )
}
