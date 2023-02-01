import { isObject, flat, omit, classNames } from './index'

describe('Utils tests', () => {
  test('should return object with deleted field', () => {
    const obj = {
      a: 1,
      b: 2,
      c: 3,
    }
    expect(omit(obj, ['a'])).toEqual({
      b: 2,
      c: 3,
    })
  })

  test('should return false if null passed', () => {
    expect(isObject(null)).toBe(false)
  })

  test('should return false if undefined passed', () => {
    expect(isObject(undefined)).toBe(false)
  })

  test('should return false if array passed', () => {
    expect(isObject([])).toBe(false)
  })

  test('should return false if function passed', () => {
    expect(isObject(() => {})).toBe(false)
  })

  test('should return true if object passed', () => {
    expect(
      isObject({
        a: 1,
      })
    ).toBe(true)
  })

  test('should return flatted array', () => {
    expect(
      flat([1, 2, { length: 10 }, ['3'], ['4', [null, 1, 2, [3, 4, 5]], 6]])
    ).toEqual([1, 2, { length: 10 }, '3', '4', null, 1, 2, 3, 4, 5, 6])
  })

  test('should return classnames string if string with extra spaces passed', () => {
    expect(classNames('foo ', ' bar')).toBe('foo bar')
  })

  test('should return classnames string if string and object(true value) passed', () => {
    expect(classNames('foo', { bar: true })).toBe('foo bar')
  })
})
