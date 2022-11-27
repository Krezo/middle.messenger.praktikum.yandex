import buttonComponent from '../../components/button/buttonComponent';
import defaultLayout from '../../layout/defaultLayout/defaultLayout';

import App from '../../modules/app';
import Component from '../../modules/component';
import styles from './edit_settings.page.module.css';
import inputComponent from '../../components/input/input.component';
import LeftArrow from "/src/images/left_arrow.svg";
import appStyle from '../../css/app.module.css';
import avatarPlaceholder from '/src/images/avatar_placeholder.jpeg'

const state = {
  title: 'Настройки профиля',
  tooltip: 'Введите старый и затем новый пароль',
  settings: {
    first_name: 'Антон',
    second_name: 'Безушко',
    display_name: 'Антон Безушко',
    login: 'abez',
    email: 'bezushko.aiu@gmail.com',
    phone: '8-999-123-12-12'
  }
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
  <form class="${styles.editSettingsForm}">
    <div class="${styles.editSettingsForm_header}">
    <h2 class="${appStyle.h2}">{{title}}</h2>
    </div>
    <div class="${styles.editSettingsForm_avatar_wrapper}">
      <img class="${styles.editSettingsForm_avatar}" src="${avatarPlaceholder}" />
      <Button size="small" type="secondary" class="${styles.editSettingsForm_avatar_change_button}">Сменить</Button>
    </div>
    <div class="${styles.editSettingsForm_inputs}">
    <Input id="avatar" type="file" style="display: none;" />
    <Input id="first_name" placeholder="Имя" value="{{settings.first_name}}"/>
    <Input id="second_name" placeholder="Фамилия" value="{{settings.second_name}}"/>
    <Input id="display_name" placeholder="Имя в чате" value="{{settings.display_name}}"/>
    <Input id="login" placeholder="Логин" value="{{settings.login}}"/>
    <Input id="email" placeholder="Email" value="{{settings.email}}"/>
    <Input id="phone" placeholder="Телефон" value="{{settings.phone}}"/>
    </div>
    <Button type="primary" class="${styles.editButton}">СОХРАНИТЬ</Button>
    <Button type="secondary" class="${styles.editButton}">ОТМЕНА</Button>
  </form>
  </div>
 `;
  }, state)
);

app.setLayout(defaultLayout);

app.register('Button', buttonComponent);
app.register('Input', inputComponent)

app.mount(document.getElementById('app'));
