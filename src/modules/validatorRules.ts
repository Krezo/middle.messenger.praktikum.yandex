import { InputFormData } from './../composibles/useForm'
import { watch } from './reactivity'

const required = (value: string) => !!value || 'Поле обязательно для заполнения'

const minLenght = (length: number) => ({
  minLenght: (value: string) =>
    value.length >= length ||
    `Длинна поля должна быть больше ${length}, сейчас ${value.length}`,
})
const maxLenght = (length: number) => ({
  maxLenght: (value: string) =>
    value.length < length ||
    `Длинна поля должна быть меньше ${length}, сейчас ${value.length}`,
})

const name = (nameType: string) => ({
  name: (value: string) => /^[A-ZА-Я]{1}[a-zа-я-]*$/.test(value) || `Введенное поле не является ${nameType}`
})

const email = (value: string) =>
  /^[\w-\.]+@([\w-]+\.)+[\w-]{2,8}$/g.test(value) || 'Введенное поле не является email'

const confirmedPassword = (passwordFieldName: string, ownPasswordFiledName: string) => {
  let passwordIsWatched = false
  const confirmedPassword = (value: string, formData: InputFormData) => {
    const password = formData[passwordFieldName]
    if (!passwordIsWatched) {
      watch(
        () => password.value,
        () => formData[ownPasswordFiledName].reassign!()
      )
      passwordIsWatched = true
    }
    if (!password) return false
    return password.value === value || 'Введенные пароли не совпадают'
  }
  return { confirmedPassword }
}

const password = (value: string) => {
  const isLetterUppercase = /[A-Z]+/g.test(value);
  if (!isLetterUppercase) return 'Должна быть хотя бы одна буква в верх. регистре'
  const isHard = /[0-9]+/g.test(value);
  if (!isHard) return 'Должна быть хотя бы одна цифра'
  return true;
}

const phone = (value: string) => {
  const isOnlyNumber = /^\+*[0-9]+$/g.test(value);
  if (!isOnlyNumber) return 'Пароль может содержать только цифры'
  return true;
}

const login = (value: string) => {
  const isOnlyNumber = /^[0-9]+$/g.test(value);
  if (isOnlyNumber) return 'Логин должен содержать хотябы один символ'
  const isSpecialCharaters = /[^\w\s\-]/g.test(value);
  if (isSpecialCharaters) return 'Допустима только латиница, дефис, ниж.подч. '
  return true;
}

export { required, minLenght, email, confirmedPassword, password, name, login, maxLenght, phone }
