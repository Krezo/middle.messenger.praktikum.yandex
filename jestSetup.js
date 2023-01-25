import { h } from './src/modules/vdom'

// Регистрируем h функцию, т.к babel удаляет неисползуемый импорт (как убарть не знаю)
// т.е импортируя -- import { h } from './src/modules/vdom' -- в начале файла c .tsx,
// на выходе получаем, что h не определена и получаем ошибку
// поэтому сделал ее глобальной
global.h = h

window.XMLHttpRequest = jest.fn(() => ({
  abort: jest.fn(),
  addEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
  error: jest.fn(),
  getResponseHeader: jest.fn(),
  load: jest.fn(),
  loadend: jest.fn(),
  loadstart: jest.fn(),
  onreadystatechange: jest.fn(),
  open: jest.fn(),
  progress: jest.fn(),
  readyState: jest.fn(),
  removeEventListener: jest.fn(),
  response: jest.fn(),
  responseText: jest.fn(),
  responseType: jest.fn(),
  responseURL: jest.fn(),
  responseXML: jest.fn(),
  send: jest.fn(),
  setRequestHeader: jest.fn(),
  status: jest.fn(),
  statusText: jest.fn(),
  timeout: jest.fn(),
  upload: jest.fn(),
  withCredentials: jest.fn(),
}))
