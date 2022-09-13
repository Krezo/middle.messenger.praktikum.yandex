
import errorLayout from '../../layout/errorLayout/errorLayout';
import App from '../../modules/app';
import Component from '../../modules/component';

const errorProps = {
  statusCode: '404',
  text: 'УПС, МЫ НЕ МОЖЕМ НАЙТИ СТРАНИЦУ',
  textDiscription: 'Или что-то пошло не так, или страница не существует',
};

const app = new App(
  new Component((props) => ``)
);

app.setLayout(errorLayout, errorProps);
app.mount(document.getElementById('app'));
