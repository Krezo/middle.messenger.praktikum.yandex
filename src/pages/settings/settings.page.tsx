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
import { reactive, ref, watch, watchEffect } from '../../modules/reactivity'
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
import { clearUserError, userStore } from '../../store/userStore'
import AuthService from '../../services/authService'
import UserService from '../../services/userService'
import { Spinner } from '../../components/spinner/spinner.component'
import { authStore } from '../../store/authStore'
import { API_RESIURCE_URL } from '../../consts'

const userService = new UserService()
const authService = new AuthService()

type EditMode = 'none' | 'edit' | 'editPassword'

const mode = ref<EditMode>('none')

const {
  formData: changeSettingsFormData,
  isValid: changeSettingsFormIsValid,
  values: changeSettingsFormValues,
} = useForm({
  first_name: {
    value: '',
    validators: {
      ...name('именем'),
    },
  },
  second_name: {
    value: '',
    validators: {
      ...name('фамилией'),
    },
  },
  display_name: {
    value: '',
    validators: {
      display_name: (value: string) =>
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
  oldPassword: {
    value: '',
    validators: {
      password,
      ...minLenght(8),
      ...maxLenght(40),
    },
  },
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

const backToSettings = () => {
  mode.value = 'none'
  resetForms()
  clearUserError()
}

const resetForms = () => {
  initUser()
  clearAvatarForm()
}

const initUser = () => {
  changeSettingsFormData.first_name.value = userStore.user.first_name || ''
  changeSettingsFormData.second_name.value = userStore.user.second_name || ''
  changeSettingsFormData.display_name.value = userStore.user.display_name || ''
  changeSettingsFormData.email.value = userStore.user.email || ''
  changeSettingsFormData.login.value = userStore.user.login || ''
  changeSettingsFormData.phone.value = userStore.user.phone || ''
}

const clearAvatarForm = () => {
  avatarErrorMessage.value = ''
  avatarFile.value.splice(0)
}

const onSubmitSettingsForm = async (event: Event) => {
  event.preventDefault()
  // Изменение настроек
  if (mode.value === 'edit') {
    await userService.changeProfile(changeSettingsFormValues.value)
    if (!userStore.changeUserError) {
      backToSettings()
    }
  }
  // Изменение пароля
  if (mode.value === 'editPassword') {
    await userService.changePassword(
      changePasswordFormValues.value.confirmPassword,
      changePasswordFormValues.value.oldPassword
    )
    if (!userStore.changePasswordError) {
      backToSettings()
    }
  }
}

const avatarFile = ref<File[]>([])
const avatarErrorMessage = ref('')

const changeAvatar = async (event: Event) => {
  event.preventDefault()
  avatarErrorMessage.value = ''
  if (avatarFile.value.length === 0) {
    avatarErrorMessage.value = 'Укажите файл'
    return
  }
  userService.changeAvatar(avatarFile.value[0]).then(() => {
    backToSettings()
  })
}

watch(
  () => avatarFile.value,
  (avatar) => {
    if (avatar.length === 0) {
      avatarErrorMessage.value = 'Укажите файл'
    } else {
      avatarErrorMessage.value = ''
    }
  }
)

authService.getUser().then(() => {
  initUser()
})

const logoutUser = () => {
  if (confirm('Вы действительно хотите выйти?')) {
    authService.signout()
  }
}

export default function () {
  return (
    <DefaultLayout>
      <div className={style.settingsPage}>
        <RouterLink href="/messenger" className={style.backToChat}>
          <div className={style.backToChatArrow}>
            <img src={LeftArrow} alt="left" />
          </div>
          <div className={[styles.h2, style.backToChatText].join(' ')}>
            Вернуться в чат
          </div>
        </RouterLink>

        <form
          id="settingsForm"
          className={style.settingsForm}
          onSubmit={onSubmitSettingsForm}
        >
          {authStore.getUserLoading && (
            <div className={style.inputLoader}>
              <Spinner size="lg" primary />
            </div>
          )}
          <div className={styles.formErrorMessage}>
            {userStore.changeUserError}
            {userStore.changePasswordError}
          </div>
          <div className={style.formHeader}>
            <h2 className={styles.h2}>Настройки профиля</h2>
            <span onClick={logoutUser} className={styles.link}>
              Выйти
            </span>
          </div>
          <div
            className={style.inputsWrapper}
            style={mode.value === 'none' ? '' : 'display: none'}
          >
            <div className={style.avatarWrapper}>
              <div className={style.avatar}>
                <img
                  src={API_RESIURCE_URL + userStore.user.avatar}
                  alt="avatar"
                />
              </div>
            </div>
            <div className={style.name}>{userStore.user.first_name}</div>

            <div className={style.inputs}>
              <div>
                <div>Имя в чате</div>
                <div>{userStore.user.display_name}</div>
              </div>
              <div>
                <div>Фамилия</div>
                <div>{userStore.user.second_name}</div>
              </div>
              <div>
                <div>Логин</div>
                <div>{userStore.user.login}</div>
              </div>
              <div>
                <div>Email</div>
                <div>{userStore.user.email}</div>
              </div>
              <div>
                <div>Телефон</div>
                <div>{userStore.user.phone}</div>
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
            <form onSubmit={changeAvatar}>
              <div className={styles.formErrorMessage}>
                {userStore.changeAvatartError}
              </div>
              <Input
                id="avatar"
                value={avatarFile.value}
                setValue={(value: File[]) => (avatarFile.value = value)}
                type="file"
                toched
                errorMessage={avatarErrorMessage.value}
                label="Аватар"
              />
              <div className={style.inputsEdit}>
                <Button
                  primary
                  type="submit"
                  loading={userStore.loadingChangeAvatart}
                >
                  Изменить
                </Button>
              </div>
            </form>

            <Input
              label="Имя в чате"
              id="display_name"
              placeholder="Имя в чате"
              value={changeSettingsFormData.display_name.value}
              onBlur={() => changeSettingsFormData.display_name.blur()}
              toched={changeSettingsFormData.display_name.toched}
              errorMessage={changeSettingsFormData.display_name.errorMessage}
              setValue={(value: string) =>
                (changeSettingsFormData.display_name.value = value)
              }
            />

            <Input
              label="Имя"
              id="first_name"
              placeholder="Имя"
              value={changeSettingsFormData.first_name.value}
              onBlur={() => changeSettingsFormData.first_name.blur()}
              toched={changeSettingsFormData.first_name.toched}
              errorMessage={changeSettingsFormData.first_name.errorMessage}
              setValue={(value: string) =>
                (changeSettingsFormData.first_name.value = value)
              }
            />

            <Input
              label="Фамилия"
              id="second_name"
              placeholder="Фамилия"
              value={changeSettingsFormData.second_name.value}
              onBlur={() => changeSettingsFormData.second_name.blur()}
              toched={changeSettingsFormData.second_name.toched}
              errorMessage={changeSettingsFormData.second_name.errorMessage}
              setValue={(value: string) =>
                (changeSettingsFormData.second_name.value = value)
              }
            />

            <Input
              label="Логин"
              id="login"
              placeholder="Логин"
              value={changeSettingsFormData.login.value}
              onBlur={() => changeSettingsFormData.login.blur()}
              toched={changeSettingsFormData.login.toched}
              errorMessage={changeSettingsFormData.login.errorMessage}
              setValue={(value: string) =>
                (changeSettingsFormData.login.value = value)
              }
            />

            <Input
              label="Email"
              id="email"
              placeholder="Email"
              value={changeSettingsFormData.email.value}
              onBlur={() => changeSettingsFormData.email.blur()}
              toched={changeSettingsFormData.email.toched}
              errorMessage={changeSettingsFormData.email.errorMessage}
              setValue={(value: string) =>
                (changeSettingsFormData.email.value = value)
              }
            />

            <Input
              label="Телефон"
              id="phone"
              placeholder="Телефон"
              value={changeSettingsFormData.phone.value}
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
              loading={userStore.loadingChangeUser}
              primary
            >
              Сохранить
            </Button>
            <Button primary outline onClick={backToSettings}>
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
              id="old_password"
              onBlur={() => changePasswordFormData.oldPassword.blur()}
              toched={changePasswordFormData.oldPassword.toched}
              errorMessage={changePasswordFormData.oldPassword.errorMessage}
              setValue={(value: string) =>
                (changePasswordFormData.oldPassword.value = value)
              }
              type="password"
              placeholder="Старый пароль"
            />
            <Input
              id="password"
              onBlur={() => changePasswordFormData.password.blur()}
              toched={changePasswordFormData.password.toched}
              errorMessage={changePasswordFormData.password.errorMessage}
              setValue={(value: string) =>
                (changePasswordFormData.password.value = value)
              }
              type="password"
              placeholder="Пароль"
            />
            <Input
              id="confirmed_password"
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
              loading={userStore.loadingChangePassword}
              disabled={!changePasswordFormIsValid.value}
              type="submit"
              primary
            >
              Сохранить
            </Button>
            <Button primary outline onClick={backToSettings}>
              Отмена
            </Button>
          </div>
        </form>
      </div>
    </DefaultLayout>
  )
}
