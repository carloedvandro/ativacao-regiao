export default function Grafico3D() {
  return (
    <div className="relative mx-auto mt-2 w-full max-w-[760px] h-[430px] flex items-center justify-center">
      <div className="absolute bottom-[38px] w-[520px] h-[90px] bg-black/35 blur-2xl rounded-full" />
      <svg viewBox="0 0 760 430" className="relative w-full h-full drop-shadow-2xl">
        <defs>
          <filter id="shadow">
            <feDropShadow dx="0" dy="10" stdDeviation="7" floodOpacity="0.35" />
          </filter>
          <linearGradient id="pink" x1="0" x2="1">
            <stop offset="0%" stopColor="#ff2b91" />
            <stop offset="100%" stopColor="#b90052" />
          </linearGradient>
          <linearGradient id="green" x1="0" x2="1">
            <stop offset="0%" stopColor="#08c324" />
            <stop offset="100%" stopColor="#006c10" />
          </linearGradient>
          <linearGradient id="purple" x1="0" x2="1">
            <stop offset="0%" stopColor="#a929ff" />
            <stop offset="100%" stopColor="#4b008e" />
          </linearGradient>
          <linearGradient id="cyan" x1="0" x2="1">
            <stop offset="0%" stopColor="#16bfd1" />
            <stop offset="100%" stopColor="#056e83" />
          </linearGradient>
          <linearGradient id="blue" x1="0" x2="1">
            <stop offset="0%" stopColor="#5c22ff" />
            <stop offset="100%" stopColor="#21006e" />
          </linearGradient>
        </defs>
        <ellipse cx="380" cy="250" rx="250" ry="145" fill="#000" opacity="0.13" />
        <path d="M380 65 A250 145 0 0 1 610 180 L500 220 A130 75 0 0 0 380 145 Z" fill="url(#pink)" filter="url(#shadow)" />
        <path d="M610 180 A250 145 0 0 1 505 350 L450 265 A130 75 0 0 0 500 220 Z" fill="url(#green)" filter="url(#shadow)" />
        <path d="M505 350 A250 145 0 0 1 205 330 L300 255 A130 75 0 0 0 450 265 Z" fill="url(#purple)" filter="url(#shadow)" />
        <path d="M205 330 A250 145 0 0 1 165 165 L280 210 A130 75 0 0 0 300 255 Z" fill="url(#cyan)" filter="url(#shadow)" />
        <path d="M165 165 A250 145 0 0 1 380 65 L380 145 A130 75 0 0 0 280 210 Z" fill="url(#blue)" filter="url(#shadow)" />
        <ellipse cx="380" cy="220" rx="135" ry="76" fill="white" />
        <ellipse cx="380" cy="225" rx="120" ry="62" fill="#f7f7f7" opacity="0.9" />
        <text x="380" y="126" textAnchor="middle" fontSize="33" fontWeight="900" fill="white">30,4%</text>
        <text x="545" y="230" textAnchor="middle" fontSize="31" fontWeight="900" fill="white">28,1%</text>
        <text x="330" y="315" textAnchor="middle" fontSize="31" fontWeight="900" fill="white">14,2%</text>
        <text x="220" y="225" textAnchor="middle" fontSize="31" fontWeight="900" fill="white">10,0%</text>
        <text x="270" y="145" textAnchor="middle" fontSize="30" fontWeight="900" fill="white">7,7%</text>
      </svg>
    </div>
  );
}
