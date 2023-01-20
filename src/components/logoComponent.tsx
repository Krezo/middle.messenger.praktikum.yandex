import logo from '../images/logo.svg'
import { IComponentProps } from '../modules/components'
import { h } from '../modules/vdom'

function Logo(props: IComponentProps) {
  return <img src={logo} {...props} alt="" />
}

export { Logo }
