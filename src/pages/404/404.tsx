// Componetns
import { Error } from '../../components/error/error';
import { DefaultLayout } from '../../layout/defaultLayout/defaultLayout';
// Others
import { createApp, h } from '../../modules/vdom';

document.addEventListener('DOMContentLoaded', () => {
  createApp(document.getElementById('app'), () =>
    <DefaultLayout>
      <Error statusCode={404} text={'УПС, МЫ НЕ МОЖЕМ НАЙТИ СТРАНИЦУ'} textDiscription={'Или что-то пошло не так, или страница не существует'} />
    </DefaultLayout>
  ).mount();
})