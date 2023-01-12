interface HTTPTransformResponse<T> {
  data: T
  status: number
}

/**
 * Класс для преобразования ответов от XHR
 * @author ABez
 * @date 2022-12-31
 * @returns {any}
 */
export default class HTTPResponseTransfromer {
  constructor() {}
  transform<T>(xhr: XMLHttpRequest): HTTPTransformResponse<T> {
    const data = null
    if (xhr.readyState !== 4) {
      throw new Error('XHR is not ready')
    }
    if (xhr.getResponseHeader('Content-Type') === 'application/json') {
    }
  }
}
