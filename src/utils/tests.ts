export function mockFetch<T>(status: number, data?: T) {
  const xhrMockObj = {
    open: jest.fn(),
    send: jest.fn(),
    setRequestHeader: jest.fn(),
    readyState: 4,
    status,
    response: data,
  }

  const xhrMockClass = () => xhrMockObj

  // @ts-ignore
  window.XMLHttpRequest = jest.fn().mockImplementation(xhrMockClass)

  setTimeout(() => {
    // @ts-ignore
    xhrMockObj['onreadystatechange']()
  }, 0)

  return xhrMockClass
}

export function mockHistoryGo() {
  const mock = jest.fn()
  if (typeof window.history.go === 'function') {
    const windowOriginalFn = window.history.go.bind(window.history)
    window.history.go = (params: number) => {
      mock(params)
      windowOriginalFn()
    }
  }
  return mock
}

export function mockHistoryPushState() {
  const mock = jest.fn()
  if (typeof window.history.pushState === 'function') {
    const windowOriginalFn = window.history.pushState.bind(window.history)
    window.history.pushState = (params) => {
      mock(params)
      windowOriginalFn()
    }
  }
  return mock
}
