// Styles
import style from './index.page.module.css'
import styles from '../../css/app.module.css'
// Modules
import { computed, ref, watch, watchEffect } from '../../modules/reactivity'
// Images
import companionImagePlaceholder from '../../images/avatar_placeholder.jpeg'
// Components
import { Input } from '../../components/input/input.component'
import { useForm } from '../../composibles/useForm'
import RouterLink from '../../modules/router/components/RouterLink'
import { h } from '../../modules/vdom'
import AuthService from '../../services/authService'
import ChatApi from '../../api/chatApi'

import { authStore } from '../../store/authStore.ts'
import ChatService from '../../services/chatService'
import { Button } from '../../components/button/buttonComponent'
import { Modal } from '../../components/modal/modal.component'
import { chatStore } from '../../store/chatStore'
import UserService from '../../services/userService'
import { IUser, IUserWithRole, UserRoles } from '../../types/user'
import { apiResourceUrl } from '../../consts'
import { Message } from '../../types/chat'

const aciveChatIndex = ref(-1)

const activeChat = computed(() => {
  if (aciveChatIndex.value > -1) {
    const chat = chatStore.chats[aciveChatIndex.value]
    console.log(chat)
    chatStore.chatMessages[chat.id].rtChat.loadMessage()
    return chat
  }
})

watchEffect(() => {
  // console.log(chatStore.activeChatMessages.value)
  console.log(chatStore.activeChatMessages)
})

const selectActiveComponent = (index: number) => {
  aciveChatIndex.value = index
}

const getMessageTime = (date: Date) => {
  return date.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
  })
}

const deleteChat = async () => {
  if (confirm('Вы действительно хотите удалить чат')) {
    await chatService.deleteChat(chatStore.chats[aciveChatIndex.value].id)
    isActiveChatSelect.value = false
  }
}

const sendMessage = (event: KeyboardEvent) => {
  if (event.code === 'Enter') {
    console.log((event.target as HTMLInputElement).value)
  }
}

const {
  formData: messageFormData,
  values,
  isValid,
} = useForm({
  message: {
    value: '',
    validators: {
      required: (value: string) => !!value || 'Поле не может быть пустым',
    },
    blur,
    valid: false,
    errorMessage: '123',
  },
})

watch(
  () => messageFormData.message.errorMessage,
  (message) => {
    console.log(message)
  },
  { immediate: true }
)

const authService = new AuthService()
const chatService = new ChatService()
const userService = new UserService()

const openCreateChatModal = () => {
  createChatModalOpen.value = true
}

const closeCreateChatModal = () => {
  createChatModalOpen.value = false
}

const openChatUsersModal = () => {
  chatUsersModalOpen.value = true
}

const closeChatUsersModal = () => {
  chatUsersModalOpen.value = false
}

const createChatName = ref('')
const createChatModalOpen = ref(false)
const chatUsersModalOpen = ref(false)
const findUserString = ref('')

const findUsers = ref<IUser[]>([])
const addedUserIds = ref<number[]>([])

const createChat = async (event: Event) => {
  event.preventDefault()
  chatService.createChats(createChatName.value).then(() => {
    createChatModalOpen.value = false
  })
}

const addUserToChat = async (event: Event) => {
  if (!activeChat.value) return
  const userId = Number((event.target as HTMLElement).dataset.id)
  await chatService.addUserToChat(activeChat.value.id, userId)
  addedUserIds.value = [...addedUserIds.value, userId]
}

const deleteUserFromChat = async (event: Event) => {
  if (!activeChat.value) return
  const userId = Number((event.target as HTMLElement).dataset.id)
  await chatService.deleteUserFromChat(activeChat.value.id, userId)
  addedUserIds.value = [...addedUserIds.value.filter((id) => id !== userId)]
  if (!findUserString.value) {
    chatService.getChatUsers(activeChat.value.id).then((chatUsers) => {
      if (chatUsers) {
        addedUserIds.value = chatUsers.map((user) => user.id)
        activeChatUsers.value = chatUsers
      }
    })
  }
}

