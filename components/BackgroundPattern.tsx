export default function BackgroundPattern() {
  return (
    <svg 
      className="lp-bg-pattern" 
      width="100%" 
      height="100%" 
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        {/* Cerebro */}
        <g id="icon-brain" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
          <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
          <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
          <path d="M17.599 6.5a3 3 0 0 0 .399-1.375" />
          <path d="M6.002 5.125A3 3 0 0 0 6.401 6.5" />
          <path d="M3.477 10.896a4 4 0 0 1 .585-.396" />
          <path d="M19.938 10.5a4 4 0 0 1 .585.396" />
          <path d="M6 18a4 4 0 0 1-1.967-.516" />
          <path d="M19.967 17.484A4 4 0 0 1 18 18" />
        </g>
        
        {/* Nube de diálogo */}
        <g id="icon-chat" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
          <path d="M8 12h.01" />
          <path d="M12 12h.01" />
          <path d="M16 12h.01" />
        </g>

        {/* Chispa / Idea */}
        <g id="icon-spark" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
        </g>

        {/* Planta */}
        <g id="icon-plant" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
        </g>

        {/* Patrón disperso (scattered) */}
        <pattern id="psy-pattern" x="0" y="0" width="800" height="800" patternUnits="userSpaceOnUse">
          {/* Fila superior (esparcida) */}
          <use href="#icon-brain" transform="translate(60, 90) scale(2.2) rotate(-15)" />
          <use href="#icon-chat" transform="translate(280, 50) scale(1.4) rotate(12)" />
          <use href="#icon-spark" transform="translate(520, 140) scale(2.8) rotate(45)" />
          <use href="#icon-plant" transform="translate(740, 80) scale(1.6) rotate(-8)" />

          {/* Fila media alta */}
          <use href="#icon-plant" transform="translate(180, 270) scale(2.5) rotate(25)" />
          <use href="#icon-brain" transform="translate(420, 310) scale(1.3) rotate(-35)" />
          <use href="#icon-chat" transform="translate(680, 240) scale(2.1) rotate(18)" />
          <use href="#icon-spark" transform="translate(80, 450) scale(1.2) rotate(-10)" />

          {/* Fila media baja */}
          <use href="#icon-chat" transform="translate(320, 520) scale(2.4) rotate(-22)" />
          <use href="#icon-plant" transform="translate(580, 460) scale(1.5) rotate(38)" />
          <use href="#icon-brain" transform="translate(820, 420) scale(2.6) rotate(15)" />
          
          {/* Fila inferior */}
          <use href="#icon-spark" transform="translate(220, 710) scale(1.9) rotate(-42)" />
          <use href="#icon-brain" transform="translate(480, 760) scale(1.6) rotate(22)" />
          <use href="#icon-plant" transform="translate(710, 680) scale(2.3) rotate(-18)" />
          <use href="#icon-chat" transform="translate(60, 800) scale(1.4) rotate(5)" />
          <use href="#icon-spark" transform="translate(840, 820) scale(1.7) rotate(32)" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#psy-pattern)" />
    </svg>
  );
}
