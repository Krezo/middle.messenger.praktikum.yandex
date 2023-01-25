import { IComponentProps, IComponentVNode } from '../../components'
import { Router } from '../index'

interface RouteComponentProps extends IComponentProps {
  page: (props: RouteComponentProps) => JSX.Element
  path: string
  title: string
}

function RouteComponent(props: RouteComponentProps) {
  const { path, title, page } = props
  const router = new Router()

  // Проверяем активна ли сейчас страница
  const isActivePage = router.pageIsActive(path)

  router.addRoute({
    path,
    title,
  })

  if (isActivePage) {
    document.title = title
  }
  // Скрываем/отображаем страницу
  const display = isActivePage ? 'block' : 'none'
  return <div style={`display :${display}`}>{page(props)}</div>
}

export default RouteComponent
