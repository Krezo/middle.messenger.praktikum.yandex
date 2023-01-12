import RouterComponent from './components/RouterComponent'
import RouteComponent from './components/RouteComponent'
import RouterLink from './components/RouterLink'
import { ref } from '../reactivity'

const activePage = ref(window.location.pathname)

interface IRoute {
  path: string
  title: string
}

class Router {
  static __instance: Router
  private routeList = new Map<string, IRoute>()
  constructor() {
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
  }
  routeExist(path: string) {
    return this.routeList.has(path)
  }
  go(href = '') {
    const route = this.routeList.get(href)
    if (!route) {
      console.warn('Route not exists')
      return
    }
    window.history.pushState({}, route.title, href)
    activePage.value = href
  }
  back() {
    window.history.go(-1)
  }
  forward() {
    window.history.go(1)
  }
}

export { RouterComponent, RouteComponent, Router, RouterLink, activePage }
