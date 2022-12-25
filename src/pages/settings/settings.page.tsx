// Components
import { DefaultLayout } from '../../layout/defaultLayout/defaultLayout'
import { h } from '../../modules/vdom'
import { Input } from '../../components/input/input.component'
import { Button } from '../../components/button/buttonComponent'
// Images
import LeftArrow from '../../images/left_arrow.svg'
import AvatarPlaceholder from '../../images/avatar_placeholder.jpeg'
// Styles
import style from './settings.page.module.css'
import styles from '../../css/app.module.css'
// Others
import { ref } from '../../modules/reactivity'
import { useForm } from '../../composibles/useForm'
import {
  name,
  login,
  minLenght,
  maxLenght,
  email,
  phone,
  password,
  confirmedPassword,
} from '../../modules/validatorRules'
import { RouterLink } from '../../modules/router/index'

type EditMode = 'none' | 'edit' | 'editPassword'

const mode = ref<EditMode>('none')

const {
  formData: changeSettingsFormData,
  isValid: changeSettingsFormIsValid,
  values: changeSettingsFormValues,
} = useForm({
  firstName: {
    value: '',
    validators: {
      ...name('именем'),
    },
  },
  secondName: {
    value: '',
    validators: {
      ...name('фамилией'),
    },
  },
  chatName: {
    value: '',
    validators: {
      chatName: (value: string) =>
        /^[^\W]+$/g.test(value) || 'Имя должно состояить из букв',
    },
  },
  login: {
    value: '',
    validators: {
      login,
      ...minLenght(3),
    },
  },
  email: {
    value: '',
    validators: {
      email,
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

const {
  formData: changePasswordFormData,
  isValid: changePasswordFormIsValid,
  values: changePasswordFormValues,
} = useForm({
  password: {
    value: '',
    validators: {
      password,
      ...minLenght(8),
      ...maxLenght(40),
    },
  },
  confirmPassword: {
    value: '',
    validators: {
      password,
      ...minLenght(8),
      ...maxLenght(40),
      ...confirmedPassword('password', 'confirmPassword'),
    },
  },
})

const onSubmitSettingsForm = (event: Event) => {
  event.preventDefault()
  if (mode.value === 'edit') {
    console.log(changeSettingsFormValues.value)
  }
  if (mode.value === 'editPassword') {
    console.log(changePasswordFormValues.value)
  }
}

export default () => (
  <DefaultLayout>
    <div className={style.settingsPage}>
      <RouterLink href="/" className={style.backToChat}>
        <div className={style.backToChatArrow}>
          <img src={LeftArrow} alt="left" />
        </div>
        <div className={[styles.h2, style.backToChatText].join(' ')}>
          Вернуться в чат
        </div>
      </RouterLink>
      <form
        action=""
        className={style.settingsForm}
        onSubmit={onSubmitSettingsForm}
      >
        <h2 className={styles.h2}>Настройки профиля</h2>
        <div className={style.avatar}>
          <img src={AvatarPlaceholder} alt="" />
          <div style={mode.value === 'edit' ? '' : 'display: none'}>
            <Button primary outline small className={style.avatarChangeBtn}>
              Сменить
            </Button>
          </div>
        </div>
        <div style={mode.value === 'none' ? '' : 'display: none'}>
          <div className={style.inputs}>
            <div>
              <div>Имя в чате</div>
              <div>Антон Безушко</div>
            </div>
            <div>
              <div>Имя</div>
              <div>Антон </div>
            </div>
            <div>
              <div>Фамилия</div>
              <div>Безушко</div>
            </div>
            <div>
              <div>Имя в чате</div>
              <div>Антон Безушко</div>
            </div>
            <div>
              <div>Логин</div>
              <div>abez</div>
            </div>
            <div>
              <div>Email</div>
              <div>bezushko.aiu@gmail.com</div>
            </div>
            <div>
              <div>Телефон</div>
              <div>8-123-123-12-12</div>
            </div>
          </div>
          <Button
            primary
            className={style.editBtn}
            onClick={() => (mode.value = 'edit')}
          >
            Редактировать
          </Button>
          <div
            onClick={() => (mode.value = 'editPassword')}
            className={[styles.link, style.editPswLink].join(' ')}
          >
            Изменить пароль
          </div>
        </div>
        <div
          style={mode.value === 'edit' ? '' : 'display: none'}
          className={style.inputsEdit}
        >
          <Input
            placeholder="Имя"
            onBlur={() => changeSettingsFormData.firstName.blur()}
            toched={changeSettingsFormData.firstName.toched}
            errorMessage={changeSettingsFormData.firstName.errorMessage}
            setValue={(value: string) =>
              (changeSettingsFormData.firstName.value = value)
            }
          />
          <Input
            placeholder="Фамилия"
            onBlur={() => changeSettingsFormData.secondName.blur()}
            toched={changeSettingsFormData.secondName.toched}
            errorMessage={changeSettingsFormData.secondName.errorMessage}
            setValue={(value: string) =>
              (changeSettingsFormData.secondName.value = value)
            }
          />
          <Input
            placeholder="Имя в чате"
            onBlur={() => changeSettingsFormData.chatName.blur()}
            toched={changeSettingsFormData.chatName.toched}
            errorMessage={changeSettingsFormData.chatName.errorMessage}
            setValue={(value: string) =>
              (changeSettingsFormData.chatName.value = value)
            }
          />
          <Input
            placeholder="Логин"
            onBlur={() => changeSettingsFormData.login.blur()}
            toched={changeSettingsFormData.login.toched}
            errorMessage={changeSettingsFormData.login.errorMessage}
            setValue={(value: string) =>
              (changeSettingsFormData.login.value = value)
            }
          />
          <Input
            placeholder="Email"
            onBlur={() => changeSettingsFormData.email.blur()}
            toched={changeSettingsFormData.email.toched}
            errorMessage={changeSettingsFormData.email.errorMessage}
            setValue={(value: string) =>
              (changeSettingsFormData.email.value = value)
            }
          />

          <Input
            placeholder="Телефон"
            onBlur={() => changeSettingsFormData.phone.blur()!}
            toched={changeSettingsFormData.phone.toched}
            errorMessage={changeSettingsFormData.phone.errorMessage}
            setValue={(value: string) =>
              (changeSettingsFormData.phone.value = value)
            }
          />

          <Button
            disabled={!changeSettingsFormIsValid.value}
            type="submit"
            primary
          >
            Сохранить
          </Button>
          <Button primary outline onClick={() => (mode.value = 'none')}>
            Отмена
          </Button>
        </div>
        <div
          style={mode.value === 'editPassword' ? '' : 'display: none'}
          className={style.inputsEdit}
        >
          <div className={style.changePasswordTooltip}>
            Введите старый и затем новый пароль
          </div>
          <Input
            onBlur={() => changePasswordFormData.password.blur()}
            toched={changePasswordFormData.password.toched}
            errorMessage={changePasswordFormData.password.errorMessage}
            setValue={(value: string) =>
              (changePasswordFormData.password.value = value)
            }
            type="password"
            placeholder="Старый пароль"
          />
          <Input
            onBlur={() => changePasswordFormData.confirmPassword.blur()}
            toched={changePasswordFormData.confirmPassword.toched}
            errorMessage={changePasswordFormData.confirmPassword.errorMessage}
            setValue={(value: string) =>
              (changePasswordFormData.confirmPassword.value = value)
            }
            type="password"
            placeholder="Пароль"
          />
          <Button
            disabled={!changePasswordFormIsValid.value}
            type="submit"
            primary
          >
            Сохранить
          </Button>
          <Button primary outline onClick={() => (mode.value = 'none')}>
            Отмена
          </Button>
        </div>
      </form>
    </div>
  </DefaultLayout>
)
