function queryStringify(data: object, prefix?: string): string {
  const str = []
  let p
  for (p in data) {
    if (data.hasOwnProperty(p)) {
      const k = prefix ? `${prefix}[${p}]` : p
      const v = data[p as keyof typeof data]
      str.push(
        v !== null && typeof v === 'object'
          ? queryStringify(v, k)
          : `${encodeURIComponent(k)}=${encodeURIComponent(v)}`
      )
    }
  }
  return str.join('&')
}

const isSetEquals = (a: Set<unknown>, b: Set<unknown>) =>
  a.size === b.size && [...a].every((x) => b.has(x))

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

const createFormData = (data: Record<string, any>): FormData => {
  const formData = new FormData()
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const item = data[key]
      formData.append(key, item)
    }
  }
  return formData
}

const flat = (array: unknown[]) => {
  const returnArray: unknown[] = []
  for (const arrayItem of array) {
    if (Array.isArray(arrayItem)) {
      returnArray.push(...flat(arrayItem))
      continue
    }
    returnArray.push(arrayItem)
  }
  return returnArray
}

const isObject = (object: any): object is object => {
  return typeof object === 'object' && !Array.isArray(object) && object !== null
}

const unzip = (...arrays: unknown[][]) => {
  arrays.forEach((array, index) => {
    if (!Array.isArray(array)) {
      throw new Error(`${index} is not array`)
    }
  })
  const maxArrayLength = Math.max(...arrays.map((array) => array.length))
  const returnArrays: unknown[] = []
  for (let i = 0; i < maxArrayLength; i++) {
    const array: unknown[] = []
    for (let j = 0; j < arrays.length; j++) {
      array.push(arrays[j][i])
    }
    returnArrays.push(array)
  }
  return returnArrays
}

const classNames = (...classItems: (unknown | object | unknown[])[]) => {
  const _classNames: string[] = []
  classItems.forEach((classItem) => {
    if (typeof classItem === 'string') {
      _classNames.push(classItem)
      return
    }
    if (typeof classItem === 'number' && classItem > 0) {
      _classNames.push(classItem.toString())
      return
    }
    if (isObject(classItem)) {
      Object.entries(classItem).map(([k, v]) => {
        if (!!v) {
          _classNames.push(k)
        }
      })
      return
    }
    if (Array.isArray(classItem)) {
      _classNames.push(...classNames(...classItem).split(' '))
      return
    }
  })

  return _classNames.join(' ').replace(/\s+/g, ' ').trim() || ''
}

// classNames(...['class1', 'class2', ' class3', ['class4class5']])

const omit = <T extends object, E extends keyof T>(
  obj: T,
  fields: E[]
): Omit<T, E> => {
  const shallowCopy = { ...obj }
  fields.forEach((field) => {
    delete shallowCopy[field]
  })
  return shallowCopy
}

export {
  queryStringify,
  capitalizeFirstLetter,
  createFormData,
  isSetEquals,
  isObject,
  omit,
  flat,
  classNames,
  unzip,
}
