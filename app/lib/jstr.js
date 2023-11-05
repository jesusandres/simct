import { literals } from '../config/literals.js'

const _jStr = function (str) {
  const _str = function (str) {
    this.value = str
  }
  _str.prototype.left = function (n) { this.value = this.value.substring(0, n); return this }
  _str.prototype.right = function (n) { this.value = this.value.substring(this.value.length - n); return this }

  _str.prototype.format = function (n) {
    const args = Array.from(arguments)
    // const str = arguments[0]
    // args.shift()
    const tmp = this.value.replace(/{([0-9]+)}/g, function (match, index) {
    // check if the argument is present
      return typeof args[index] === 'undefined' ? match : args[index]
    })
    return tmp
  }

  /* istanbul ignore next */
  _str.prototype.translate = function (format = false) {
    // const prueba = import('../config/lang/' + State.config.lang + '.js')

    if (!format) return literals(this.value)
    return _jStr(literals(this.value)).format(...Array.from(arguments))
  }

  _str.prototype.toString = function () { return this.value }
  return new _str(str)
}

export { _jStr }
