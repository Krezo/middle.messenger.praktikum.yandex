import { IComponentProps } from '../../modules/components'
import { h } from '../../modules/vdom'
import { capitalizeFirstLetter } from '../../utils/index'
import style from './spinner.component.module.css'

interface SpinnerProps extends IComponentProps {
  size?: 'sm' | 'md' | 'lg'
  primary?: boolean
}

function Spinner(props: SpinnerProps) {
  const { size, className, primary } = props
  const spinnerSizeClass = style[`spinner${capitalizeFirstLetter(size ?? 'md')}`]
  const spinnerClass = [
    primary ? style.spinnerPrimary : '',
    style.spinner,
    spinnerSizeClass,
    className ?? '',
  ]
  return (
    <div className={spinnerClass.join(' ')}>
      <div />
      <div />
      <div />
      <div />
    </div>
  )
}

export { Spinner }
