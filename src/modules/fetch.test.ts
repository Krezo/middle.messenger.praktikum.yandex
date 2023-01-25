import { mockFetch } from '../utils/tests'
import { HTTPTransport, HTTPTransportResponseError } from './fetch'

describe('HTTP Transport', () => {
  const baseUrl = 'https://test-api.com/v2'
  const fetch = new HTTPTransport(baseUrl)

  test('should return response (ok status code)', async () => {
    const data = {
      users: [{ id: 1 }, { id: 2 }],
    }
    const mock = mockFetch(200, data)
    const { response } = await fetch.get('/users')
    expect(data).toEqual(response)
  })

  test('should return error (error status code)', async () => {
    const mock = mockFetch(400)
    await expect(fetch.get('/users')).rejects.toBeInstanceOf(
      HTTPTransportResponseError
    )
  })
})
