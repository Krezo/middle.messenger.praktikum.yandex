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

function capitalizeFirstLetter(string: string) {
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

export { queryStringify, capitalizeFirstLetter, createFormData, isSetEquals }
