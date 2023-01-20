// Styles
import style from './index.page.module.css'
import styles from '../../css/app.module.css'
// Modules
import { computed, ref, watch } from '../../modules/reactivity'
// Components
import { Input } from '../../components/input/input.component'
import RouterLink from '../../modules/router/components/RouterLink'
import { h } from '../../modules/vdom'

import { authStore } from '../../store/authStore'
import ChatService from '../../services/chatService'
import { Button } from '../../components/button/buttonComponent'
import { Modal } from '../../components/modal/modal.component'
import { chatStore } from '../../store/chatStore'
import UserService from '../../services/userService'
import { IUser, IUserWithRole, UserRoles } from '../../types/user'
import { API_RESIURCE_URL } from '../../consts'
import { MessageList } from '../../components/messageList/messageList.component'

const aciveChatIndex = ref(-1)
const loadingMessages = ref(false)

const activeChat = computed(() => {
  if (aciveChatIndex.value > -1) {
    messageLines.value = 1
    return chatStore.chats[aciveChatIndex.value]
  }
})

watch(
  () => activeChat.value,
  (chat) => {
    if (chat) {
      chatStore.activeChatMessages = []
      loadingMessages.value = true
      chatStore.chats
        .find((_chat) => _chat.id === chat.id)!
        .rtChat.loadMessage()
        .then(() => {
          loadingMessages.value = false
        })
    }
  }
)

const selectActiveComponent = (index: number) => {
  aciveChatIndex.value = index
}

const deleteChat = async () => {
  if (confirm('Вы действительно хотите удалить чат')) {
    await chatService.deleteChat(chatStore.chats[aciveChatIndex.value].id)
    aciveChatIndex.value = -1
  }
}

const messageLines = ref(1)
const lineHeight = 28
const messagePadding = 10

const messageHeight = computed(
  () => `${messagePadding * 2 + lineHeight * messageLines.value}px`
)

const sendMessage = () => {
  const messageString = message.value
  if (messageString.replace(/\W\s/, '') === '') {
    messageErrorMessage.value = 'Поле не моет быть пустым'
    return
  }
  if (!activeChat.value) {
    return
  }
  message.value = ''
  messageLines.value = 1
  activeChat.value.rtChat.sendMessage(messageString)
}

const onMessageKeyUp = (event: KeyboardEvent) => {
  messageErrorMessage.value = false

  if (event.code === 'Enter') {
    if (event.shiftKey) {
      messageLines.value = message.value.split('\n').length
      return
    }
    sendMessage()
  }
}

const message = ref('')
const messageErrorMessage = ref<string | boolean>(false)

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

const openChangeAvatarForm = () => {
  changeAvatarOpen.value = true
}
const closeChangeAvatarForm = () => {
  changeAvatarOpen.value = false
}

const createChatName = ref('')
const createChatModalOpen = ref(false)
const chatUsersModalOpen = ref(false)
const findUserString = ref('')
const findUsers = ref<IUser[]>([])
const addedUserIds = ref<number[]>([])

const createChat = async (event: Event) => {
  event.preventDefault()
  const avatarFile = avatar.value.length > 0 ? avatar.value[0] : undefined
  await chatService.createChats(createChatName.value, avatarFile)
  if (!chatStore.createChatError) {
    closeCreateChatModal()
    createChatName.value = ''
    avatar.value = []
  }
}

const changeChatAvatar = async (event: Event) => {
  event.preventDefault()
  avatarChangeError.value = ''
  if (!activeChat.value) {
    return
  }
  const avatarFile =
    avatarChange.value.length > 0 ? avatarChange.value[0] : undefined
  if (!avatarFile) {
    avatarChangeError.value = 'Файл не выбран'
    return
  }
  await chatService.changeAvatar(activeChat.value?.id, avatarFile)
  closeChangeAvatarForm()
}

const activeChatMessages = computed(() => chatStore.activeChatMessages)

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
const avatar = ref<File[]>([])
const changeAvatarOpen = ref(false)
const avatarChange = ref<File[]>([])
const avatarChangeError = ref('')

