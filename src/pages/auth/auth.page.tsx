// Components
import { Button } from '../../components/button/buttonComponent'
import { Input } from '../../components/input/input.component'
import { Logo } from '../../components/logoComponent'
import { DefaultLayout } from '../../layout/defaultLayout/defaultLayout'
// Styles
import style from './auth.page.module.css'
import styles from '../../css/app.module.css'
// Others
import { h } from '../../modules/vdom'
import { useForm } from '../../composibles/useForm'
import {
  maxLenght,
  minLenght,
  login,
  password,
} from '../../modules/validatorRules'
import { RouterLink } from '../../modules/router/index'
import AuthService from '../../services/authService'
import { authStore } from '../../store/authStore'

const authService = new AuthService()

const {
  formData: authFormData,
  values: authFormValues,
  isValid: authFormIsValid,
} = useForm({
  login: {
    value: '',
    validators: {
      // login,
      ...minLenght(3),
    },
  },
  password: {
    value: '',
    validators: {
      // password,
      ...minLenght(8),
      ...maxLenght(40),
    },
  },
})

const signin = (event: Event) => {
  event.preventDefault()
  authService.signin(authFormValues.value)
}

export default function () {
  return (
    <DefaultLayout>
      <div className={style.authPage}>
        <form className={style.authForm} onSubmit={signin}>
          {/* <Logo className={style.authFormLogo} /> */}
          <h2 className={styles.h2}>Авторизация</h2>
          <p className={style.authFormTooltip}>
            Введите логин и пароль для входа
          </p>
          <div className={style.errorMessage}>{authStore.signinError}</div>
          <div className={style.authFormInputs}>
            <Input
              onBlur={() => authFormData.login.blur()}
              toched={authFormData.login.toched}
              value={authFormData.login.value}
              setValue={(value: string) => (authFormData.login.value = value)}
              errorMessage={authFormData.login.errorMessage}
              id="auth_login"
              placeholder="Логин"
            />
            <Input
              onBlur={() => authFormData.password.blur()}
              toched={authFormData.password.toched}
              value={authFormData.password.value}
              setValue={(value: string) =>
                (authFormData.password.value = value)
              }
              errorMessage={authFormData.password.errorMessage}
              id="auth_password"
              placeholder="Пароль"
              type="password"
            />
          </div>
          <Button
            type="submit"
            disabled={!authFormIsValid.value}
            primary
            loading={authStore.signinLoading}
            className={style.authFormLoginBtn}
          >
            Войти
          </Button>
          <div>
            <RouterLink className={styles.link} href="/sign-up">
              Регистрация
            </RouterLink>
          </div>
        </form>
      </div>
    </DefaultLayout>
  )
}
