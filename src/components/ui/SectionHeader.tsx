type SectionHeaderProps = {
  kicker: string
  title: string
  sub?: string
  dark?: boolean
  className?: string
}

export function SectionHeader({
  kicker,
  title,
  sub,
  dark = false,
  className,
}: SectionHeaderProps) {
  const wrapper = [
    'flex flex-col gap-2 md:gap-2.5 max-w-[640px]',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={wrapper}>
      <span
        className={`font-display italic font-bold uppercase text-[13px] tracking-[.08em] ${
          dark ? 'text-sky-mist' : 'text-brand'
        }`}
      >
        {kicker}
      </span>
      <h2
        className={`font-display font-bold text-2xl md:text-[28px] leading-[1.2] ${
          dark ? 'text-white' : 'text-navy'
        }`}
      >
        {title}
      </h2>
      {sub && (
        <p className={dark ? 'text-dark-body' : 'text-muted'}>{sub}</p>
      )}
    </div>
  )
}
