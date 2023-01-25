import { createFormData, queryStringify } from '../utils/index'

enum METHOD {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

interface XMLHttpRequestWithResponseType<T> extends XMLHttpRequest {
  readonly response: T
}

const isErorStatusCode = (code: number) => {
  if (String(code)[0] === '4') {
    return true
  }
  if (String(code)[0] === '5') {
    return true
  }
  return false
}

export class HTTPTransportResponseError<T = any> extends Error {
  constructor(public status: number, public response: T) {
    super('HTTPTransportResponseError')
  }
}

type Options = {
  method?: METHOD
  withCredentials?: boolean
  headers?: { [key: string]: string }
  data?: any
  formData?: Record<string, any>
  responseType?: XMLHttpRequestResponseType
  params?: Record<string, any>
}

type HttpTransportOptions = Omit<Options, 'method'>

class HTTPTransport {
  private defaultResponseType: XMLHttpRequestResponseType = 'json'

  constructor(
    private baseUrl: string = '',
    private options: HttpTransportOptions = {
      responseType: 'json',
    }
  ) {
    this.baseUrl = baseUrl
  }

  get<T>(url: string, options?: HttpTransportOptions) {
    const queryUrl = [
      this.baseUrl + url,
      queryStringify(options?.params || {}),
    ].join('?')
    return this.request<T>(queryUrl, {
      ...(this.options || {}),
      ...options,
      method: METHOD.GET,
    })
  }

  post<T>(url: string, options?: HttpTransportOptions) {
    return this.request<T>(this.baseUrl + url, {
      ...(this.options || {}),
      ...options,
      method: METHOD.POST,
    })
  }

  put<T>(url: string, options?: HttpTransportOptions) {
    return this.request<T>(this.baseUrl + url, {
      ...(this.options || {}),
      ...options,
      method: METHOD.PUT,
    })
  }

  delete<T>(url: string, options?: HttpTransportOptions) {
    return this.request<T>(this.baseUrl + url, {
      ...(this.options || {}),
      ...options,
      method: METHOD.DELETE,
    })
  }

  request<T>(
    url: string,
    options: Options = { method: METHOD.GET }
  ): Promise<XMLHttpRequestWithResponseType<T>> {
    const { method, formData, data, headers, withCredentials } = options

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()

      xhr.responseType = options.responseType ?? this.defaultResponseType

      xhr.open(method ?? METHOD.GET, url)

      for (const headerKey in headers) {
        xhr.setRequestHeader(headerKey, headers[headerKey])
      }

      if (withCredentials) {
        xhr.withCredentials = withCredentials
      }

      xhr.onreadystatechange = () => {
        if (xhr.readyState !== 4) {
          return
        }
        if (isErorStatusCode(xhr.status)) {
          reject(new HTTPTransportResponseError(xhr.status, xhr.response))
        }
        resolve(xhr)
      }

      xhr.onabort = reject
      xhr.onerror = reject
      xhr.ontimeout = reject

      if (formData) {
        // xhr.setRequestHeader('Content-Type', 'multipart/form-data')
        xhr.send(createFormData(formData))
        return
      }
      if (typeof data === 'object') {
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.send(JSON.stringify({ ...data }))
        return
      }
      xhr.send()
    })
  }
}

export { HTTPTransport }
