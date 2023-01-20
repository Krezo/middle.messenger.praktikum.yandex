import { API_BASE_URL } from '../consts'
import { HTTPTransport } from '../modules/fetch'
import { IApiError } from '../types/apiError'
import { IUser } from '../types/user'
import { createFormData } from '../utils/index'

const userApiInstance = new HTTPTransport(API_BASE_URL + '/user', {
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    Content: 'application/json',
  },
})

export interface IProfileParams extends Omit<IUser, 'id' | 'avatar'> {}
export interface IProfileResponseOK extends Omit<IUser, 'id' | 'avatar'> {}
export interface IProfileResponseError extends IApiError {}

export interface IProfileAvatarParams {
  avatar: File
}
export interface IProfileAvatarResponseOk {}
export interface IProfileAvatarResponseError extends IApiError {}

export interface IPasswordParams {
  oldPassword: string
  newPassword: string
}
export interface IPasswordResponseOk {}
export interface IPasswordResponseError extends IApiError {}

export interface IUserParams {
  id: string
}
export interface IUserOk extends IUser {}
export interface IUserError extends IUser {}

export interface IUserSearchResponseOk extends IUser {}

export interface IUserChangeProfileResponse extends IUser {}
export interface IGetTokenResponse {
  token: string
}
/**
 * Клас для работы с запросами API пользователя
 *
 * https://ya-praktikum.tech/api/v2/swagger/#/Users
 */
export default class UserApi {
  changeProfile(data: IProfileParams) {
    return userApiInstance.put<IUserChangeProfileResponse>('/profile', {
      data,
    })
  }

  changeProfileAvatar(data: IProfileAvatarParams) {
    return userApiInstance.put<IUser>('/profile/avatar', {
      formData: data,
    })
  }

  changePassword(data: IPasswordParams) {
    return userApiInstance.put('/password', {
      data,
    })
  }

  user(id: number) {
    return userApiInstance.get<IUser>(`/${id}`, {
      params: {
        id,
      },
    })
  }

  userSearch(login: string) {
    return userApiInstance.post<IUser[]>('/search', {
      data: {
        login,
      },
    })
  }

  token(chatId: string) {
    return userApiInstance.get<IGetTokenResponse>(`/token/${chatId}`, {})
  }
}
