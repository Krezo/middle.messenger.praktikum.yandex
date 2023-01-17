import { IComponentProps } from '../../modules/components'
import { ref } from '../../modules/reactivity'
import { h } from '../../modules/vdom'
import style from './modal.component.module.css'

import CloseIcon from '../../images/icons/close.svg'

interface Props extends IComponentProps {
  open: boolean
  title?: string
  close: () => void
}

const Modal = (props: Props) => {
  const { open, title, close, children } = props

  if (!!open) {
    document.body.style['overflow'] = 'hidden'
  } else {
    document.body.style['overflow'] = 'auto'
  }

  return (
    !!open && (
      <div className={style.modalContainer}>
        <div className={style.modal}>
          {!!title && <div className={style.modalHeader}>{title}</div>}
          <div className={style.modalBody}>{children}</div>
          <svg
            onClick={() => close()}
            width="11"
            className={style.closeIcon}
            height="11"
            viewBox="0 0 11 11"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 10L10 1M10 10L1 1"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </div>
      </div>
    )
  )
}

export { Modal }
