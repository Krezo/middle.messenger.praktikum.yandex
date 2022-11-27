import buttonComponent from '../../components/button/buttonComponent';
import defaultLayout from '../../layout/defaultLayout/defaultLayout';

import App from '../../modules/app';
import Component from '../../modules/component';
import styles from './change_password.page.module.css';
import inputComponent from '../../components/input/input.component';
import LeftArrow from "/src/images/left_arrow.svg";
import appStyle from '../../css/app.module.css';

const state = {
  title: 'Настройки профиля',
  tooltip: 'Введите старый и затем новый пароль',
};

const app = new App(
  new Component((props) => {
    return `
  <div class="${appStyle.container} ${styles.changePasswordPage}">
  <div class="${styles.backToChat}">
    <a href="/" class="${styles.backToChat_inner} href="/">
      <div class="${styles.backToChat_button}">
        <img src="${LeftArrow}" alt="back to chat" />
      </div>
      <h3 class="${[appStyle.h3, appStyle.text_primary].join(' ')}">Вернуться в чат</h3>
    </a>
  </div>
  <form class="${styles.changePasswordForm}">
    <div class="${styles.changePasswordForm_header}">
    <h2 class="${appStyle.h2}">{{title}}</h2>
    <p class="${styles.changePasswordForm_tooltip}">
    {{tooltip}}
    </p>
    </div>
    <div class="${styles.changePasswordForm_inputs}">
    <Input type="password"  placeholder="Старый пароль" />
    <Input type="password"  placeholder="Новый пароль" />
    </div>
    <Button type="primary" class="${styles.changePasswordForm_login_btn}">СОХРАНИТЬ</Button>
    <div>
      <a href="#"><Button type="secondary" class="${styles.changePasswordForm_login_btn}">ОТМЕНА</Button> </div>
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
