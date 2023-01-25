import AuthApi, {
  IGetUserResponseError,
  ISigninParams,
  ISigninResponseError,
  ISignupParams,
  ISignupResponseError,
} from '../api/authApi'
import { HTTPTransportResponseError } from '../modules/fetch'
import { Router } from '../modules/router/index'
import { authStore } from '../store/authStore'
import { loginUser, logoutUser } from '../store/userStore'

/**
 * Класс для работы с аутентификацией
 *
 * https://ya-praktikum.tech/api/v2/swagger/#/Auth
 */
export default class AuthService {
  private readonly api: AuthApi

  private __instance: AuthService

  constructor(private store = authStore, private router = new Router()) {
    if (this.__instance) {
      return this.__instance
    }
    this.api = new AuthApi()
    this.__instance = this
  }

  public setStore(store: typeof authStore) {
    this.store = store
  }

  public resetRouter() {
    this.router.reset()
  }

  /**
   * Регистрация пользователя
   */
  async signup(params: ISignupParams) {
    try {
      this.store.signupError = ''
      this.store.signupLoading = true
      await this.api.signup(params)
      this.getUser()
      this.router.go('/messenger')
    } catch (error: unknown) {
      if (error instanceof HTTPTransportResponseError) {
        const responseError: ISignupResponseError = error.response
        this.store.signupError = responseError.reason
      } else {
        console.error(error)
      }
    } finally {
      this.store.signupLoading = false
    }
  }

  /**
   * Получение даннных пользователя
   * @param force Если пользователь уже авторизован, не выполнять запрос
   */
  async getUser(force = false) {
    if (!force && this.isAuth()) {
      return
    }
    try {
      this.store.getUserError = ''
      this.store.getUserLoading = true
      const { response } = await this.api.user()
      this.store.isAuth = true
      loginUser(response)
    } catch (error: unknown) {
      if (error instanceof HTTPTransportResponseError) {
        const responseError: IGetUserResponseError = error.response
        this.store.getUserError = responseError.reason
      } else {
        // console.log(error)
      }
    } finally {
      this.store.getUserLoading = false
    }
  }

  /**
   * Вход
   */
  async signin(data: ISigninParams) {
    try {
      this.store.signinLoading = true
      this.store.signinError = ''
      await this.api.signin(data)
      this.router.go('/messenger')
      this.getUser(true)
    } catch (error: unknown) {
      if (error instanceof HTTPTransportResponseError) {
        const responseError: ISigninResponseError = error.response
        this.store.signinError = responseError.reason
      } else {
        // console.log(error)
      }
    } finally {
      this.store.signinLoading = false
    }
  }

  /**
   * Выход
   */
  async signout() {
    try {
      this.store.logoutError = ''
      this.store.logoutLoading = true
      await this.api.logout()
      this.store.isAuth = false
      logoutUser()
      this.router.go('/')
    } catch (error: unknown) {
      if (error instanceof HTTPTransportResponseError) {
        const responseError: ISigninResponseError = error.response
        this.store.logoutError = responseError.reason
      } else {
        // console.log(error)
      }
    } finally {
      this.store.logoutLoading = false
    }
  }

  /**
   * Проверка авторизован ли пользыватель
   */
  public isAuth() {
    return authStore.isAuth
  }
}
