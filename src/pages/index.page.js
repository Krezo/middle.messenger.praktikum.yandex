import defaultLayout from '../layout/defaultLayout/defaultLayout';

import App from '../modules/app';
import Component from '../modules/component';
import appStyles from "../css/app.module.css";

const app = new App(
  new Component((props) => {
    return `<div class="${appStyles.container}">
    <h2 class=" ${appStyles.h2}" style="margin-top: 40px;">Заглушка для страницы чатов</h2>
    <h3 class=" ${appStyles.h3}" style="margin-top: 40px;">Готовые страницы</h3>
    <div class="${appStyles.flex} ${appStyles.flex_col}">
      <a href="/404" class="${appStyles.link}">Страница 404</a>
      <a href="/500" class="${appStyles.link}">Страница 50*</a>
      <a href="/auth" class="${appStyles.link}">Авторизация</a>
      <a href="/settings" class="${appStyles.link}">Настройки пользователя</a>
      <a href="/edit_settings" class="${appStyles.link}">Изменение настроек</a>
      <a href="/change_password" class="${appStyles.link}">Смена пароля</a>
      <a href="/register" class="${appStyles.link}">Регистрация</a>
    </div>
    </div>`;
  })
);

app.setLayout(defaultLayout);

app.mount(document.getElementById('app'));
