import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'outline'
type Size = 'md' | 'lg'

type CommonProps = {
  variant?: Variant
  size?: Size
  fullWidth?: boolean
  className?: string
  children?: ReactNode
}

type ButtonAsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & {
    href?: undefined
  }

type ButtonAsAnchor = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps> & {
    href: string
  }

type ButtonProps = ButtonAsButton | ButtonAsAnchor

const base =
  'inline-flex items-center justify-center gap-2 rounded-xl border-[1.5px] border-transparent font-body font-semibold whitespace-nowrap no-underline cursor-pointer transition active:scale-[.98] focus-visible:outline-none focus-visible:shadow-[0_0_0_3px_rgba(0,136,204,.35)]'

const sizes: Record<Size, string> = {
  md: 'h-10 px-5 text-[15px]',
  lg: 'h-12 px-[26px] text-base',
}

const variants: Record<Variant, string> = {
  primary: 'bg-brand text-white hover:bg-brand-deep',
  outline: 'bg-transparent text-brand border-brand hover:bg-ice',
}

function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(' ')
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
  children,
  ...rest
}: ButtonProps) {
  const classes = cx(
    base,
    sizes[size],
    variants[variant],
    fullWidth && 'w-full',
    className,
  )

  if ('href' in rest && rest.href !== undefined) {
    return (
      <a className={classes} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    )
  }

  return (
    <button className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  )
}
