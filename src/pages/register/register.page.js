import buttonComponent from '../../components/button/buttonComponent';
import defaultLayout from '../../layout/defaultLayout/defaultLayout';

import App from '../../modules/app';
import Component from '../../modules/component';
import logoComponent from '../../components/logoComponent';
import styles from './register.page.module.css';
import inputComponent from '../../components/input/input.component';

const state = {
  title: 'Регистрация',
  tooltip: 'Введите данные для регистрации',
};

const app = new App(
  new Component((props) => {
    return `
  <div class="container ${styles.register_page}">
  <form class="${styles.register_form}">
    <div class="${styles.register_form_header}">
    <Logo class="${styles.register_form_logo}" />
    <h2 class="h2">{{title}}</h2>
    <p class="${styles.register_form_tooltip}">
    {{tooltip}}
    </p>
    </div>
    <div class="${styles.register_form_inputs}">
    <Input id="first_name"  placeholder="Имя" />
    <Input id="second_name"  placeholder="Фамилия" />
    <Input id="login"  placeholder="Логин" />
    <Input id="email"  placeholder="Email" type="email" />
    <Input id="phone"  placeholder="Телефон" type="tel" />
    <Input id="password"  placeholder="Пароль" type="password" />
    </div>
    <Button type="primary" class="${styles.register_form_login_btn}">РЕГИСТРАЦИЯ</Button>
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
