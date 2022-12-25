import { IComponentProps } from '../../components'
import { h } from '../../vdom'
import { activePage } from '../index'

interface RouteComponentProps extends IComponentProps {
  page: (props: RouteComponentProps) => JSX.Element
  route: string
}

const RouteComponent = (props: RouteComponentProps) => {
  const { route, page } = props

  const isActivePage = activePage.value === route
  // Хочется реализовать условный рендеринг, но проблема в том,
  // что реактивные данные не навешиваются на root-рендер функцию, если
  // использывать условный рендер, поэтому реализовано скрытием в DOM
  const display = isActivePage ? 'block' : 'none'
  return <div style={`display : ${display}`}>{page(props)}</div>
}

export default RouteComponent
