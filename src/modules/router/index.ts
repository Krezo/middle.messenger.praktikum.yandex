import RouterComponent from './components/RouterComponent'
import RouteComponent from './components/RouteComponent'
import RouterLink from './components/RouterLink'
import { ref } from '../reactivity'

const activePage = ref(window.location.pathname)

class Router {
  private __instance: Router
  constructor() {
    if (this.__instance) {
      return this.__instance
    }
    window.addEventListener('popstate', (event) => {
      activePage.value = (event.currentTarget as Document).location.pathname
    })
    this.__instance = this
  }
  go(href = '') {
    window.history.pushState({}, 'Title', href)
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
