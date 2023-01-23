import RouterComponent from './components/RouterComponent'
import RouteComponent from './components/RouteComponent'
import RouterLink from './components/RouterLink'
import { ref } from '../reactivity'

interface IRoute {
  path: string
  title: string
}

class Router {
  static __instance: Router

  public readonly routeList = new Map<string, IRoute>()

  constructor(public readonly activePage = ref(window.location.pathname)) {
    if (Router.__instance) {
      return Router.__instance
    }
    window.addEventListener('popstate', (event) => {
      activePage.value = (event.currentTarget as Document).location.pathname
    })
    Router.__instance = this
  }

  addRoute(route: IRoute) {
    if (!this.routeList.has(route.path)) {
      this.routeList.set(route.path, route)
    }
    return Router.__instance
  }

  reset() {
    this.activePage.value = '/'
    this.routeList.clear()
    this.resetActivePage()
  }

  private resetActivePage() {
    this.activePage.deps.clear()
    this.activePage.value = ''
  }

  pageIsActive(path: string) {
    return this.activePage.value === path
  }

  routeExist(path: string) {
    return this.routeList.has(path)
  }

  go(href = '', data: object = {}) {
    const route = this.routeList.get(href)
    if (!route) {
      console.warn('Route not exists')
      return
    }
    window.history.pushState(data, '', href)
    window.document.title = route.title
    this.activePage.value = href
  }

  back() {
    window.history.back()
  }

  forward() {
    window.history.forward()
  }
}

export { RouterComponent, RouteComponent, Router, RouterLink }
