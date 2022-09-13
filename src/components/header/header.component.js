import Component from '../../modules/component';
import buttonComponent from '../button/buttonComponent';
import logoComponent from '../logoComponent';
import classes from './header.module.css';
import appStyles from '../../css/app.module.css';

const component = new Component(
  (props) => `
<nav class="${classes.header_wrapper}">
  <div class="${appStyles.container} ${classes.header}">
    <a href="/"><Logo /></a>
    <div class="${classes.log_reg_buttons}">
    <div><Button size="small" type="primary" rounded>Войти</Button></div>
    <div><Button size="small" type="secondary" rounded>Регистрация</Button></div>
    </div>
  </div>
</nav>
`
);

component.register('Logo', logoComponent);
component.register('Button', buttonComponent);

export default component;
