import { IComponentProps } from '../../modules/components'
import { ref } from '../../modules/reactivity'
import { h } from '../../modules/vdom'
import { Chat, Message } from '../../types/chat'
import { Spinner } from '../spinner/spinner.component'
import style from './messageList.component.module.css'

interface Props extends IComponentProps {
  messages: Map<number, Message>
  loading: boolean
}

export const MessageList = (props: Props) => {
  const { messages, loading } = props

  console.log(messages)

  const sortedMessageArray = Array.from(messages.values()).sort(
    (message, newMessage) => (newMessage.time > message.time ? -1 : 1)
  )

  console.log(sortedMessageArray.map((m) => m.id))

  const sortedMessages = sortedMessageArray.map((message) => (
    <div key={message.id} className={style.messageItem}>
      <div className={style.messageTime}>{message.content}</div>
    </div>
  ))

  return (
    <div className={style.messageList}>
      {loading && (
        <div className={style.spinnerWrapper}>
          <Spinner primary size="lg" />
        </div>
      )}
      <div>{sortedMessages}</div>
    </div>
  )
}
