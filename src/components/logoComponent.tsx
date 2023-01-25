import logo from '../images/logo.svg'
import { IComponentProps } from '../modules/components'

function Logo(props: IComponentProps) {
  return <img src={logo} {...props} alt="" />
}

export { Logo }
