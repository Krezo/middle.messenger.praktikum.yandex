import { IObserver, observer } from './observer'

interface IWatchFunction {
  (oldValue?: any, newValue?: any): void
}

let rootRenderFunc: any = null
// Ключ для проверки является ли возвращаемый реактивный объект reactive/ref
let isReactive = Symbol('isReactive')
let isRef = Symbol('isRef')

const setRootRenderFunc = (renderFunc: (...params: any) => void) => {
  rootRenderFunc = renderFunc
}

// Отслеживание зависимостей observer
let isWatchFunction: boolean = false
let watchFunction: IWatchFunction

// Реализация Proxy обертки на observer для автоматического определения зависимостей
const ref = <T>(value: T) => {
  return new Proxy(observer(value), {
    get(target, prop) {
      if (prop == isRef) {
        return true
      }
      const propString = prop.toString()
      if (propString in target) {
        if (propString == 'value' && isWatchFunction) {
          target.deps.add(watchFunction)
        }
        return target[propString as keyof typeof target]
      }
    },
    set(target, prop, newValue) {
      const propString = prop.toString()
      const oldValue = target[propString as keyof typeof target]
      target[propString as keyof typeof target] = newValue
      if (propString == 'value' && oldValue !== newValue) {
        target.deps.forEach((dep) => dep(newValue, oldValue))
      }
      return true
    },
  })
}

const reactive = <T extends object>(value: T, deep: boolean = true) => {
  // Объект обертка для управления зависимостями
  // Работаем с простым proxy над target(value)
  // Тригерем зависимости из objectObserver
  const objectObserver: Record<string | symbol, any | object | IObserver> = {}

  // Если значение является объектом, то вызываем для него рекурсивно reactive
  // Потом в геттере вернем его для реактивных объектов
  for (const key in value) {
    if (typeof value[key] === 'object' && deep) {
      objectObserver[key] = reactive(value[key] as object)
    }
    // Не важно что будет в ref, объект нужен для хранения зависимостей
    else objectObserver[key] = ref(true)
  }

  return new Proxy<any>(value, {
    get(target, prop) {
      if (prop === isReactive) {
        return true
      }
      // Возращаем reactive proxy
      if (objectObserver[prop]?.[isReactive]) {
        return objectObserver[prop]
      }
      // Добавляем зависимости
      if (isWatchFunction) {
        objectObserver[prop].deps.add(watchFunction)
      }
      if (prop in target) {
        return target[prop]
      }
    },
    set(target, prop, newValue) {
      // Вызываем все зависимости, если значение изменилось
      if (prop in target) {
        if (target[prop] !== newValue) {
          target[prop] = newValue
          if (objectObserver[prop][isRef]) {
            ;(objectObserver[prop].deps as IObserver['deps']).forEach((dep) =>
              dep(newValue, target[prop])
            )
          }
        }
        return true
      }
      // Добавление реактивных данных
      if (newValue?.[isReactive]) {
        target[prop] = newValue
        return true
      }
      // Добавление ref
      if (newValue?.[isRef]) {
        target[prop] = newValue.value
        objectObserver[prop] = newValue
        return true
      }
      // Добавление обычных данных
      target[prop] = newValue
      objectObserver[prop] = ref(newValue)
      return true
    },
  })
}

// Вспомогательная функция для привязки зависимостей observer
const watchDep = (
  watch: (...params: any) => void,
  watchFunc?: IWatchFunction
) => {
  isWatchFunction = true
  watchFunction = watchFunc ? watchFunc : watch
  watch()
  isWatchFunction = false
}

// Вычисляемый observer
const computed = <T>(computedFunc: () => T) => {
  const computedObserver = ref<null | T>(null)
  watchDep(() => (computedObserver.value = computedFunc()))
  return computedObserver as IObserver<T>
}

// Функция отслеживания изменений watch параметра
const watch = <T>(
  watch: () => T,
  watchFunc: IWatchFunction,
  options?: { immediate: boolean }
) => {
  watchDep(watch, watchFunc)
  if (options?.immediate) {
    watchFunc(watch())
  }
}

// Функция выполняется при изменении любых внутенних observer
const watchEffect = (watchEffectFunction: () => any) => {
  watchDep(watchEffectFunction)
}

export {
  ref,
  computed,
  watch,
  watchEffect,
  rootRenderFunc,
  setRootRenderFunc,
  IWatchFunction,
  reactive,
}
