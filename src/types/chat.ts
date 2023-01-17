export interface Chat {
  id: number
  title: string
  avatar: string
  unread_count: number
  last_message: {
    user: {
      first_name: string
      second_name: string
      avatar: string
      email: string
      login: string
      phone: string
    }
    time: Date
    content: string
  }
}

export enum MessageType {
  MESSAGE = 'message',
}

export interface Message {
  id: string
  time: Date
  user_id: string
  content: string
  type: MessageType
}
