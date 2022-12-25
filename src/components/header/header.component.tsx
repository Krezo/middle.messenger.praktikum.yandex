import style from './header.module.css'
import styles from '../../css/app.module.css'

import { Button } from '../button/buttonComponent'
import { Logo } from '../logoComponent'

import { h } from '../../modules/vdom'
import { RouterLink } from '../../modules/router/index'

function Header() {
  return (
    <div>
      <nav className={`${style.headerWrapper}`}>
        <div className={`${styles.container} ${style.header}`}>
          <RouterLink href="/">
            <Logo />
          </RouterLink>
          <div className={style.logRegButtons}>
            <div>
              <RouterLink href="/auth">
                <Button primary rounded>
                  Войти
                </Button>
              </RouterLink>
            </div>
            <div>
              <RouterLink href="/register">
                <Button primary rounded outline>
                  Регистрация
                </Button>
              </RouterLink>
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}

export { Header }
