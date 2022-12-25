import { IComponentProps } from '../../components'
import { h } from '../../vdom'

interface RouterComponentProps extends IComponentProps {}

const RouterComponent = (props: RouterComponentProps): any => {
  const { children } = props
  console.log('re-render')
  return <div>{children}</div>
}

export default RouterComponent
