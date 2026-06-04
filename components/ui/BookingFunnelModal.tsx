"use client"
import React, {useState} from "react";

type Props = {
  onClose?: ()=>void
}

export default function BookingFunnelModal({onClose}: Props){
  const [step, setStep] = useState(1);
  const [specialty, setSpecialty] = useState('');
  const [professional, setProfessional] = useState('');

  function next(){ setStep(s=>Math.min(3,s+1)) }
  function prev(){ setStep(s=>Math.max(1,s-1)) }

  return (
    <div style={{background:'rgba(0,0,0,0.35)',position:'fixed',inset:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{background:'#fff',padding:20,borderRadius:12,maxWidth:480,width:'100%'}}>
        <h3>Reservar Turno</h3>
        {step===1 && (
          <div>
            <label>Especialidad</label>
            <select value={specialty} onChange={e=>setSpecialty(e.target.value)} style={{width:'100%',padding:8,marginTop:8}}>
              <option value="">Seleccionar</option>
              <option>Psicología</option>
              <option>Nutrición</option>
            </select>
          </div>
        )}

        {step===2 && (
          <div>
            <label>Profesional</label>
            <select value={professional} onChange={e=>setProfessional(e.target.value)} style={{width:'100%',padding:8,marginTop:8}}>
              <option value="">Seleccionar</option>
              <option>Nombre Profesional 1</option>
            </select>
          </div>
        )}

        {step===3 && (
          <div>
            <label>Confirmar</label>
            <p>Se abrirá WhatsApp con el mensaje prellenado.</p>
            <pre style={{background:'#f7f3ee',padding:10,borderRadius:8}}>Hola, quiero reservar con {professional} ({specialty}).</pre>
            <button onClick={()=>{
              const msg = `Hola, quiero reservar con ${professional} (${specialty}).`;
              const url = `https://wa.me/5492214778280?text=${encodeURIComponent(msg)}`;
              // open new window and close modal
              window.open(url, '_blank');
              onClose?.();
            }} style={{background:'#A78A6D',color:'#fff',padding:'10px 14px',border:0,borderRadius:8}}>Abrir WhatsApp</button>
          </div>
        )}

        <div style={{display:'flex',justifyContent:'space-between',marginTop:14}}>
          <button onClick={prev} style={{padding:8}}>Atrás</button>
          {step<3? <button onClick={next} style={{padding:8}}>Siguiente</button> : <button onClick={()=>{ onClose?.(); }} style={{padding:8}}>Cerrar</button>}
        </div>
      </div>
    </div>
  )
}
