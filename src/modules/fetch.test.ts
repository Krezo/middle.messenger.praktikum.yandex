import { HTTPTransport } from './fetch'

describe('HTTP Transport', () => {
  const baseUrl = 'https://test-api.com/v2'
  const fetch = new HTTPTransport(baseUrl)

  function mockFetch<T>(status: number, data?: T) {
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

  test('fetch return data', async () => {
    const data = {
      users: [{ id: 1 }, { id: 2 }],
    }
    const mock = mockFetch(200, data)
    const { response } = await fetch.get('/users')
    expect(data).toEqual(response)
  })
})
