import { reactive } from '../modules/reactivity'
import { Router } from '../modules/router'
import { authStore } from '../store/authStore'
import { mockFetch } from '../utils/tests'
import AuthService from './authService'

jest.mock('../modules/router')

describe('Auth Service', () => {
  let mockAuthStore: typeof authStore
  let authService: AuthService
  const router = new Router()

  beforeEach(() => {
    mockAuthStore = reactive({
      isAuth: false,
      signupLoading: false,
      signupError: '',
      signinLoading: false,
      signinError: '',
      getUserLoading: false,
      getUserError: '',
      logoutLoading: false,
      logoutError: '',
    })
    // @ts-ignore
    Router.mockReset()
    // @ts-ignore
    router.go.mockClear()
    authService = new AuthService(mockAuthStore, router)
  })

  test('signup should return signup error if get bad response', async () => {
    const reason = 'bad response signup'
    mockFetch(400, {
      reason,
    })
    await authService.signup({
      email: '',
      first_name: '',
      login: '',
      phone: '',
      second_name: '',
    })
    expect(mockAuthStore.signupError).toBe(reason)
  })

  test('signup should not return signup error if get success response', async () => {
    mockFetch(200, {})
    await authService.signup({
      email: '',
      first_name: '',
      login: '',
      phone: '',
      second_name: '',
    })
    expect(mockAuthStore.signupError.length).toBe(0)
  })

  test('signup should redirect to /messenger page if get success response', async () => {
    mockFetch(200, {})
    await authService.signup({
      email: '',
      first_name: '',
      login: '',
      phone: '',
      second_name: '',
    })
    expect(router.go).toBeCalledWith('/messenger')
  })

  test('getUser should set isAuth if response is success', async () => {
    mockFetch(200)
    await authService.getUser()
    expect(mockAuthStore.isAuth).toBe(true)
  })

  test('getUser should return getUser error if get bad response', async () => {
    const reason = 'bad response get user'
    mockFetch(400, {
      reason,
    })
    await authService.getUser()
    expect(mockAuthStore.getUserError).toBe(reason)
  })

  test('signin should return signin error if get bad response', async () => {
    const reason = 'bad response signin'
    mockFetch(400, {
      reason,
    })
    await authService.signin({
      login: '',
      password: '',
    })
    expect(mockAuthStore.signinError).toBe(reason)
  })

  test('signin should not return signin error if get success response', async () => {
    mockFetch(200, {})
    await authService.signin({
      login: '',
      password: '',
    })
    expect(mockAuthStore.signinError.length).toBe(0)
  })

  test('signin redirect if get success response', async () => {
    mockFetch(200, {})
    await authService.signin({
      login: '',
      password: '',
    })
    expect(router.go).toBeCalledWith('/messenger')
  })

  test('signout should return signout error if get bad response', async () => {
    const reason = 'bad response signout'
    mockFetch(400, {
      reason,
    })
    await authService.signout()
    expect(mockAuthStore.logoutError).toBe(reason)
  })

  test('signout should not return signout error if get success response', async () => {
    mockFetch(200, {})
    await authService.signout()
    expect(mockAuthStore.logoutError.length).toBe(0)
  })

  test('signout redirect to / if get success response', async () => {
    mockFetch(200, {})
    await authService.signout()
    expect(router.go).toBeCalledWith('/')
  })
})