const activeChatUsers = ref<IUserWithRole[]>([])

watch(
  () => {
    return chatUsersModalOpen.value
  },
  (chatUsersModalOpen) => {
    if (chatUsersModalOpen) {
      findUserString.value = ''
      chatService.getChatUsers(activeChat.value.id).then((chatUsers) => {
        if (chatUsers) {
          addedUserIds.value = chatUsers.map((user) => user.id)
          activeChatUsers.value = chatUsers
        }
      })
    }
  }
)

watch(
  () => authStore.isAuth,
  (isAuth) => {
    if (isAuth) {
      chatService.getChats()
    }
  }
)

watch(
  () => findUserString.value,
  (findUserString) => {
    if (findUserString) {
      userService.search(findUserString).then((findedUsers) => {
        if (findedUsers) {
          findUsers.value = findedUsers
        }
      })
    } else {
      chatService.getChatUsers(activeChat.value.id).then((chatUsers) => {
        if (chatUsers) {
          addedUserIds.value = chatUsers.map((user) => user.id)
          activeChatUsers.value = chatUsers
        }
      })
      // findUsers.value = []
    }
  }
)

export default () => {
  return (
    <main>
      <div className={style.mainPage}>
        <div className={style.chatSidebar}>
          <div className={style.profileLink}>
            <Button
              className={style.createChatButton}
              primary
              rounded
              small
              onClick={openCreateChatModal}
            >
              Создать чат
            </Button>
            <RouterLink href="/settings" className={styles.link}>
              Профиль
            </RouterLink>
          </div>

          <Modal
            close={closeCreateChatModal}
            title="Создание чата"
            open={createChatModalOpen.value}
          >
            <form onSubmit={createChat} className={style.createChatForm}>
              <Input
                id="create_chat_name"
                setValue={(value) => (createChatName.value = value)}
                placeholder="Поиск"
              />
              <div className={styles.formErrorMessage}>
                {chatStore.createChatError}
              </div>
              <Button
                loading={chatStore.loadingCreateChat}
                type="submit"
                primary
              >
                Создать
              </Button>
            </form>
          </Modal>

          <Modal
            close={closeChatUsersModal}
            title="Пользователи"
            open={chatUsersModalOpen.value}
          >
            <form onSubmit={createChat} className={style.createChatForm}>
              <div className={styles.formErrorMessage}>
                {chatStore.createChatError}
              </div>
              <Input
                value={findUserString.value}
                id="create_chat_name"
                setValue={(value) => (findUserString.value = value)}
                placeholder="Введите имя пользователя"
              />
              <div
                className={style.chatUserList}
                style={`display: ${
                  findUserString.value === '' ? 'block' : 'none'
                }`}
              >
                {activeChatUsers.value.map((user) => (
                  <div key={user.id}>
                    <img
                      src={apiResourceUrl + user.avatar}
                      className={style.chatUserAvatar}
                      alt="user avatar"
                    />
                    <span className={style.chatUserDisplayName}>
                      {user.id} {user.login}
                    </span>
                    {user.role !== UserRoles.ADMIN ? (
                      <span
                        data-id={user.id}
                        className={[
                          style.chatUserFuncBlock,
                          styles.linkError,
                        ].join(' ')}
                        onClick={deleteUserFromChat}
                      >
                        Удалить
                      </span>
                    ) : (
                      <div></div>
                    )}
                  </div>
                ))}
              </div>
              <div
                className={style.chatUserList}
                style={`display: ${
                  findUserString.value === '' ? 'none' : 'block'
                }`}
              >
                {!addedUserIds.value}
                {findUsers.value.map((user, userIndex) => (
                  <div>
                    <img
                      src={apiResourceUrl + user.avatar}
                      className={style.chatUserAvatar}
                      alt="user avatar"
                    />
                    <span className={style.chatUserDisplayName}>
                      {user.id} {user.login}
                    </span>
                    <span className={style.chatUserFuncBlock}>
                      {!addedUserIds.value.includes(user.id) ? (
                        <span
                          data-id={user.id}
                          onClick={addUserToChat}
                          className={styles.link}
                        >
                          Добавить
                        </span>
                      ) : (
                        <span
                          data-id={user.id}
                          className={[
                            style.chatUserAlreadyAdded,
                            styles.linkError,
                          ].join(' ')}
                          onClick={deleteUserFromChat}
                        >
                          Удалить
                        </span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </form>
          </Modal>

          <div className={style.chatList}>
            {chatStore.chats.length === 0 && (
              <div className={style.emptyChatMessage}>Список чатов пуст</div>
            )}
            {!aciveChatIndex.value && false}
            {chatStore.chats.map((chat, chatIndex) => (
              <div
                onClick={() => selectActiveComponent(chatIndex)}
                className={[
                  style.companionBlock,
                  chatIndex === aciveChatIndex.value
                    ? style.companionBlockActive
                    : '',
                ].join(' ')}
              >
                <img
                  className={style.companionImage}
                  src={chat.avatar}
                  alt=""
                />
                <div className={style.companionBody}>
                  <div className={style.companionName}>{chat.title}</div>
                  <div className={style.companionMessage}>
                    {!!chat.last_message || 'Чат пуст'}
                  </div>
                </div>
                {/* <div className={style.companionMessageTime}>
                  {getMessageTime(
                    companion.messages[companion.messages.length - 1].time
                  )}
                  <div className={style.companionMessageCount}>
                    {companion.unreadMessageCount.toString()}
                  </div>
                </div> */}
              </div>
            ))}
            {/* {companionList.map((companion, index) => (
            <div
              onClick={() => selectActiveComponent(index)}
              className={[
                style.companionBlock,
                index == aciveChatIndex.value &&
                isActiveChatSelect.value
                  ? style.companionBlockActive
                  : '',
              ].join(' ')}
            >
              <img
                className={style.companionImage}
                src={companion.image}
                alt=""
              />
              <div className={style.companionBody}>
                <div className={style.companionName}>{companion.name}</div>
                <div className={style.companionMessage}>
                  {companion.messages[companion.messages.length - 1].text}
                </div>
              </div>
              <div className={style.companionMessageTime}>
                {getMessageTime(
                  companion.messages[companion.messages.length - 1].time
                )}
                <div className={style.companionMessageCount}>
                  {companion.unreadMessageCount.toString()}
                </div>
              </div>
            </div>
          ))} */}
          </div>
        </div>
        {aciveChatIndex.value > -1 && (
          <div className={style.messageSidebar}>
            <div className={style.activeChatWrapper}>
              <div className={style.activeChat}>
                <div className={style.companionName}>
                  {activeChat.value.title}
                </div>
                <div className={style.funcBlock}>
                  <span onClick={openChatUsersModal} className={styles.link}>
                    Пользователи
                  </span>
                  <span onClick={deleteChat} className={styles.link}>
                    Удалить чат
                  </span>
                </div>
              </div>
            </div>
            <div className={style.messageList}>
              {!!chatStore.activeChatMessages}
              {chatStore.activeChatMessages.map((message) => (
                <div className={style.messageItem}>
                  <div className={style.messageTime}>{message.content}</div>
                </div>
              ))}
            </div>
            <Input
              id="message"
              onKeyup={sendMessage}
              onBlur={() => messageFormData.message.blur()}
              toched={messageFormData.message.toched}
              errorMessage={messageFormData.message.errorMessage}
              setValue={(value: string) =>
                (messageFormData.message.value = value)
              }
              className={style.messageInput}
              rounded
            />
          </div>
        )}
        <div
          className={style.messageSidebar}
          style={aciveChatIndex.value > -1 ? 'display: none;' : ''}
        >
          <div className={style.selectChatMessage}>
            Выберите чат для того, чтобы написать сообщение
          </div>
        </div>
      </div>
    </main>
  )
}
