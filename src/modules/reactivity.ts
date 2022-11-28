import { IObserver, observer } from './observer';

interface IWatchFunction<T = any> {
  (oldValue?: any, newValue?: any): void
}

const globalState: Record<string, any> = {};

let isRenderFuncRunning: boolean = false;
let rootRenderFunc: any = null;

const setRootRenderFunc = (renderFunc: (...params: any) => void) => {
  rootRenderFunc = renderFunc;
}

// Отслеживание зависимостей observer
let isWatchFunction: boolean = false;
let watchFunction: IWatchFunction;

// Реализация Proxy обертки на observer для автоматического определения зависимостей
const ref = <T>(value: T) => {
  return new Proxy(observer(value), {
    get(target, prop) {
      const propString = prop.toString();
      if (propString in target) {
        if (propString == 'value' && isWatchFunction) {
          target.deps.add(watchFunction)
        }
        return target[propString as keyof typeof target];
      }
    },
    set(target, prop, newValue) {
      const propString = prop.toString();
      const oldValue = target[propString as keyof typeof target];
      target[propString as keyof typeof target] = newValue;
      if (propString == 'value' && oldValue !== newValue) {
        target.deps.forEach(dep => dep(newValue, oldValue))
      }
      return true;
    }
  })
}

// Ключ для проверки является ли возвращаемый реактивный объект прокси
let isProxy = Symbol('isProxy');

const reactive = <T extends object>(value: T, deep = false) => {
  // Копия настоящего объекта, для возможности обращение без .value
  const refValue: Record<string | symbol, any> = {}

  for (const key in value) {
    if (typeof value[key] === 'object') {
      // Обрачиваем объект в observer, можно не оборачивать
      // тогда пропадет возможность отслеживать изменения прокси объекта
      refValue[key] = ref(reactive(value[key] as object))
    } else
      // Обычный observer
      refValue[key] = ref(value[key])
  }

  return new Proxy(value, {
    get(target, prop) {
      if (prop === isProxy) {
        return true;
      }
      // Если объект Proxy(observer), то возвращаем observer value
      if (refValue[prop]?.value?.[isProxy]) {
        return refValue[prop].value;
      }
      const propString = prop.toString();
      // Проверяем, можем ли привязать зависимость
      if (propString in target && isWatchFunction && 'deps' in (refValue[propString] || {})) {
        refValue[propString].deps.add(watchFunction)
      }
      return target[propString as keyof typeof target];
    },
    set(target, prop, newValue: any) {
      const propString = prop.toString();
      const oldValue = target[propString as keyof typeof target];
      if (refValue[prop]?.value?.[isProxy]) {
        refValue[prop].value = newValue;
      } else
        target[propString as keyof typeof target] = newValue;
      if ('deps' in (refValue[propString] || {}) && oldValue !== newValue) {
        refValue[propString].deps.forEach(dep => dep(newValue, oldValue))
      }
      return true;
    }
  })
}

// Вспомогательная функция для привязки зависимостей observer
const watchDep = (watch: (...params: any) => void, watchFunc?: IWatchFunction) => {
  isWatchFunction = true;
  watchFunction = watchFunc ? watchFunc : watch;
  watch();
  isWatchFunction = false;
}

// Вычисляемый observer 
const computed = <T>(computedFunc: () => T) => {
  const computedObserver = ref(computedFunc());
  watchDep(() => computedObserver.value = computedFunc());
  return computedObserver;
}

// Функция отслеживания изменений watch параметра
const watch = <T>(watch: () => T, watchFunc: IWatchFunction, options?: { immediate: boolean }) => {
  watchDep(watch, watchFunc)
  if (options?.immediate) {
    watchFunc(watch())
  }
}

// Функция выполняется при изменении любых внутенних observer
const watchEffect = <T>(watchEffectFunction: () => any) => {
  watchDep(watchEffectFunction)
}


const render = computed;
// const computedVal = (func: any) => computed(() => func).value;

export {
  ref,
  computed,
  watch,
  watchEffect,
  rootRenderFunc,
  setRootRenderFunc,
  render,
  IWatchFunction,
  reactive
}









