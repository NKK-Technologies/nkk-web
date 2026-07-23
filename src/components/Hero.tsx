import { Button } from './ui/Button'
import iconClear from '../assets/icon_clear.png'

export function Hero() {
  return (
    <header id="top" className="relative bg-ice overflow-hidden">
      <div className="relative max-w-[1140px] mx-auto px-5 md:px-6 pt-14 pb-12 md:pt-24 md:pb-[104px] flex flex-col gap-5 md:grid md:grid-cols-[1.15fr_1fr] md:gap-14 md:items-center">
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

        {/* "Missing piece" jigsaw motif */}
        <div
          aria-hidden="true"
          className="relative pointer-events-none h-[280px] mt-2 md:h-[400px] md:mt-0"
        >
          <svg
            viewBox="0 0 340 340"
            fill="none"
            className="absolute w-60 h-60 left-1/2 -translate-x-[58%] bottom-0 md:w-[340px] md:h-[340px] md:left-5 md:translate-x-0 md:bottom-6"
          >
            <g fill="rgba(255,255,255,.55)" stroke="rgba(0,136,204,.22)" strokeWidth="1.5">
              <path className="piece-anim motion-safe-anim [animation-delay:200ms]" d="M0,0 H170 V51 A34 34 0 0 1 170 119 V170 H119 A34 34 0 0 0 51 170 H0 Z" />
              <path className="piece-anim motion-safe-anim [animation-delay:320ms]" d="M0,170 H51 A34 34 0 0 1 119 170 H170 V221 A34 34 0 0 1 170 289 V340 H0 Z" />
              <path className="piece-anim motion-safe-anim [animation-delay:440ms]" d="M170,170 H221 A34 34 0 0 1 289 170 H340 V340 H170 V289 A34 34 0 0 0 170 221 Z" />
            </g>
            <path
              className="anim-socket motion-safe-anim"
              d="M170,0 H340 V170 H289 A34 34 0 0 0 221 170 H170 V119 A34 34 0 0 0 170 51 Z"
              fill="none"
              stroke="rgba(0,136,204,.45)"
              strokeWidth="1.5"
              strokeDasharray="6 6"
            />
          </svg>
          <img
            src={iconClear.src}
            alt=""
            className="anim-hero-piece motion-safe-anim motion-reduce:rotate-[7deg] absolute w-[120px] h-[120px] left-1/2 ml-3 bottom-[138px] md:w-[170px] md:h-[170px] md:left-[226px] md:ml-0 md:bottom-[220px] drop-shadow-[0_14px_22px_rgba(10,25,47,.22)] md:drop-shadow-[0_18px_28px_rgba(10,25,47,.22)]"
          />
        </div>
      </div>
    </header>
  )
}
