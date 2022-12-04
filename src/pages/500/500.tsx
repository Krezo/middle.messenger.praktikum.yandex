// Components
import { DefaultLayout } from '../../layout/defaultLayout/defaultLayout';
import { Error } from '../../components/error/error';
// Others
import { createApp, h } from '../../modules/vdom';

document.addEventListener('DOMContentLoaded', () => {
  createApp(document.getElementById('app'), () =>
  (<DefaultLayout>
    <Error
      statusCode={500}
      text={'ПРИ ЗАГРУЗКЕ СТРАНИЦЫ ПРОИЗОШЛА ОШИБКА'}
      textDiscription={'Попробуйте перезагрузить страницу, если ошибка сохраняется обратитесь в техническую поддержку'} />
  </DefaultLayout>)
  ).mount();
})
