import { IComponentVNode } from '../components'
import { IVNode, renderDOM } from '../vdom'
import { RouteComponent, Router, RouterComponent } from './index'

describe('Router', () => {
  let routerInstace = new Router()

  const originalHistoryBack = window.history.back.bind(window.history)
  const originalHistoryForward = window.history.forward.bind(window.history)

  beforeEach(() => {
    routerInstace.reset()
    window.history.back = originalHistoryBack
    window.history.forward = originalHistoryForward
  })

  test('should return router instance', () => {
    const router = routerInstace.addRoute({
      path: '/',
      title: 'test',
    })
    expect(router).toBeInstanceOf(Router)
  })

  test('should return users active page', () => {
    const router = routerInstace
      .addRoute({
        path: '/',
        title: 'main',
      })
      .addRoute({
        path: '/users',
        title: 'users',
      })

    router.go('/users')

    expect(router.activePage.value).toBe('/users')
  })

  test('should return user is active page', () => {
    const router = routerInstace
      .addRoute({
        path: '/',
        title: 'main',
      })
      .addRoute({
        path: '/users',
        title: 'users',
      })

    router.go('/users')

    expect(router.pageIsActive('/users')).toBe(true)
  })

  test('should return user page title', () => {
    const router = routerInstace
      .addRoute({
        path: '/',
        title: 'main',
      })
      .addRoute({
        path: '/users',
        title: 'users',
      })

    router.go('/users')

    expect(window.document.title).toBe('users')
  })

  test('should call history back', () => {
    const mockHistoryBackFn = jest.fn()
    window.history.back = mockHistoryBackFn
    routerInstace.back()
    expect(mockHistoryBackFn).toBeCalledTimes(1)
  })

  test('should call history forward', () => {
    const mockHistoryForwardFn = jest.fn()
    window.history.forward = mockHistoryForwardFn
    routerInstace.forward()
    expect(mockHistoryForwardFn).toBeCalledTimes(1)
  })

  test('should render active page component', () => {
    const mainPage = {
      page: () => <div id="main"></div>,
      title: 'main',
      path: '/',
    }
    const usersPage = {
      page: () => <div id="users"></div>,
      title: 'users',
      path: '/users',
    }

    routerInstace.activePage.value = '/users'

    const mainPageRouteComponent = <RouteComponent {...mainPage} />
    const usersPageRouteComponent = <RouteComponent {...usersPage} />

    // @ts-ignore
    const root = (
      <div>
        {mainPageRouteComponent}
        {usersPageRouteComponent}
      </div>
    ) as IVNode

    // @ts-ignore
    const routerContainer = (mainPageRouteComponent as IComponentVNode)
      .children[0] as IVNode | IComponentVNode
    expect(routerContainer.props['style'].replace(/\s*/g, '')).toBe(
      'display:none'
    )
  })
})
