import { Reveal } from './ui/Reveal'

type PageHeroProps = {
  kicker: string
  title: string
  intro?: string
}

/** Ice-band page header for subpages — kicker, h1, optional intro. */
export function PageHero({ kicker, title, intro }: PageHeroProps) {
  return (
    <header className="bg-ice">
      <div className="max-w-[1140px] mx-auto px-5 md:px-6 pt-14 pb-12 md:pt-20 md:pb-16">
        <Reveal className="flex flex-col gap-3 md:gap-4 max-w-[720px]">
          <span className="font-display italic font-bold uppercase text-[13px] tracking-[.08em] text-brand">
            {kicker}
          </span>
          <h1 className="m-0 font-display font-extrabold text-navy leading-[1.15] text-[30px] md:text-[clamp(34px,4vw,44px)]">
            {title}
          </h1>
          {intro && (
            <p className="m-0 max-w-[620px] text-[17px] md:text-[19px] text-ink [text-wrap:pretty]">
              {intro}
            </p>
          )}
        </Reveal>
      </div>
    </header>
  )
}
