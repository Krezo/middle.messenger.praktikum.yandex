import ChatApi from '../api/chatApi'
import ChatService from './chatService'

const chatApi = new ChatApi()

/**
 * Класс для работы с real-time сообщениями
 *
 */
export default class RealTimeChat {
  public readonly ws: WebSocket
  private readonly wsBaseUrl = 'wss://ya-praktikum.tech/ws/chats'
  constructor(userId: number, chatId: number, token: string) {
    this.ws = new WebSocket([this.wsBaseUrl, userId, chatId, token].join('/'))
  }
  public static async createToken(chatId: number) {
    const { response } = await chatApi.getToken(chatId)
    return response.token
  }
  public loadMessage(content: number = 0, type = 'get old') {
    const intervalId = setInterval(() => {
      if (this.ws.readyState === this.ws.OPEN) {
        this.ws.send(
          JSON.stringify({
            content,
            type,
          })
        )
        clearInterval(intervalId)
      }
    }, 100)
  }
  public sendMessage(content: string, type = 'message') {
    const intervalId = setInterval(() => {
      if (this.ws.readyState === this.ws.OPEN) {
        this.ws.addEventListener('open', () => {
          this.ws.send(
            JSON.stringify({
              content,
              type,
            })
          )
        })
        clearInterval(intervalId)
      }
    }, 100)
  }
}
