// Components
import { DefaultLayout } from '../../layout/defaultLayout/defaultLayout'
import { Error } from '../../components/error/error'
// Others

export default function () {
  return (
    <DefaultLayout>
      <Error
        statusCode={500}
        text="ПРИ ЗАГРУЗКЕ СТРАНИЦЫ ПРОИЗОШЛА ОШИБКА"
        textDiscription="Попробуйте перезагрузить страницу, если ошибка сохраняется обратитесь в техническую поддержку"
      />
    </DefaultLayout>
  )
}
