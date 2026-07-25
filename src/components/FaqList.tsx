import { SectionHeader } from './ui/SectionHeader'
import { Reveal } from './ui/Reveal'

type Faq = { question: string; answer: string }

type FaqListProps = { faqs: readonly Faq[] }

/** No-JS FAQ accordion — plain <details> elements styled as cards. */
export function FaqList({ faqs }: FaqListProps) {
  return (
    <section className="bg-ice">
      <div className="max-w-[1140px] mx-auto px-5 md:px-6 py-14 md:py-[88px]">
        <Reveal>
          <SectionHeader
            kicker="Questions"
            title="Frequently asked questions"
            className="mb-6 md:mb-8"
          />
        </Reveal>
        <div className="flex flex-col gap-3 max-w-[760px]">
          {faqs.map((faq, i) => (
            <Reveal key={faq.question} delay={i * 60}>
              <details className="group bg-white border border-line rounded-2xl shadow-card">
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden px-5 py-4 md:px-6 md:py-5 font-display font-bold text-navy text-base md:text-[17px] leading-[1.3]">
                  {faq.question}
                  <span
                    aria-hidden="true"
                    className="shrink-0 text-brand text-xl leading-none transition-transform duration-200 ease-standard group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="px-5 pb-4 md:px-6 md:pb-5 text-[15px] text-muted">
                  {faq.answer}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
