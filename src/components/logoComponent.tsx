import logo from '../images/logo.svg'
import { IComponentProps } from '../modules/components'
import { h } from '../modules/vdom'

const Logo = (props: IComponentProps) => (<img src={logo} {...props} alt="" />)

export {
  Logo
}
