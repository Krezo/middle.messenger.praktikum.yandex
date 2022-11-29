// Components
import { Logo } from '../../components/logoComponent';
import { DefaultLayout } from '../../layout/defaultLayout/defaultLayout';
import { createApp, h } from '../../modules/vdom';
import { Input } from '../../components/input/input.component';
import { Button } from '../../components/button/buttonComponent';
// Styles
import style from './register.page.module.css'
import styles from '../../css/app.module.css';
// Others
import { name, login, minLenght, maxLenght, email, password, phone } from '../../modules/validatorRules';
import { useForm } from '../../composibles/useForm';

document.addEventListener('DOMContentLoaded', () => {
  const { formData: registerForm, values: registerFormValues, isValid } = useForm({
    firstname: {
      value: '',
      validators: {
        ...name('именем')
      },
    },
    secondname: {
      value: '',
      validators: {
        ...name('фамилией')
      },
    },
    login: {
      value: '',
      validators: {
        login,
        ...minLenght(3)
      },
    },
    email: {
      value: '',
      validators: {
        email
      },
    },
    password: {
      value: '',
      validators: {
        password,
        ...minLenght(8),
        ...maxLenght(40)
      },
    },
    phone: {
      value: '',
      validators: {
        phone,
        ...minLenght(10),
        ...maxLenght(15),
      },
    },
  })

  createApp(document.getElementById('app'), () =>
    <DefaultLayout>
      <div className={style.registerPage}>
        <form className={style.registerForm}
          onSubmit={(event: Event) => {
            event.preventDefault()
            console.log(registerFormValues.value);
          }}>
          <Logo className={style.registerFormLogo} />
          <h2 className={styles.h2}>Регистрация</h2>
          <p className={style.registerFormTooltip}>
            Введите данные для регистрации
          </p>
          <div className={style.registerFormInputs}>
            <Input
              setValue={(value: string) => registerForm.firstname.value = value}
              onBlur={() => registerForm.firstname.blur()}
              toched={registerForm.firstname.toched}
              errorMessage={registerForm.firstname.errorMessage}
              id="firstname"
              placeholder="Имя" />
            <Input
              setValue={(value: string) => registerForm.secondname.value = value}
              onBlur={() => registerForm.secondname.blur()}
              toched={registerForm.secondname.toched}
              errorMessage={registerForm.secondname.errorMessage}
              id="fam"
              placeholder="Фамилия"
            />
            <Input
              setValue={(value: string) => registerForm.login.value = value}
              onBlur={() => registerForm.login.blur()}
              toched={registerForm.login.toched}
              errorMessage={registerForm.login.errorMessage}
              id="login"
              placeholder="Логин"
            />
            <Input
              setValue={(value: string) => registerForm.email.value = value}
              onBlur={() => registerForm.email.blur()}
              toched={registerForm.email.toched}
              errorMessage={registerForm.email.errorMessage}
              id="email"
              placeholder="Email"
            />
            <Input
              setValue={(value: string) => registerForm.password.value = value}
              onBlur={() => registerForm.password.blur()}
              toched={registerForm.password.toched}
              errorMessage={registerForm.password.errorMessage}
              id="password"
              placeholder="Пароль"
            />
            <Input
              setValue={(value: string) => registerForm.phone.value = value}
              onBlur={() => registerForm.phone.blur()}
              toched={registerForm.phone.toched}
              errorMessage={registerForm.phone.errorMessage}
              id="phone"
              placeholder="Телефон"
            />
          </div>
          <Button disabled={!isValid.value} primary className={style.registerFormLoginBtn} type='submit'>Регистрация</Button>
        </form>
      </div>
    </DefaultLayout>
  ).mount();
})