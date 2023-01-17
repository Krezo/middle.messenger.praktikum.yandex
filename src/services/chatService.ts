import ChatApi, {
  GetChatMethodParams,
  GetChatUsersMethodsParams,
} from '../api/chatApi'
import { HTTPTransportResponseError } from '../modules/fetch'
import { ref } from '../modules/reactivity'
import { Router } from '../modules/router/index'
import { authStore } from '../store/authStore'
import { chatStore } from '../store/chatStore'
import { userStore } from '../store/userStore'
import { IApiError } from '../types/apiError'
import { Message } from '../types/chat'
import RealTimeChat from './realTimeChat'

/**
 * Класс для работы с аутентификацией
 *
 * https://ya-praktikum.tech/api/v2/swagger/#/Auth
 */
export default class ChatService {
  private readonly store: typeof chatStore
  private readonly api: ChatApi
  private __instance: ChatService
  constructor() {
    if (this.__instance) {
      return this.__instance
    }
    this.api = new ChatApi()
    this.store = chatStore
    this.__instance = this
  }

  /**
   * Загрузка списка частов
   */
  async getChats(params?: GetChatMethodParams) {
    try {
      this.store.getChatError = ''
      this.store.loadingChats = true
      const { response } = await this.api.getChats(params)
      response.forEach(async (chat) => {
        const token = await RealTimeChat.createToken(chat.id)
        if (userStore.user.id) {
          const rtChat = new RealTimeChat(userStore.user.id, chat.id, token)

          chatStore.chatMessages[chat.id] = {
            rtChat,
          }

          rtChat.ws.addEventListener(
            'message',
            (event: MessageEvent<string>) => {
              const messages: Message[] = JSON.parse(event.data)
              chatStore.activeChatMessages = messages
              console.log('Message', chatStore.activeChatMessages)
            }
          )
        }
      })
      this.store.chats = response
    } catch (error) {
      if (error instanceof HTTPTransportResponseError) {
        const responseError: IApiError = error.response
        this.store.getChatError = responseError.reason
      } else {
        console.log(error)
      }
    } finally {
      this.store.loadingChats = false
    }
  }

  /**
   * Создание чата
   */
  async createChats(title: string) {
    try {
      this.store.createChatError = ''
      this.store.loadingCreateChat = true
      await this.api.createChat(title)
      this.getChats()
    } catch (error) {
      if (error instanceof HTTPTransportResponseError) {
        const responseError: IApiError = error.response
        this.store.createChatError = responseError.reason
      } else {
        console.log(error)
      }
    } finally {
      this.store.loadingCreateChat = false
    }
  }

  /**
   * Удаление чата
   */
  async deleteChat(chatId: number) {
    try {
      this.store.deleteChatError = ''
      this.store.loadingDeleteChat = true
      await this.api.deleteChat(chatId)
      this.getChats()
    } catch (error) {
      if (error instanceof HTTPTransportResponseError) {
        const responseError: IApiError = error.response
        this.store.deleteChatError = responseError.reason
      } else {
        console.log(error)
      }
    } finally {
      this.store.loadingDeleteChat = false
    }
  }

  /**
   * Добавление пользователя в чат
   */
  async addUserToChat(chatId: number, ...users: number[]) {
    try {
      this.store.addUserToChatError = ''
      this.store.loadingAddUserToChat = true
      await this.api.addUserToChat(chatId, ...users)
    } catch (error) {
      if (error instanceof HTTPTransportResponseError) {
        const responseError: IApiError = error.response
        this.store.addUserToChatError = responseError.reason
      } else {
        console.log(error)
      }
    } finally {
      this.store.loadingAddUserToChat = false
    }
  }

  /**
   * Удаление пользователя из чат
   */
  async deleteUserFromChat(chatId: number, ...users: number[]) {
    try {
      this.store.deleteUserFromChatError = ''
      this.store.loadingdeleteUserFromChat = true
      await this.api.deleteUserFromChat(chatId, ...users)
    } catch (error) {
      if (error instanceof HTTPTransportResponseError) {
        const responseError: IApiError = error.response
        this.store.deleteUserFromChatError = responseError.reason
      } else {
        console.log(error)
      }
    } finally {
      this.store.loadingdeleteUserFromChat = false
    }
  }

  /**
   * Получение списка пользователей чата
   */
  async getChatUsers(chatId: number, params: GetChatUsersMethodsParams = {}) {
    try {
      this.store.getChatUsersError = ''
      this.store.loadingGetChatUsers = true
      const { response } = await this.api.getChatUsers(chatId, params)
      return response
    } catch (error) {
      if (error instanceof HTTPTransportResponseError) {
        const responseError: IApiError = error.response
        this.store.getChatUsersError = responseError.reason
      } else {
        console.log(error)
      }
    } finally {
      this.store.loadingGetChatUsers = false
    }
  }
}
