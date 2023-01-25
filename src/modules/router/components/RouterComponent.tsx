import { IComponentProps } from '../../components'

interface RouterComponentProps extends IComponentProps {}

function RouterComponent(props: RouterComponentProps) {
  const { children } = props
  return <div>{children}</div>
}

export default RouterComponent
