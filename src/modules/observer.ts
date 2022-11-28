import { IWatchFunction } from './reactivity'

interface IObserver<T = any> {
  value: T,
  deps: Set<IWatchFunction>
}

const observer = <T>(value: T, deps: any[] = []): IObserver<T> => {
  return {
    value,
    deps: new Set(deps)
  }
}

export {
  observer,
  IObserver
}

