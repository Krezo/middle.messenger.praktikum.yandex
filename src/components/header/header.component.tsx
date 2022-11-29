import style from './header.module.css';
import styles from '../../css/app.module.css';

import { Button } from '../button/buttonComponent';
import { Logo } from '../logoComponent';

import { h } from '../../modules/vdom';

function Header() {
  return (
    <div>
      <nav className={`${style.headerWrapper}`}>
        <div className={`${styles.container} ${style.header}`}>
          <a href="/"><Logo /></a>
          <div className={style.logRegButtons}>
            <div><Button link href='/auth' primary rounded>Войти</Button></div>
            <div><Button link href='/register' primary rounded outline>Регистрация</Button></div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export {
  Header,
};
