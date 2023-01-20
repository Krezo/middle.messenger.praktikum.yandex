import { IComponentProps } from '../../components'
import { h } from '../../vdom'

interface RouterComponentProps extends IComponentProps {}

function RouterComponent(props: RouterComponentProps) {
  const { children } = props
  return <div>{children}</div>
}

export default RouterComponent
