import { Router } from './index'

describe('Router', () => {
  let routerInstace = new Router()

  beforeEach(() => {
    routerInstace.reset()
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
})
