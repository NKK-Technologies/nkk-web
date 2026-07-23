import { Button } from './ui/Button'
import iconClear from '../assets/icon_clear.png'

export function Hero() {
  return (
    <header id="top" className="relative bg-ice overflow-hidden">
      <div className="relative max-w-[1140px] mx-auto px-5 md:px-6 pt-14 pb-12 md:pt-24 md:pb-[104px] md:min-h-[min(760px,calc(100svh_-_68px))] flex flex-col gap-5 md:grid md:grid-cols-[1.15fr_1fr] md:gap-14 md:items-center md:content-center">
        <div className="flex flex-col gap-5 md:gap-6">
          <h1 className="anim-rise motion-safe-anim m-0 font-display font-extrabold text-navy leading-[1.1] text-[34px] md:text-[clamp(40px,5vw,56px)]">
            The <span className="text-brand">Missing Piece</span> in Your Digital Transformation
          </h1>
          <p className="anim-rise motion-safe-anim [animation-delay:120ms] m-0 max-w-[560px] text-[17px] md:text-[19px] [text-wrap:pretty]">
            We design, build and support the technology your organisation runs on — software, access control, CCTV and hardware supply, under one roof.
          </p>
          <div className="anim-rise motion-safe-anim [animation-delay:240ms] flex flex-col gap-3 md:flex-row md:items-center md:gap-3.5">
            <Button href="#quote" variant="primary" size="lg" fullWidth className="md:w-auto">
              Request a quote
            </Button>
            <Button href="#services" variant="outline" size="lg" fullWidth className="md:w-auto">
              Explore our services
            </Button>
          </div>
        </div>

        {/* "Missing piece" jigsaw motif — the brand-mark piece docks into the
            empty top-right slot on load, then the two seams it touches pulse. */}
        <div
          aria-hidden="true"
          className="relative pointer-events-none h-[280px] mt-2 md:h-[400px] md:mt-0"
        >
          <svg
            viewBox="0 0 340 340"
            fill="none"
            className="absolute w-60 h-60 left-1/2 -translate-x-[58%] bottom-0 md:w-[340px] md:h-[340px] md:left-5 md:translate-x-0 md:bottom-6"
          >
            <defs>
              <linearGradient id="gradPiece" x1="0" y1="340" x2="340" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#E6F3FA" />
                <stop offset=".55" stopColor="#C6E4F5" />
                <stop offset="1" stopColor="#9BD1EE" />
              </linearGradient>
              <filter id="zapGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="2" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <radialGradient id="flashGrad" cx="170" cy="170" r="200" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#0088CC" stopOpacity="1" />
                <stop offset="1" stopColor="#0088CC" stopOpacity=".25" />
              </radialGradient>
            </defs>
            {/* Three assembled pieces — one continuous gradient. The two knobs
                facing the slot use radius 38 (a true bulb) to match the mark. */}
            <g fill="url(#gradPiece)">
              <path d="M0,0 H170 V46.39 A38.51 38.51 0 1 1 170 122.43 V170 H119 A34 34 0 0 0 51 170 H0 Z" />
              <path d="M0,170 H51 A34 34 0 0 1 119 170 H170 V221 A34 34 0 0 1 170 289 V340 H0 Z" />
              <path d="M170,170 H216.87 A38.50 38.50 0 1 1 292.58 170 H340 V340 H170 V289 A34 34 0 0 0 170 221 Z" />
            </g>
            {/* Faint interior seams between the three pieces. */}
            <path
              d="M0,170 H51 A34 34 0 0 1 119 170 H170 M170,170 V221 A34 34 0 0 1 170 289 V340"
              fill="none"
              stroke="rgba(0,136,204,.16)"
              strokeWidth="1"
            />
            {/* Slot-facing seams — flash on attach, then pulse as a heartbeat. */}
            <g
              className="hero-seam-flash motion-safe-anim"
              fill="none"
              stroke="url(#flashGrad)"
              strokeWidth="6"
              strokeLinecap="round"
              opacity="0"
              filter="url(#zapGlow)"
            >
              <path d="M170,0 V46.39 A38.51 38.51 0 1 1 170 122.43 V170" />
              <path d="M170,170 H216.87 A38.50 38.50 0 1 1 292.58 170 H340" />
            </g>
          </svg>
          <img
            src={iconClear.src}
            alt=""
            className="hero-dock motion-safe-anim absolute w-[120px] h-[120px] left-1/2 ml-[-19px] bottom-[120px] md:w-[170px] md:h-[170px] md:left-[190px] md:ml-0 md:bottom-[194px] drop-shadow-[0_3px_8px_rgba(10,25,47,.14)] [--dock-x:85px] [--dock-y:-64px] md:[--dock-x:120px] md:[--dock-y:-92px]"
          />
        </div>
      </div>
    </header>
  )
}
