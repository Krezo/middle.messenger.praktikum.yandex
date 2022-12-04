// Components
import { Button } from '../../components/button/buttonComponent';
import { Input } from '../../components/input/input.component';
import { Logo } from '../../components/logoComponent';
import { DefaultLayout } from '../../layout/defaultLayout/defaultLayout';
// Styles
import style from './auth.page.module.css'
import styles from '../../css/app.module.css';
// Others
import { createApp, h } from '../../modules/vdom';
import { useForm } from '../../composibles/useForm';
import { maxLenght, minLenght, login, password } from '../../modules/validatorRules';

document.addEventListener('DOMContentLoaded', () => {

  const { formData: authFormData, values: authFormValues, isValid: authFormIsValid } = useForm({
    login: {
      value: '',
      validators: {
        login,
        ...minLenght(3)
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
  })


  createApp(document.getElementById('app'), () =>
  (<DefaultLayout>
    <div className={style.authPage}>
      <form className={style.authForm} onSubmit={(event: Event) => {
        event.preventDefault();
        console.log(authFormValues.value);
      }}>
        <Logo className={style.authFormLogo} />
        <h2 className={styles.h2}>Авторизация</h2>
        <p className={style.authFormTooltip}>
          Введите логин и пароль для входа
        </p>
        <div className={style.authFormInputs}>
          <Input
            onBlur={() => authFormData.login.blur()}
            toched={authFormData.login.toched}
            setValue={(value: string) => authFormData.login.value = value}
            errorMessage={authFormData.login.errorMessage}
            id="login"
            placeholder="Логин" />
          <Input
            onBlur={() => authFormData.password.blur()}
            toched={authFormData.password.toched}
            setValue={(value: string) => authFormData.password.value = value}
            errorMessage={authFormData.password.errorMessage}
            id="password"
            placeholder="Пароль" type="password" />
        </div>
        <Button type='submit' disabled={!authFormIsValid.value} primary className={style.authFormLoginBtn}>Войти</Button>
      </form>
    </div>
  </DefaultLayout>)
  ).mount();
})
