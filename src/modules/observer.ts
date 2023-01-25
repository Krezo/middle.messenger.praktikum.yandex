import { IWatchFunction } from './reactivity'

interface IObserver<T = any> {
  value: T
  deps: Set<IWatchFunction<unknown>>
}

const isObserver = <T>(object: any): object is IObserver<T> => {
  if (typeof object === 'object' && object !== null) {
    return 'value' in object && 'deps' in object
  }
  return false
}

const observer = <T>(
  value: T,
  deps: IWatchFunction<unknown>[] = [],
): IObserver<T> => ({
    value,
    deps: new Set(deps),
  })

export { observer, IObserver, isObserver }
