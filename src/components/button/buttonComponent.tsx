import { h } from '../../modules/vdom'
import { IComponentProps } from '../../modules/components'

import style from './button.module.css'

import { Spinner } from '../spinner/spinner.component'

interface IProps extends IComponentProps {
  primary?: boolean
  outline?: boolean
  type?: 'button' | 'submit' | 'reset'
  link?: boolean
  rounded?: boolean
  small?: boolean
  loading?: boolean
  empty?: boolean
  text?: string
  href?: string
  disabled?: boolean
  onClick?: (event: MouseEvent) => void
}

function Button(props: IProps = {}) {
  const {
    primary,
    small,
    type,
    disabled,
    outline,
    rounded,
    className,
    onClick,
    href,
    loading,
  } = props

  const btnClasses = [
    style.btn,
    primary ? style.primary : '',
    outline ? style.outline : '',
    small ? style.small : '',
    rounded ? style.rounded : '',
    ...(className ?? '').split(' '),
  ]

  const ButtonTag = props.link ? 'a' : 'button'
  const isDisabled = disabled || loading

  return (
    <ButtonTag
      type={type ?? 'button'}
      href={href}
      disabled={isDisabled}
      className={btnClasses.join(' ')}
      onClick={onClick}
    >
      {props.children}
      {!!loading && <Spinner className={style.spinner} />}
    </ButtonTag>
  )
}

export { Button }
