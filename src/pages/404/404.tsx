// Componetns
import { Error } from '../../components/error/error'
import { DefaultLayout } from '../../layout/defaultLayout/defaultLayout'
// Others

export default function () {
  return (
    <DefaultLayout>
      <Error
        statusCode={404}
        text="УПС, МЫ НЕ МОЖЕМ НАЙТИ СТРАНИЦУ"
        textDiscription="Или что-то пошло не так, или страница не существует"
      />
    </DefaultLayout>
  )
}
