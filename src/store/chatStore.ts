import { Ref, reactive, ref } from '../modules/reactivity'
import RealTimeChat from '../services/realTimeChat'
import { Chat, Message } from '../types/chat'

interface IChatStore {
  /** Список чатов */
  chats: Chat[]
  chatMessages: Record<
    string,
    {
      rtChat: RealTimeChat
    }
  >
  activeChatId: number
  activeChatMessages: Message[]
  /** Ошибка получения чатов */
  getChatError: string
  /** Флаг загрузки списка частов */
  loadingChats: boolean
  /** Ошибка создания чата */
  createChatError: string
  /** Флаг загрузки создания чата */
  loadingCreateChat: boolean
  /** Ошибка удаления чата */
  deleteChatError: string
  /** Флаг удаления чата */
  loadingDeleteChat: boolean
  /** Ошибка добавления пользователя в чат */
  addUserToChatError: string
  /** Флаг добавления пользователя в чат */
  loadingAddUserToChat: boolean
  /** Ошибка удаления пользователя из чата */
  deleteUserFromChatError: string
  /** Флаг удаления пользователя из чата */
  loadingdeleteUserFromChat: boolean
  /** Ошибка получения списка пользователей чата */
  getChatUsersError: string
  /** Флаг получения списка пользователей чата*/
  loadingGetChatUsers: boolean
}
// Хранилище для данных аутентификации
const chatStore = reactive<IChatStore>({
  chats: [],
  activeChatId: -1,
  activeChatMessages: [],
  getChatError: '',
  chatMessages: {},
  loadingChats: false,
  createChatError: '',
  loadingCreateChat: false,
  deleteChatError: '',
  loadingDeleteChat: false,
  addUserToChatError: '',
  loadingAddUserToChat: false,
  getChatUsersError: '',
  loadingGetChatUsers: false,
  deleteUserFromChatError: '',
  loadingdeleteUserFromChat: false,
})

export { chatStore }
