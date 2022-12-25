import { IComponentProps } from '../../modules/components'
import { h } from '../../modules/vdom'

import style from './input.component.module.css'
interface IProps extends IComponentProps {
  type?: string
  id?: string
  placeholder?: string
  errorMessage?: string | boolean
  rounded?: boolean
  setValue?: (value: any) => void
  onKeyup?: (event: KeyboardEvent) => void
  onBlur?: () => void
  toched?: boolean
}

const Input = (props: IProps) => {
  const { rounded, className, errorMessage, toched } = props

  const setValue = (event: KeyboardEvent) => {
    if (props.setValue) {
      props.setValue((event.target as HTMLInputElement).value)
    }
  }

  const keyUp = (event: KeyboardEvent) => {
    if (props.onKeyup) {
      props.onKeyup(event)
    }
  }

  const onBlur = () => {
    if (props.onBlur) {
      props.onBlur()
    }
  }

  const inputClasses = [
    style.input,
    rounded ? style.rounded : '',
    errorMessage && toched ? style.error : '',
    ...(className ?? '').split(' '),
  ]

  const showErorr = errorMessage && toched

  return (
    <div className={style.inputWrapper}>
      <input
        onBlur={onBlur}
        id={props.id}
        type={props.type ?? 'text'}
        onKeyUp={keyUp}
        className={inputClasses.join(' ')}
        placeholder={props.placeholder ?? ''}
        onInput={setValue}
      />
      <div
        className={style.errorMessage}
        style={showErorr ? '' : 'display: none;'}
      >
        {errorMessage}
      </div>
    </div>
  )
}

export { Input }
