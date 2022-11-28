import { Logo } from '../../components/logoComponent';
import { DefaultLayout } from '../../layout/defaultLayout/defaultLayout';
import { createApp, h } from '../../modules/vdom';

import { Error } from '../../components/error/error';

document.addEventListener('DOMContentLoaded', () => {
  createApp(document.getElementById('app'), () =>
    <DefaultLayout>
      <Error
        statusCode={500}
        text={'ПРИ ЗАГРУЗКЕ СТРАНИЦЫ ПРОИЗОШЛА ОШИБКА'}
        textDiscription={'Попробуйте перезагрузить страницу, если ошибка сохраняется обратитесь в техническую поддержку'} />
    </DefaultLayout>
  ).mount();
})