import { API_BASE_URL } from '../consts'
import { HTTPTransport } from '../modules/fetch'
import { IApiError } from '../types/apiError'
import { IUser } from '../types/user'

const authApiInstance = new HTTPTransport(API_BASE_URL + '/auth', {
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    Content: 'application/json',
  },
})

export interface ISignupParams extends Omit<IUser, 'id' | 'avatar'> {}
export interface ISignupResponseOK {
  id: number
}
export interface ISignupResponseError extends IApiError {}

export interface IGetUserResponseOK extends IUser {}
export interface IGetUserResponseError extends IApiError {}

export interface ISigninResponseOK {}

export interface ISigninResponseError extends IApiError {}

export interface ISigninParams {
  login: string
  password: string
}

/**
 * Клас для работы с запросами API аутентификацции
 *
 * https://ya-praktikum.tech/api/v2/swagger/#/Auth
 */
export default class AuthApi {
  signup(data: ISignupParams) {
    return authApiInstance.post<ISignupResponseOK>('/signup', {
      data,
    })
  }

  signin(data: ISigninParams) {
    return authApiInstance.post<ISigninResponseOK>('/signin', {
      data,
    })
  }

  user() {
    return authApiInstance.get<IGetUserResponseOK>('/user')
  }

  logout() {
    return authApiInstance.post('/logout')
  }
}
