
import errorLayout from '../../layout/errorLayout/errorLayout';
import App from '../../modules/app';
import Component from '../../modules/component';
import styles from './500.page.module.css';

const errorProps = {
  statusCode: '500',
  text: 'ПРИ ЗАГРУЗКЕ СТРАНИЦЫ ПРОИЗОШЛА ОШИБКА',
  textDiscription: 'Попробуйте перезагрузить страницу, если ошибка сохраняется обратитесь в техническую поддержку',
};

const app = new App(
  new Component((props) => ``)
);

app.setLayout(errorLayout, errorProps);
app.mount(document.getElementById('app'));
