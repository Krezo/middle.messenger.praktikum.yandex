import UserApi, { IProfileParams } from '../api/userApi'
import { HTTPTransportResponseError } from '../modules/fetch'
import { Router } from '../modules/router/index'
import { reassignUser, userStore } from '../store/userStore'
import { IApiError } from '../types/apiError'

/**
 * Класс для работы с аутентификацией
 *
 * https://ya-praktikum.tech/api/v2/swagger/#/Auth
 */
export default class UserService {
  private readonly store: typeof userStore
  private readonly api: UserApi
  static __instance: UserService
  constructor() {
    if (UserService.__instance) {
      return UserService.__instance
    }
    this.api = new UserApi()
    this.store = userStore
    UserService.__instance = this
  }

  /**
   * Изменение настроек профиля
   */
  async changeProfile(params: IProfileParams) {
    this.store.loadingChangeUser = true
    this.store.changeUserError = ''
    try {
      const { response } = await this.api.changeProfile(params)
      reassignUser(response)
    } catch (error) {
      if (error instanceof HTTPTransportResponseError) {
        const responseError: IApiError = error.response
        this.store.changeUserError = responseError.reason
      }
      console.error(error)
    } finally {
      this.store.loadingChangeUser = false
    }
  }

  /**
   * Изменение аватара
   */
  async changeAvatar(avatar: File) {
    this.store.loadingChangeAvatart = true
    this.store.changeAvatartError = ''
    try {
      const { response } = await this.api.changeProfileAvatar({
        avatar,
      })
      reassignUser(response)
    } catch (error) {
      if (error instanceof HTTPTransportResponseError) {
        const responseError: IApiError = error.response
        this.store.changeAvatartError = responseError.reason
      }
      console.error(error)
    } finally {
      this.store.loadingChangeAvatart = false
    }
  }

  /**
   * Изменение пароля
   */
  async changePassword(newPassword: string, oldPassword: string) {
    this.store.loadingChangePassword = true
    this.store.changePasswordError = ''
    try {
      await this.api.changePassword({
        newPassword,
        oldPassword,
      })
    } catch (error) {
      if (error instanceof HTTPTransportResponseError) {
        const responseError: IApiError = error.response
        this.store.changePasswordError = responseError.reason
      }
      console.error(error)
    } finally {
      this.store.loadingChangePassword = false
    }
  }
}
