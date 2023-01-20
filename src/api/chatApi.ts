import { API_BASE_URL } from '../consts'
import { HTTPTransport } from '../modules/fetch'
import { Chat } from '../types/chat'
import { IUserWithRole } from '../types/user'
import { createFormData } from '../utils/index'

const chatApiInstance = new HTTPTransport(API_BASE_URL + '/chats', {
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    Content: 'application/json',
  },
})

export interface GetChatMethodParams {
  offset?: number
  limit?: number
  title?: number
}

interface DeleteChatMethodResponse {
  userId: number
  result: {
    id: number
    title: string
    avatar: string
  }
}

export interface GetChatUsersMethodsParams {
  offset?: number
  limit?: number
  name?: number
  email?: number
}

interface CreateTokenResponse {
  token: string
}

/**
 * Клас для работы с запросами API чатов
 *
 * https://ya-praktikum.tech/api/v2/swagger/#/Chats
 */
export default class ChatApi {
  getChats(params?: GetChatMethodParams) {
    return chatApiInstance.get<Chat[]>('/', {
      params,
    })
  }

  createChat(title: string) {
    return chatApiInstance.post<{ id: number }>('/', {
      data: {
        title,
      },
    })
  }

  getChatUsers(chatId: number, params: GetChatUsersMethodsParams) {
    return chatApiInstance.get<IUserWithRole[]>(`/${chatId}/users`, {
      data: {
        ...params,
      },
    })
  }

  uploadAvatar(chatId: number, avatar: File) {
    return chatApiInstance.put<Chat>('/avatar', {
      formData: {
        chatId,
        avatar,
      },
    })
  }

  addUserToChat(chatId: number, ...users: number[]) {
    return chatApiInstance.put('/users', {
      data: {
        users,
        chatId,
      },
    })
  }

  deleteUserFromChat(chatId: number, ...users: number[]) {
    return chatApiInstance.delete('/users', {
      data: {
        users,
        chatId,
      },
    })
  }

  deleteChat(chatId: number) {
    return chatApiInstance.delete<DeleteChatMethodResponse>('/', {
      data: {
        chatId,
      },
    })
  }

  getToken(id: number) {
    return chatApiInstance.post<CreateTokenResponse>(`/token/${id}`)
  }
}
