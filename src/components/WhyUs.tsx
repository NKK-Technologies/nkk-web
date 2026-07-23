import { SectionHeader } from './ui/SectionHeader'
import { Reveal } from './ui/Reveal'

type Reason = {
  title: string
  body: string
}

const reasons: Reason[] = [
  {
    title: 'Software delivered in production',
    body: 'Our engineers have built and maintained systems that demanding organisations depend on every day — not demos.',
  },
  {
    title: 'Security systems in the field',
    body: 'Hands-on experience installing and servicing access control and CCTV across offices, sites and secure facilities.',
  },
  {
    title: 'Procurement done properly',
    body: 'Deep familiarity with tender requirements, compliance paperwork and delivery timelines — bids that hold up to scrutiny.',
  },
]

export function WhyUs() {
  return (
    <section id="team" className="bg-navy">
      <div className="max-w-[1140px] mx-auto px-5 md:px-6 py-14 md:py-[88px]">
        <Reveal>
          <SectionHeader
            dark
            kicker="Why NKK Tech"
            title="A new company. A seasoned team."
            sub="NKK Tech is newly registered — our people are not. We bring years of hands-on delivery from Tanzania's technology, security and procurement sectors, without the overhead of a large firm."
            className="mb-6 md:mb-11 max-w-[680px]"
          />
        </Reveal>
        <div className="grid gap-3 md:grid-cols-3 md:gap-5">
          {reasons.map(({ title, body }, i) => (
            <Reveal key={title} delay={i * 80}>
              <article className="h-full bg-[rgba(230,243,250,.06)] border border-[rgba(230,243,250,.14)] rounded-2xl p-5 md:p-6 transition-[translate,box-shadow,background-color,border-color] duration-200 ease-[var(--ease-standard)] hover:-translate-y-1 hover:shadow-[0_4px_8px_rgba(10,25,47,.1),0_12px_32px_rgba(10,25,47,.14)] hover:bg-[rgba(230,243,250,.1)] hover:border-[rgba(230,243,250,.22)]">
                <h3 className="font-display font-bold text-white leading-[1.2] text-base md:text-[17px]">
                  {title}
                </h3>
                <p className="mt-2 text-dark-body text-sm md:text-[15px]">{body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
