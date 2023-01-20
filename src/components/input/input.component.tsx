import { IComponentProps } from '../../modules/components'
import { h } from '../../modules/vdom'

import style from './input.component.module.css'

type InputType = 'textarea' | 'file' | 'input' | 'password'

interface IProps extends IComponentProps {
  type?: InputType
  id: string
  placeholder?: string
  label?: string
  value?: string | File[]
  errorMessage?: string | boolean
  rounded?: boolean
  setValue?: (value: unknown) => void
  onKeyup?: (event: KeyboardEvent) => void
  onBlur?: () => void
  toched?: boolean
  inputSstyle?: string
}

function Input(props: IProps) {
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
    inputSstyle,
  } = props

  const isFileInput = type === 'file'
  const isTextArea = type === 'textarea'

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
  ]

  const TagName = isFileInput ? 'label' : 'div'
  const InputTagName = isTextArea ? 'textarea' : 'input'
  const showErorr = errorMessage && toched

  const getValueFiles = (value: IProps['value']) => {
    if (Array.isArray(value)) {
      return value
    }
    return []
  }

  return (
    <TagName
      className={[style.inputWrapper, errorClass, className].join(' ')}
      for={isFileInput ? id : ''}
    >
      {!isFileInput && <label htmlFor={id}>{label || ''}</label>}
      <InputTagName
        value={isFileInput ? null : value}
        onBlur={onBlur}
        id={id}
        style={inputSstyle}
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
          {errorMessage.toString()}
        </div>
      )}
      {!!isFileInput && (
        <div>
          <div className={style.avatarLabel}>{label || ''}</div>
          <div>
            {getValueFiles(value).map((file: File) => (
              <div>{file.name.toString()}</div>
            ))}
          </div>
          Перетащите файлы или загрузите
          <div className={style.fileFormat}>
            Поддерживаемые форматы: PNG, TIFF, JPG
          </div>
        </div>
      )}
      {children}
    </TagName>
  )
}

export { Input }
