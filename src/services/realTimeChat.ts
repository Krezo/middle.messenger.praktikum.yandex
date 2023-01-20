import ChatApi from '../api/chatApi'
import ChatService, { MessageType } from './chatService'

const chatApi = new ChatApi()

/**
 * Класс для работы с real-time сообщениями
 *
 */
export default class RealTimeChat {
  public readonly ws: WebSocket

  private readonly wsBaseUrl = 'wss://ya-praktikum.tech/ws/chats'

  constructor(
    userId: number,
    chatId: number,
    token: string,
    infinitePing = true
  ) {
    this.ws = new WebSocket([this.wsBaseUrl, userId, chatId, token].join('/'))
    this.ws.addEventListener('open', () => {
      console.log('Успешное подключение к чату сокета')
    })
    this.ws.addEventListener('error', () => {
      console.log('Ошибка при подключении к сокету')
    })
    this.ws.addEventListener('close', (event) => {
      if (event.wasClean) {
        console.log('Соединение закрыто чисто')
        return
      }
      console.log('Соединение принудительно закрыто')
    })
    if (infinitePing) {
      this.ping()
    }
  }

  private ping(interval = 3000) {
    setInterval(() => this.sendMessage('', MessageType.PING), interval)
  }

  public static async createToken(chatId: number) {
    const { response } = await chatApi.getToken(chatId)
    return response.token
  }

  public close() {
    this.ws.close()
  }

  public loadMessage(content: number = 0, type = 'get old') {
    return new Promise((res, rej) => {
      const intervalId = setInterval(() => {
        if (this.ws.readyState === this.ws.OPEN) {
          this.ws.send(
            JSON.stringify({
              content,
              type,
            })
          )
          clearInterval(intervalId)
          res(true)
        }
      }, 100)
    })
  }

  public sendMessage(content: string, type: MessageType = MessageType.MESSAGE) {
    return new Promise((res, rej) => {
      const intervalId = setInterval(() => {
        if (this.ws.readyState === this.ws.OPEN) {
          this.ws.send(
            JSON.stringify({
              content,
              type,
            })
          )
          clearInterval(intervalId)
          res(true)
        }
      }, 100)
    })
  }
}
