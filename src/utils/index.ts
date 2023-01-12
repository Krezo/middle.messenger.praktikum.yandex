function queryStringify(data: object, prefix?: string): string {
  let str = [],
    p
  for (p in data) {
    if (data.hasOwnProperty(p)) {
      let k = prefix ? prefix + '[' + p + ']' : p,
        v = data[p as keyof typeof data]
      str.push(
        v !== null && typeof v === 'object'
          ? queryStringify(v, k)
          : encodeURIComponent(k) + '=' + encodeURIComponent(v)
      )
    }
  }
  return str.join('&')
}

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

const createFormData = (data: Record<string, any>): FormData => {
  const formData = new FormData()
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const item = data[key]
      // const fileData = item.arrayBuffer()
      // if (item instanceof File) {
      //   formData.append(key, fileData, data.name)
      //   continue
      // }
      formData.append(key, item)
    }
  }
  return formData
}

export { queryStringify, capitalizeFirstLetter, createFormData }
