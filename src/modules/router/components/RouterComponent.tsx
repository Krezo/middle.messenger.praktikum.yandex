import { IComponentProps } from '../../components'
import { h } from '../../vdom'

interface RouterComponentProps extends IComponentProps {}

function RouterComponent(props: RouterComponentProps): any {
  const { children } = props
  return <div>{children}</div>
}

export default RouterComponent
