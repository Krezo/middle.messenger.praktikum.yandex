import { RouteComponent, RouterComponent } from './modules/router/index'
import { createApp, h } from './modules/vdom'
import IndexPage from './pages/index/index.page'
import SettingsPage from './pages/settings/settings.page'
import AuthPage from './pages/auth/auth.page'
import RegisterPage from './pages/register/register.page'
import Page404 from './pages/404/404'
import Page500 from './pages/500/500'

document.addEventListener('DOMContentLoaded', () => {
  const rootEl = document.getElementById('root')
  const app = createApp(rootEl, () => {
    return (
      <RouterComponent>
        <RouteComponent route="/" page={IndexPage} />
        <RouteComponent route="/settings" page={SettingsPage} />
        <RouteComponent route="/auth" page={AuthPage} />
        <RouteComponent route="/register" page={RegisterPage} />
        <RouteComponent route="/404" page={Page404} />
        <RouteComponent route="/500" page={Page500} />
      </RouterComponent>
    )
  })

  app.mount()
})
