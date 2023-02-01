import { IComponentProps, onUpdate } from '../../modules/components'

import { IChatMessage } from '../../store/chatStore'
import { Spinner } from '../spinner/spinner.component'
import style from './messageList.component.module.css'

interface Props extends IComponentProps {
  messages: Map<number, IChatMessage>
  loading: boolean
}

export function MessageList(props: Props) {
  const { messages, loading } = props

  const sortedMessageArray = Array.from(messages.values()).sort(
    (message, newMessage) => (newMessage.time > message.time ? -1 : 1)
  )

  // @ts-ignore
  onUpdate<Props>((component, oldProps, newProps) => {
    if (newProps.messages.size > 0) {
      const lastMessageElement = document.querySelector(
        '#message-container > *:last-child'
      )
      if (lastMessageElement) {
        lastMessageElement.scrollIntoView()
      }
    }
  })

  const sortedMessages = sortedMessageArray.map((message) => (
    <div>
      <div className={style.user}>
        {message.user.first_name} {message.user.second_name}{' '}
        <span className={style.messageTime}>
          {message.date.toLocaleTimeString(undefined, {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>
      <div key={message.id} className={style.messageItem}>
        {message.content}
      </div>
    </div>
  ))

  return (
    <div className={style.messageList}>
      {loading && (
        <div className={style.spinnerWrapper}>
          <Spinner primary size="lg" />
        </div>
      )}
      <div id="message-container">{sortedMessages}</div>
    </div>
  )
}
