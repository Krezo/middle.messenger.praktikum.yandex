import ChatApi, {
  GetChatMethodParams,
  GetChatUsersMethodsParams,
} from '../api/chatApi'
import { HTTPTransportResponseError } from '../modules/fetch'
import { ChatElement, IChatMessage, chatStore } from '../store/chatStore'
import { userStore } from '../store/userStore'
import { IApiError } from '../types/apiError'
import { Message } from '../types/chat'
import { IUser } from '../types/user'
import RealTimeChat from './realTimeChat'
import UserService from './userService'

export enum MessageType {
  USER_CONNEDTED = 'user connected',
  MESSAGE = 'message',
  PING = 'ping',
  PONG = 'pong',
}

export interface UserConnectedMessage {
  content: number
  type: MessageType.USER_CONNEDTED
}

export interface PongMessage {
  type: MessageType.PONG
}

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
      const chats: ChatElement[] = []
      for (const chat of response) {
        // Добавляем только те чаты, которых еще нет
        if (this.store.chats.find((_chat) => _chat.id === chat.id)) {
          continue
        }
        const token = await RealTimeChat.createToken(chat.id)
        if (userStore.user.id) {
          const rtChat = new RealTimeChat(userStore.user.id, chat.id, token)
          if (chat.last_message) {
            chat.last_message.time = new Date(chat.last_message.time)
          }
          const chatUsers = new Map<number, IUser>()
          const chatInstace: ChatElement = {
            ...chat,
            users: chatUsers,
            messages: new Map<number, IChatMessage>(),
            rtChat,
          }

          chats.push(chatInstace)

          const loadUser = async (userId: number) => {
            if (!chatUsers.has(userId)) {
              const user = await new UserService().getUsetById(userId)
              if (!user) return
              chatUsers.set(userId, user)
            }
          }

          rtChat.ws.addEventListener(
            'message',
            async (event: MessageEvent<string>) => {
              const messageData:
                | Message[]
                | Message
                | UserConnectedMessage
                | PongMessage = JSON.parse(event.data)
              // Загружаем массив сообщений
              if (Array.isArray(messageData)) {
                for (const message of messageData) {
                  const userId = message.user_id
                  await loadUser(userId)
                  chatInstace.messages.set(message.id, {
                    ...message,
                    user: chatUsers.get(userId)!,
                    date: this.createChatDate(message.time),
                  })
                }
              } else if (messageData.type === MessageType.USER_CONNEDTED) {
                await loadUser(messageData.content)
              }
              // Загружаем одно сообщение
              else if (messageData.type === MessageType.MESSAGE) {
                const userId = messageData.user_id
                await loadUser(userId)
                chatInstace.messages.set(messageData.id, {
                  ...messageData,
                  user: chatUsers.get(userId)!,
                  date: this.createChatDate(messageData.time),
                })
                chatInstace.last_message = {
                  content: messageData.content,
                  time: new Date(messageData.time),
                }
              } else if (messageData.type === MessageType.PONG) {
                return
              }
              // Тригерим рендер страницы
              this.store.loadMessagesTriger = !this.store.loadMessagesTriger
            }
          )
        }
      }
      this.store.chats = [...chats, ...this.store.chats]
    } catch (error) {
      if (error instanceof HTTPTransportResponseError) {
        const responseError: IApiError = error.response
        this.store.getChatError = responseError.reason
      } else {
        // console.log(error)
      }
    } finally {
      this.store.loadingChats = false
    }
  }

  /**
   * Создание чата
   */
  async createChats(title: string, avatar?: File) {
    try {
      this.store.createChatError = ''
      this.store.loadingCreateChat = true
      const { response } = await this.api.createChat(title)
      if (avatar && response.id) {
        await this.api.uploadAvatar(response.id, avatar)
      }
      this.getChats()
    } catch (error) {
      if (error instanceof HTTPTransportResponseError) {
        const responseError: IApiError = error.response
        this.store.createChatError = responseError.reason
      } else {
        // console.log(error)
      }
    } finally {
      this.store.loadingCreateChat = false
    }
  }

  async changeAvatar(chatId: number, avatar: File) {
    try {
      this.store.changeAvatarError = ''
      this.store.loadingChangeAvatar = true
      if (avatar) {
        const { response } = await this.api.uploadAvatar(chatId, avatar)
        const updatedChat = this.store.chats.find(
          (chat) => chat.id === response.id
        )
        if (updatedChat) {
          updatedChat.avatar = response.avatar
        }
      }
      this.getChats()
    } catch (error) {
      if (error instanceof HTTPTransportResponseError) {
        const responseError: IApiError = error.response
        this.store.changeAvatarError = responseError.reason
      } else {
        // console.log(error)
      }
    } finally {
      this.store.loadingChangeAvatar = false
    }
  }

  private createChatDate(date: string) {
    return new Date(date)
  }

  /**
   * Удаление чата
   */
  async deleteChat(chatId: number) {
    try {
      this.store.deleteChatError = ''
      this.store.loadingDeleteChat = true
      await this.api.deleteChat(chatId)
      const deletedChat = this.store.chats.find((chat) => chat.id === chatId)
      if (deletedChat) {
        deletedChat?.rtChat.close()
        this.store.chats = this.store.chats.filter((chat) => chat.id !== chatId)
      }
    } catch (error) {
      if (error instanceof HTTPTransportResponseError) {
        const responseError: IApiError = error.response
        this.store.deleteChatError = responseError.reason
      } else {
        // console.log(error)
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
        // console.log(error)
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
        // console.log(error)
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
        // console.log(error)
      }
    } finally {
      this.store.loadingGetChatUsers = false
    }
  }
}
