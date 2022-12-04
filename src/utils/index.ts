function queryStringify(data: object, prefix?: string) {
  var str = [],
    p;
  for (p in data) {
    if (data.hasOwnProperty(p)) {
      var k = prefix ? prefix + "[" + p + "]" : p,
        v = data[p];
      str.push((v !== null && typeof v === "object") ?
        queryStringify(v, k) :
        encodeURIComponent(k) + "=" + encodeURIComponent(v));
    }
  }
  return str.join("&");
}

export {
  queryStringify
}