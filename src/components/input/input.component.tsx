import { IComponentProps } from '../../modules/components'
import { ref } from '../../modules/reactivity'
import { h } from '../../modules/vdom'

import style from './input.component.module.css'
interface IProps extends IComponentProps {
  type?: string
  id: string
  placeholder?: string
  label?: string
  value?: string | File[]
  errorMessage?: string | boolean
  rounded?: boolean
  setValue?: (value: any) => void
  onKeyup?: (event: KeyboardEvent) => void
  onBlur?: () => void
  toched?: boolean
}

const Input = (props: IProps) => {
  const {
    id,
    rounded,
    className,
    children,
    label,
    errorMessage,
    toched,
    value,
    type,
  } = props

  const isFileInput = type === 'file'

  const setValue = (event: KeyboardEvent) => {
    if (props.setValue) {
      if (isFileInput) {
        props.setValue(
          Array.from(
            (document.getElementById(id) as HTMLInputElement).files ?? []
          )
        )
        return
      }
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

  const errorClass = errorMessage && toched ? style.error : ''

  const inputClasses = [
    style.input,
    rounded ? style.rounded : '',
    isFileInput ? style.inputFile : '',
    errorClass,
    ...(className ?? '').split(' '),
  ]

  const TagName = isFileInput ? 'label' : 'div'
  const showErorr = errorMessage && toched

  const getValueFiles = (value: IProps['value']) => {
    if (Array.isArray(value)) {
      return value
    }
    return []
  }

  return (
    <TagName
      className={[style.inputWrapper, errorClass].join(' ')}
      for={isFileInput ? id : ''}
    >
      {!isFileInput && <label for={id}>{label || ''}</label>}
      <input
        value={isFileInput ? '' : value}
        onBlur={onBlur}
        id={id}
        type={props.type ?? 'text'}
        onKeyUp={keyUp}
        className={inputClasses.join(' ')}
        placeholder={props.placeholder ?? ''}
        onInput={setValue}
        hidden={isFileInput}
      />
      {!!errorMessage && (
        <div
          className={style.errorMessage}
          style={showErorr ? '' : 'display: none;'}
        >
          {errorMessage}
        </div>
      )}
      {!!isFileInput && (
        <div>
          <div className={style.avatarLabel}>{label || ''}</div>
          <div>
            {getValueFiles(value).map((file: File) => {
              return <div>{file.name.toString()}</div>
            })}
          </div>
          Перетащите файлы или загрузите
          <div className={style.fileFormat}>
            Поддерживаемые форматы: PNG, TIFF, JPG
          </div>
        </div>
      )}
    </TagName>
  )
}

export { Input }
