// Components
import { DefaultLayout } from '../../layout/defaultLayout/defaultLayout'

import { Input } from '../../components/input/input.component'
import { Button } from '../../components/button/buttonComponent'
// Styles
import style from './register.page.module.css'
import styles from '../../css/app.module.css'
// Others
import {
  name,
  login,
  minLenght,
  maxLenght,
  email,
  password,
  phone,
} from '../../modules/validatorRules'
import { useForm } from '../../composibles/useForm'
import AuthService from '../../services/authService'
import { authStore } from '../../store/authStore'

const authService = new AuthService()

const {
  formData: registerForm,
  values: registerFormValues,
  isValid,
} = useForm({
  first_name: {
    value: 'Антон',
    validators: {
      ...name('именем'),
    },
  },
  second_name: {
    value: 'Безушко',
    validators: {
      ...name('фамилией'),
    },
  },
  login: {
    value: 'abez',
    validators: {
      login,
      ...minLenght(3),
    },
  },
  email: {
    value: 'bezushko.aiu@gmail.com',
    validators: {
      email,
    },
  },
  password: {
    value: '123123123123A',
    validators: {
      password,
      ...minLenght(8),
      ...maxLenght(40),
    },
  },
  phone: {
    value: '1111111111',
    validators: {
      phone,
      ...minLenght(10),
      ...maxLenght(15),
    },
  },
})

export default function () {
  return (
    <DefaultLayout>
      <div className={style.registerPage}>
        <form
          className={style.registerForm}
          onSubmit={(event: Event) => {
            event.preventDefault()
            authService.signup(registerFormValues.value)
          }}
        >
          {/* <Logo className={style.registerFormLogo} /> */}
          <h2 className={styles.h2}>Регистрация</h2>
          <p className={style.registerFormTooltip}>
            Введите данные для регистрации
          </p>
          <div className={style.errorMessage}>{authStore.signupError}</div>
          <div className={style.registerFormInputs}>
            <Input
              setValue={(value: string) =>
                (registerForm.first_name.value = value)
              }
              value={registerForm.first_name.value}
              onBlur={() => registerForm.first_name.blur()}
              toched={registerForm.first_name.toched}
              errorMessage={registerForm.first_name.errorMessage}
              id="signup_first_name"
              placeholder="Имя"
            />
            <Input
              setValue={(value: string) =>
                (registerForm.second_name.value = value)
              }
              value={registerForm.second_name.value}
              onBlur={() => registerForm.second_name.blur()}
              toched={registerForm.second_name.toched}
              errorMessage={registerForm.second_name.errorMessage}
              id="fam"
              placeholder="Фамилия"
            />
            <Input
              setValue={(value: string) => (registerForm.login.value = value)}
              value={registerForm.login.value}
              onBlur={() => registerForm.login.blur()}
              toched={registerForm.login.toched}
              errorMessage={registerForm.login.errorMessage}
              id="signup_login"
              placeholder="Логин"
            />
            <Input
              setValue={(value: string) => (registerForm.email.value = value)}
              value={registerForm.email.value}
              onBlur={() => registerForm.email.blur()}
              toched={registerForm.email.toched}
              errorMessage={registerForm.email.errorMessage}
              id="signup_email"
              placeholder="Email"
            />
            <Input
              setValue={(value: string) =>
                (registerForm.password.value = value)
              }
              value={registerForm.password.value}
              onBlur={() => registerForm.password.blur()}
              toched={registerForm.password.toched}
              errorMessage={registerForm.password.errorMessage}
              id="signup_password"
              type="password"
              placeholder="Пароль"
            />
            <Input
              setValue={(value: string) => (registerForm.phone.value = value)}
              value={registerForm.phone.value}
              onBlur={() => registerForm.phone.blur()}
              toched={registerForm.phone.toched}
              errorMessage={registerForm.phone.errorMessage}
              id="signup_phone"
              placeholder="Телефон"
            />
          </div>
          <Button
            disabled={!isValid.value}
            primary
            className={style.registerFormLoginBtn}
            type="submit"
            loading={authStore.signupLoading}
          >
            Регистрация
          </Button>
        </form>
      </div>
    </DefaultLayout>
  )
}
