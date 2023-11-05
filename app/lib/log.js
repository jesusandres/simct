/* istanbul ignore next */
class Log {
  /* istanbul ignore next */
  static instance = null
  static mode = {
    none: 0,
    console: 1,
    view: 2,
    both: 3
  }

  /* istanbul ignore next */
  static getInstance () {
    if (!Log.instance) {
      Log.instance = new Log()
    }
    return Log.instance
  }

  /* istanbul ignore next */
  constructor () {
    this.mode = Log.mode.none
  }

  /* istanbul ignore next */
  info (message) {
    if (this.mode === Log.mode.console || this.mode === Log.mode.both) {
      console.log(message)
    }
    if (this.mode === Log.mode.view || this.mode === Log.mode.both) {
      // tbd
    }
  }

  /* istanbul ignore next */
  table (message) {
    if (this.mode === Log.mode.console || this.mode === Log.mode.both) {
      console.table(message)
    }
    if (this.mode === Log.mode.view || this.mode === Log.mode.both) {
      // tbd
    }
  }
}

/* istanbul ignore next */
module.exports = Log.getInstance()
