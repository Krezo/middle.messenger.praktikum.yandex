import { reactive } from '../modules/reactivity'

interface IAuthStore {
  isAuth: boolean
  signupLoading: boolean
  signupError: string
  signinLoading: boolean
  signinError: string
  getUserLoading: boolean
  getUserError: string
  logoutLoading: boolean
  logoutError: string
}
// Хранилище для данных аутентификации
const authStore = reactive<IAuthStore>({
  isAuth: false,
  signupLoading: false,
  signupError: '',
  signinLoading: false,
  signinError: '',
  getUserLoading: false,
  getUserError: '',
  logoutLoading: false,
  logoutError: '',
})

export { authStore }