watch(
  () => chatUsersModalOpen.value,
  (chatUsersModalOpen) => {
    if (chatUsersModalOpen) {
      findUserString.value = ''
      if (!activeChat.value) {
        return
      }
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
    } else if (activeChat.value) {
      chatService.getChatUsers(activeChat.value.id).then((chatUsers) => {
        if (chatUsers) {
          addedUserIds.value = chatUsers.map((user) => user.id)
          activeChatUsers.value = chatUsers
        }
      })
    }
  }
)

export default function () {
  return (
    <main>
      {!!createChatName.value}
      {!!message.value}
      {!!messageErrorMessage.value}
      {!!messageHeight.value}
      {!!loadingMessages.value}
      {!!chatStore.loadMessagesTriger}
      {!!activeChatMessages.value}
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
              <div className={styles.formErrorMessage}>
                {chatStore.createChatError}
              </div>
              <Input
                value={avatar.value}
                setValue={(value: File[]) => (avatar.value = value)}
                className={styles.formControl}
                id="create_chat_avatart"
                type="file"
              ></Input>

              <Input
                value={createChatName.value}
                className={styles.formControl}
                id="create_chat_name"
                setValue={(value) => (createChatName.value = value)}
                placeholder="Название чата"
              />

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
            close={closeChangeAvatarForm}
            title="Изменить аватар"
            open={changeAvatarOpen.value}
          >
            <form
              onSubmit={changeChatAvatar}
              className={style.changeAvatarForm}
            >
              <div className={styles.formErrorMessage}>
                {chatStore.changeAvatarError}
              </div>
              <Input
                value={avatarChange.value}
                toched={true}
                errorMessage={avatarChangeError.value}
                setValue={(value: File[]) => (avatarChange.value = value)}
                className={styles.formControl}
                id="create_chat_avatart"
                type="file"
              ></Input>

              <Button
                loading={chatStore.loadingChangeAvatar}
                type="submit"
                primary
              >
                Изменить
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
                      src={API_RESIURCE_URL + user.avatar}
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
                      <div />
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
                {findUsers.value.map((user) => (
                  <div>
                    <img
                      src={API_RESIURCE_URL + user.avatar}
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
                  src={API_RESIURCE_URL + chat.avatar}
                  alt=""
                />
                <div className={style.companionBody}>
                  <div className={style.companionName}>{chat.title}</div>
                  <div className={style.companionMessage}>
                    {chat.last_message ? chat.last_message.content : 'Чат пуст'}
                  </div>
                  <div className={style.messageTime}>
                    {chat.last_message
                      ? chat.last_message.time.toLocaleDateString(undefined, {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : ''}
                  </div>
                  {chat.unread_count > 0 && (
                    <div className={style.unreadMessagesWrapper}>
                      <span className={style.unreadMessages}>
                        {chat.unread_count}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {aciveChatIndex.value > -1 && (
          <div className={style.messageSidebar}>
            <div className={style.activeChatWrapper}>
              <div className={style.activeChat}>
                <div className={style.companionName}>
                  {activeChat.value ? activeChat.value.title : ''}
                  <span
                    onClick={openChangeAvatarForm}
                    className={[styles.link, style.chatSettingsLink].join(' ')}
                  >
                    Изменить аватар
                  </span>
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
            <MessageList
              messages={activeChat.value!.messages}
              loading={loadingMessages.value}
            />
            <Input
              id="message"
              type="textarea"
              inputSstyle={`height: ${messageHeight.value}`}
              value={message.value}
              onKeyup={onMessageKeyUp}
              toched
              errorMessage={messageErrorMessage.value}
              setValue={(value: string) => {
                message.value = value
              }}
              className={style.messageInput}
              rounded
            >
              <Button
                onClick={sendMessage}
                rounded
                className={style.sendButton}
                primary
              >
                Отправить
              </Button>
            </Input>
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
