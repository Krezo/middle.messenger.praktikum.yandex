// Components
import { DefaultLayout } from '../../layout/defaultLayout/defaultLayout'
import { Error } from '../../components/error/error'
// Others
import { h } from '../../modules/vdom'
export default () => (
  <DefaultLayout>
    <Error
      statusCode={500}
      text={'ПРИ ЗАГРУЗКЕ СТРАНИЦЫ ПРОИЗОШЛА ОШИБКА'}
      textDiscription={
        'Попробуйте перезагрузить страницу, если ошибка сохраняется обратитесь в техническую поддержку'
      }
    />
  </DefaultLayout>
)
