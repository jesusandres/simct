class localStorageEx {
  static get (key) {
    const value = localStorage[key]
    if (value != null) {
      const model = JSON.parse(value)
      if (model.payload != null && model.expiry != null) {
        const now = new Date()
        if (now > Date.parse(model.expiry)) {
          localStorage.removeItem(key)
          return null
        }
      }
      return JSON.parse(value).payload
    }
    return null
  }

  static set (key, value, expirySeconds) {
    const expiryDate = new Date()
    expiryDate.setSeconds(expiryDate.getSeconds() + expirySeconds)
    localStorage[key] = JSON.stringify({
      payload: value,
      expiry: expiryDate
    })
  }

  static remove (key) {
    localStorage.removeItem(key)
  }
}

export { localStorageEx }
