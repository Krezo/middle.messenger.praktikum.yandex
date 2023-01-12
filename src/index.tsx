import {
  RouteComponent,
  Router,
  RouterComponent,
  activePage,
} from './modules/router/index'
import { createApp, h } from './modules/vdom'
import IndexPage from './pages/index/index.page'
import SettingsPage from './pages/settings/settings.page'
import AuthPage from './pages/auth/auth.page'
import RegisterPage from './pages/register/register.page'
import Page404 from './pages/404/404'
import Page500 from './pages/500/500'
import { authStore } from './store/authStore'
import AuthService from './services/authService'
import { watchEffect } from './modules/reactivity'

const authService = new AuthService()
const router = new Router()

document.addEventListener('DOMContentLoaded', async () => {
  const rootEl = document.getElementById('root')

  const app = createApp(rootEl, () => {
    return (
      <RouterComponent>
        <RouteComponent
          title="Chat. Messenger"
          path="/messenger"
          page={IndexPage}
        />
        <RouteComponent
          title="Chat. Settings"
          path="/settings"
          page={SettingsPage}
        />
        <RouteComponent title="Chat. Auth" path="/" page={AuthPage} />
        <RouteComponent
          title="Chat. Signup"
          path="/sign-up"
          page={RegisterPage}
        />
        <RouteComponent
          title="Chat. Page not found"
          path="/404"
          page={Page404}
        />
        <RouteComponent title="Chat. Server error" path="/500" page={Page500} />
      </RouterComponent>
    )
  })

  app.mount()

  watchEffect(async () => {
    if (!router.routeExist(activePage.value)) {
      activePage.value = '/404'
      new Router().go('/404')
      return
    }
    if (activePage.value === '/') {
      await authService.getUser()
      if (authService.isAuth()) {
        new Router().go('/messenger')
      }
      return
    }
    if (activePage.value === '/settings' || activePage.value === '/messenger') {
      await authService.getUser()
      if (!authService.isAuth()) {
        authStore.signinError = 'Необходима авторизация'
        new Router().go('/')
      }
      return
    }
  })
})
