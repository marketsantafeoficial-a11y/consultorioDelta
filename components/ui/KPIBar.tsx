import React from "react";

export default function KPIBar() {
  const items = [
    { label: "+20", sub: "Profesionales" },
    { label: "+500", sub: "Pacientes" },
    { label: "6", sub: "Especialidades" },
    { label: "City Bell", sub: "Ubicación" },
  ];

  return (
    <div style={{display:'flex',gap:14,marginTop:16}}>
      {items.map((it)=> (
        <div key={it.label} style={{background:'#fff',padding:12,borderRadius:10,flex:1,textAlign:'center'}}>
          <strong style={{display:'block',fontSize:18,color:'#2d2a26'}}>{it.label}</strong>
          <small style={{color:'#7a6f64'}}>{it.sub}</small>
        </div>
      ))}
    </div>
  )
}
