export default {
  get: function (obj, path, defaultValue) {
    const keys = path.split('.');
    const isKeyArrayRegexp = /(\w+)\[(\d+)\]/gi
    let result = obj;
    for (let key of keys) {
      const [_, arrayName, arrayIndex] = isKeyArrayRegexp.exec(key) ?? [];
      result = arrayName ? obj[arrayName][arrayIndex] : result[key];

      if (result === undefined) {
        return defaultValue;
      }
    }
    return result ?? defaultValue;
  }
}