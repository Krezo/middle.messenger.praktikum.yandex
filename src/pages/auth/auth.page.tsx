import { Logo } from '../../components/logoComponent';
import { DefaultLayout } from '../../layout/defaultLayout/defaultLayout';
import { createApp, h } from '../../modules/vdom';
import { Input } from '../../components/input/input.component';
import { ref, watchEffect } from '../../modules/reactivity';
import { Button } from '../../components/button/buttonComponent';

import style from './auth.page.module.css'
import styles from '../../css/app.module.css';

document.addEventListener('DOMContentLoaded', () => {
  const login = ref('');
  const password = ref('');

  const setLogin = (newLogin: string) => {
    login.value = newLogin
  };

  const setPassword = (newPassword: string) => {
    password.value = newPassword
  };

  watchEffect(() => {
    console.log('Login : ', login.value);
    console.log('Password : ', password.value);
  })

  createApp(document.getElementById('app'), () =>
    <DefaultLayout>
      <div className={style.authPage}>
        <form className={style.authForm}>
          <Logo className={style.authFormLogo} />
          <h2 className={styles.h2}>Авторизация</h2>
          <p className={style.authForm_tooltip}>
            Введите логин и пароль для входа
          </p>
          <div className={style.authForm_inputs}>
            <Input setValue={setLogin} id="login" placeholder="Логин" />
            <Input setValue={setPassword} id="password" placeholder="Пароль" type="password" />
          </div>
          <Button primary className={style.authFormLoginBtn}>Войти</Button>
        </form>
      </div>
    </DefaultLayout>
  ).mount();
})