import buttonComponent from '../../components/button/buttonComponent';
import defaultLayout from '../../layout/defaultLayout/defaultLayout';

import App from '../../modules/app';
import Component from '../../modules/component';
import styles from './settings.page.module.css';
import inputComponent from '../../components/input/input.component';
import LeftArrow from "/src/images/left_arrow.svg";
import appStyle from '../../css/app.module.css';
import avatarPlaceholder from '/src/images/avatar_placeholder.jpeg'

const state = {
  title: 'Настройки профиля',
  tooltip: 'Введите старый и затем новый пароль',
  settings: [
    {
      name: 'Имя в чате',
      value: 'Антон Безушко',
    },
    {
      name: 'Имя',
      value: 'Антон',
    },
    {
      name: 'Фамилия',
      value: 'Безушко',
    },
    {
      name: 'Логин',
      value: 'abez',
    },
    {
      name: 'Email',
      value: 'bezushko.aiu@gmail.com',
    },
    {
      name: 'Телефон',
      value: '8-999-123-12-12',
    },
  ]
};

const app = new App(
  new Component((props) => {
    return `
  <div class="${appStyle.container} ${styles.settingsPage}">
  <div class="${styles.backToChat}">
    <a href="/" class="${styles.backToChat_inner} href="/">
      <div class="${styles.backToChat_button}">
        <img src="${LeftArrow}" alt="back to chat" />
      </div>
      <h3 class="${[appStyle.h3, appStyle.text_primary].join(' ')}">Вернуться в чат</h3>
    </a>
  </div>
  <form class="${styles.settingsForm}">
    <div class="${styles.settingsForm_header}">
    <h2 class="${appStyle.h2}">{{title}}</h2>
    </div>
    <img class="${styles.settingsForm_avatar}" src="${avatarPlaceholder}" />
    <div :for="setting in settings">
      <div class="${styles.settingsForm_field}">
        <div class="${styles.settingsForm_field_name}">{{setting.name}}</div>
        <div class="${styles.settingsForm_field_value}">{{setting.value}}</div>
      </div>
    </div>
    <Button type="primary" class="${styles.editButton}">РЕДАКТИРОВАТЬ</Button>
    <div class="${styles.change_password}">
      <a href="/" class="${styles.change_password_link}">Изменить пароль</a>
    </div>
  </form>
  </div>
 `;
  }, state)
);

app.setLayout(defaultLayout);

app.register('Button', buttonComponent);
app.register('Input', inputComponent)

app.mount(document.getElementById('app'));
