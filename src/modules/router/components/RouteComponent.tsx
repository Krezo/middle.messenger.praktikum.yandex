import { IComponentProps } from '../../components'
import { h } from '../../vdom'
import { Router, activePage } from '../index'

interface RouteComponentProps extends IComponentProps {
  page: (props: RouteComponentProps) => JSX.Element
  path: string
  title: string
}

const pageIsActive = (route: string) => {
  return activePage.value === route
}
const RouteComponent = (props: RouteComponentProps) => {
  const { path, title, page } = props
  // Проверяем активна ли сейчас страница
  const isActivePage = pageIsActive(path)
  new Router().addRoute({
    path,
    title,
  })
  if (isActivePage) {
    document.title = title
  }
  // Скрываем/отображаем страницу
  const display = isActivePage ? 'block' : 'none'
  return <div style={`display : ${display}`}>{page(props)}</div>
}

export default RouteComponent
