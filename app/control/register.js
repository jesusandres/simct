'use strict'
/**
 * @fileoverview Register class
 */
import { Bit16Val } from '../lib/bit16val.js'

/**
 * @class Register
 * @extends Bit16Val
 * @description Emulates a Computer register
 * @param { string } name - Register name
 * @param { int } value - Register initial value
 *
 */
class Register extends Bit16Val {
  constructor (name, value = 0) {
    super(name, value)
  }

  /**
   * @method get name
   * @returns { string } Register name
   */
  get value () {
    return super.value
  }

  /**
   * @method set name
   * @param { string } newname - Register name
   */
  set value (newvalue) {
    super.value = newvalue
    this.broadCast({ topic: this._name + '_' + Register.topic.updated, value: this.value })
  }

  /**
   * @method reset
   * @description Reset register value to 0
   *
   */
  reset () {
    super.value = 0
    this.broadCast({ topic: this._name + '_' + Register.topic.reset, value: this.value })
  }
}

export { Register }
