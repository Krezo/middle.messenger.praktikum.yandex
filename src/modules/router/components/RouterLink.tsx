import { IComponentProps } from '../../components'
import { Router } from '../index'

interface RouterLinkProps extends IComponentProps {
  href: string
}

function RouterLink(props: RouterLinkProps) {
  const { href, children, className } = props
  const router = new Router()

  return (
    <a
      href={href}
      className={className}
      onClick={(event: KeyboardEvent) => {
        event.preventDefault()
        router.go(href)
      }}
    >
      {children}
    </a>
  )
}

export default RouterLink
