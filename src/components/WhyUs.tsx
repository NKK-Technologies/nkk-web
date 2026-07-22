import { SectionHeader } from './ui/SectionHeader'

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
        <SectionHeader
          dark
          kicker="Why NKK Tech"
          title="A new company. A seasoned team."
          sub="NKK Tech is newly registered — our people are not. We bring years of hands-on delivery from Tanzania's technology, security and procurement sectors, without the overhead of a large firm."
          className="mb-8 md:mb-12 max-w-[680px]"
        />
        <div className="grid gap-3 md:grid-cols-3 md:gap-5">
          {reasons.map(({ title, body }) => (
            <article
              key={title}
              className="bg-[rgba(230,243,250,.06)] border border-[rgba(230,243,250,.14)] rounded-2xl p-5 md:p-6"
            >
              <h3 className="font-display font-bold text-white leading-[1.2] text-base md:text-[17px]">
                {title}
              </h3>
              <p className="mt-2 text-dark-body text-sm md:text-[15px]">{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
