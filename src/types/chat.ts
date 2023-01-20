interface LastMessage {
  user?: {
    first_name: string
    second_name: string
    avatar: string
    email: string
    login: string
    phone: string
  }
  time: string
  content: string
}

export interface LastMessageWithDate extends Omit<LastMessage, 'time'> {
  time: Date
}

export interface Chat {
  id: number
  title: string
  avatar: string
  unread_count: number
  last_message: LastMessageWithDate | null
}

export enum MessageType {
  MESSAGE = 'message',
}

export interface Message {
  id: number
  time: string
  user_id: number
  content: string
  type: MessageType.MESSAGE
}
