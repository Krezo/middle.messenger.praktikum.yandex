import { IComponentProps } from '../../modules/components'
import { h } from '../../modules/vdom'
import { Button } from '../button/buttonComponent'
import style from './error.module.css'

interface IProps extends IComponentProps {
  statusCode: number
  text: string
  textDiscription: string
}

const Error = (props: IProps) => {
  const { statusCode } = props;
  return <div>
    <div className={style.errorPageInner}>
      <div className={style.statusCode}>
        {statusCode}
      </div>
      <div className={style.errorText}>{props.text}</div>
      <p className={style.errorTextDiscription}>{props.textDiscription}</p>
      <Button className={style.button} primary link href='/'>
        НА ГЛАВНУЮ
      </Button>
    </div>
  </div>
}

export {
  Error
}