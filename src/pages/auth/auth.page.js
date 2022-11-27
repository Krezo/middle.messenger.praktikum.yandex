import buttonComponent from '../../components/button/buttonComponent';
import defaultLayout from '../../layout/defaultLayout/defaultLayout';

import App from '../../modules/app';
import Component from '../../modules/component';
import logoComponent from '../../components/logoComponent';
import styles from './auth.page.module.css';
import inputComponent from '../../components/input/input.component';

const state = {
  title: 'Авторизация',
  tooltip: 'Введите логин и пароль для входа',
};

const app = new App(
  new Component((props) => {
    return `
  <div class="container ${styles.authPage}">
  <form class="${styles.authForm}">
    <div class="${styles.authForm_header}">
    <Logo class="${styles.authForm_logo}" />
    <h2 class="h2">{{title}}</h2>
    <p class="${styles.authForm_tooltip}">
    {{tooltip}}
    </p>
    </div>
    <div class="${styles.authForm_inputs}">
    <Input id="login"  placeholder="Логин" />
    <Input id="password"  placeholder="Пароль" type="password" />
    </div>
    <Button type="primary" class="${styles.authForm_login_btn}">ВОЙТИ</Button>
    <div class="${styles.authForm_register_link_wrapper}">
      <a href="/register" class="${styles.authForm_register_link}">Зарегистрироваться</a>
    </div>
  </form>
  </div>
 `;
  }, state)
);

app.setLayout(defaultLayout);

app.register('Button', buttonComponent);
app.register('Logo', logoComponent);
app.register('Input', inputComponent)

app.mount(document.getElementById('app'));
