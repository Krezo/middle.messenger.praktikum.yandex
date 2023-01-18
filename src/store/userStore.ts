import { reactive } from '../modules/reactivity'
import { IUserNullable } from '../types/user'

interface IUserStore {
  user: IUserNullable
  loadingChangeUser: boolean
  loadingChangeAvatart: boolean
  loadingChangePassword: boolean
  loadingSearchUser: boolean
  changeUserError: string
  changeAvatartError: string
  changePasswordError: string
  searchUserError: string
}
// Хранилище для данных пользователя
const userStore = reactive<IUserStore>({
  user: {
    id: null,
    first_name: null,
    second_name: null,
    display_name: null,
    login: null,
    email: null,
    phone: null,
    avatar: null,
  },
  loadingChangeUser: false,
  loadingChangeAvatart: false,
  loadingChangePassword: false,
  loadingSearchUser: false,
  changeUserError: '',
  changeAvatartError: '',
  changePasswordError: '',
  searchUserError: '',
})

const logoutUser = () => {
  for (const userKey in userStore.user) {
    userStore.user[userKey as keyof typeof userStore.user] = null
  }
}

const clearUserError = () => {
  userStore.changeUserError = ''
  userStore.changeAvatartError = ''
  userStore.changePasswordError = ''
}

const reassignUser = (userData: typeof userStore.user) => {
  Object.assign(userStore.user, userData)
}

const loginUser = (userData: typeof userStore.user) => {
  reassignUser(userData)
}

export {
  userStore, logoutUser, loginUser, reassignUser, clearUserError,
}
