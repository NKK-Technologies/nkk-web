import { SectionHeader } from './ui/SectionHeader'
import { Reveal } from './ui/Reveal'

type Step = {
  number: number
  title: string
  body: string
}

const steps: Step[] = [
  {
    number: 1,
    title: 'Consult',
    body: 'We start with your problem and your site — then give you a clear written scope and a fixed quote.',
  },
  {
    number: 2,
    title: 'Deliver',
    body: 'Build, supply and installation against the agreed scope, with a named engineer you can call throughout.',
  },
  {
    number: 3,
    title: 'Support',
    body: 'Handover with documentation and training, then maintenance that keeps the system earning its keep.',
  },
]

export function Process() {
  return (
    <section id="process" className="bg-ice">
      <div className="max-w-[1140px] mx-auto px-5 md:px-6 py-14 md:py-[88px]">
        <Reveal>
          <SectionHeader
            kicker="How we work"
            title="Three steps, no surprises."
            className="mb-6 md:mb-10"
          />
        </Reveal>
        <div className="grid gap-3 md:grid-cols-3 md:gap-5">
          {steps.map(({ number, title, body }, i) => (
            <Reveal key={number} delay={i * 80}>
              <article className="h-full flex items-start gap-4 md:flex-col md:gap-3 bg-white rounded-2xl shadow-card p-5 md:p-6 transition-[transform,box-shadow] duration-200 ease-[var(--ease-standard)] hover:-translate-y-1 hover:shadow-[0_4px_8px_rgba(10,25,47,.1),0_12px_32px_rgba(10,25,47,.14)]">
                <span className="badge-pop shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-brand text-white font-display font-bold">
                  {number}
                </span>
                <div className="flex flex-col gap-1 md:gap-3">
                  <h3 className="font-display font-bold text-navy leading-[1.2] text-lg md:text-xl">
                    {title}
                  </h3>
                  <p className="text-[15px] text-muted">{body}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
