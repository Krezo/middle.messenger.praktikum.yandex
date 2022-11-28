import { Logo } from '../../components/logoComponent';
import { DefaultLayout } from '../../layout/defaultLayout/defaultLayout';
import { createApp, h } from '../../modules/vdom';

import { Error } from '../../components/error/error';

document.addEventListener('DOMContentLoaded', () => {
  createApp(document.getElementById('app'), () =>
    <DefaultLayout>
      <Error statusCode={404} text={'УПС, МЫ НЕ МОЖЕМ НАЙТИ СТРАНИЦУ'} textDiscription={'Или что-то пошло не так, или страница не существует'} />
    </DefaultLayout>
  ).mount();
})