class Observer {
  constructor () {
    this.messages = []
  }

  listen (message) {
    this.messages[this.messages.length] = message
  }

  get lastMessage () {
    return this.messages[this.messages.length - 1]
  }

  clear () {
    this.messages = []
  }
}

export { Observer }
