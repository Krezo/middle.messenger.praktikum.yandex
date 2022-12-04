// Styles
import style from './index.page.module.css';
import styles from '../css/app.module.css';
// Modules
import { createApp, h } from '../modules/vdom';
import { computed, reactive, ref, render, watch, watchEffect } from '../modules/reactivity';
// Images
import companionImagePlaceholder from '../images/avatar_placeholder.jpeg'
// Components
import { Button } from '../components/button/buttonComponent';
import { Input } from '../components/input/input.component';
import { useForm } from '../composibles/useForm';
import { DefaultLayout } from '../layout/defaultLayout/defaultLayout';

interface IMessage {
  text: string
  time: Date
}

interface ICompanion {
  name: string
  image: string
  unreadMessageCount: number
  messages: IMessage[]
}

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('app');

  const companionList: ICompanion[] = [
    {
      name: 'Андрей',
      image: companionImagePlaceholder,
      unreadMessageCount: 1,
      messages: [
        {
          text: 'Привет как дела?',
          time: new Date()
        },
        {
          text: 'Куда пропал',
          time: new Date()
        },
        {
          text: 'Чем занят',
          time: new Date()
        }
      ]
    },
    {
      name: 'Антон',
      image: companionImagePlaceholder,
      unreadMessageCount: 2,
      messages: [
        {
          text: 'Сколько ждать?',
          time: new Date()
        },
        {
          text: 'Hello',
          time: new Date()
        },
        {
          text: 'Я устал',
          time: new Date()
        }
      ]
    },
    {
      name: 'Вера',
      image: companionImagePlaceholder,
      unreadMessageCount: 3,
      messages: [
        {
          text: 'Почему не отвечаешь?',
          time: new Date()
        },
        {
          text: 'Я от тебя ухожу',
          time: new Date()
        }
      ]
    },
  ];

  const activeCompanionIndex = ref(0)
  const isActiveCompanionSelect = ref(false);
  const activeCompanion = computed(() => companionList[activeCompanionIndex.value])

  const selectActiveComponent = (index: number) => {
    isActiveCompanionSelect.value = true;
    activeCompanionIndex.value = index;
  }

  const getMessageTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  const sendMessage = (event: KeyboardEvent) => {
    if (event.code === 'Enter') {
      console.log((event.target as HTMLInputElement).value);
    }
  }

  const { formData: messageFormData, values, isValid } = useForm({
    message: {
      value: '',
      validators: {
        required: (value: string) => !!value || 'Поле не может быть пустым'
      },
      blur,
      valid: false,
      errorMessage: '123'
    },
  })

  watch(() => messageFormData.message.errorMessage, (message) => {
    console.log(message);
  }, { immediate: true })

  const app = createApp(root, () => {
    return (<main>
      <div className={style.mainPage}>
        <div className={style.chatSidebar}>
          <div className={style.profileLink}>
            <a className={styles.link} href="/settings">Профиль</a>
          </div>
          {companionList.map((companion, index) => <div
            onClick={() => selectActiveComponent(index)}
            className={[
              style.companionBlock,
              index == activeCompanionIndex.value && isActiveCompanionSelect.value ? style.companionBlockActive : ''].join(' ')}>
            <img className={style.companionImage} src={companion.image} alt="" />
            <div className={style.companionBody}>
              <div className={style.companionName}>{companion.name}</div>
              <div className={style.companionMessage}>{companion.messages[companion.messages.length - 1].text}</div>
            </div>
            <div className={style.companionMessageTime}>
              {getMessageTime(companion.messages[companion.messages.length - 1].time)}
              <div className={style.companionMessageCount}>{companion.unreadMessageCount.toString()}</div>
            </div>
          </div>)}
        </div>
        <div className={style.messageSidebar} style={isActiveCompanionSelect.value ? '' : 'display: none;'}>
          <div className={style.activeCompanionWrapper}>
            <div className={style.activeCompanion}>
              <div className={style.companionName}>{activeCompanion.value.name}</div>
              <div className={styles.link}>Удалить чат</div>
            </div>
          </div>
          <div className={style.messageList}>
            {activeCompanion.value.messages.map(message => <div className={style.messageItem}>
              {message.text}
              <div className={style.messageTime}>{getMessageTime(message.time)}</div>
            </div>)}
          </div>
          <Input onKeyup={sendMessage}
            onBlur={() => messageFormData.message.blur()}
            toched={messageFormData.message.toched}
            errorMessage={messageFormData.message.errorMessage}
            setValue={(value: string) => messageFormData.message.value = value}
            className={style.messageInput} rounded />
        </div>
        <div className={style.messageSidebar} style={isActiveCompanionSelect.value ? 'display: none;' : ''}>
          <div className={style.selectChatMessage}>Выберите чат для того, чтобы написать сообщение</div>
        </div>
      </div >
    </main>)
  })
  app.mount();
})
