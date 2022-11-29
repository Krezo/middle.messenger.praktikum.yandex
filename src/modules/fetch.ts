import { queryStringify } from '../utils/index'

enum METHOD {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

type Options = {
  method?: METHOD,
  headers?: { [key: string]: string }
  data?: any
}

type HttpTransportOptions = Omit<Options, METHOD>

class HTTPTransport {
  get(url: string, options: HttpTransportOptions = {}): Promise<XMLHttpRequest> {
    const queryUrl = [url, queryStringify(options?.data || {})].join('?')
    return this.request(queryUrl, { ...options, method: METHOD.GET });
  };

  post(url: string, options: HttpTransportOptions = {}): Promise<XMLHttpRequest> {
    // Пока не реализовал доп. логику для работы с данными
    // не ясно в каком формате требуется отправлять данные API
    // как вариант передовавть и принимать все в JSON, но из форм придется брать 
    // например изображение аватара
    return this.request(url, { ...options, method: METHOD.POST });
  };

  put(url: string, options: HttpTransportOptions = {}): Promise<XMLHttpRequest> {
    // Пока не реализовал доп. логику для работы с данными
    // не ясно в каком формате требуется отправлять данные API
    // как вариант передовавть и принимать все в JSON, но из форм придется брать 
    // например изображение аватара
    return this.request(url, { ...options, method: METHOD.PUT });
  };

  delete(url: string, options: HttpTransportOptions = {}): Promise<XMLHttpRequest> {
    // Пока не реализовал доп. логику для работы с данными
    // не ясно в каком формате требуется отправлять данные API
    // как вариант передовавть и принимать все в JSON, но из форм придется брать 
    // например изображение аватара
    return this.request(url, { ...options, method: METHOD.DELETE });
  };

  request(url: string, options: Options = { method: METHOD.GET }): Promise<XMLHttpRequest> {
    const { method, data } = options;

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(method ?? METHOD.GET, url);

      xhr.onload = function () {
        resolve(xhr);
      };

      xhr.onabort = reject;
      xhr.onerror = reject;
      xhr.ontimeout = reject;

      if (method === METHOD.GET || !data) {
        xhr.send();
      } else {
        xhr.send(data);
      }
    });
  };
}

export {
  HTTPTransport
}