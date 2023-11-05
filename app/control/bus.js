'use strict'
/**
 * @module control/bus
 */
import { Bit16Val } from '../lib/bit16val.js'

/**
 * @class Bus
 * @extends Bit16Val
 * @property {number} value Value of the bus
 * @property {string} _name Name of the bus
 */
class Bus extends Bit16Val {
  constructor (name, value) {
    super(name + '-bus', value)
  }

  /**
   * @method value Get the value of the bus
   * @return {number} Value of the bus
   */
  get value () {
    return super.value
  }

  /**
   * @method reset Reset the bus
   */
  reset () {
    super.value = 0x0000
    this.broadCast({ topic: this._name + '_' + Bus.topic.reset, value: this.value })
  }

  /**
   * @method value Set the value of the bus
   * @param { int } newvalue int of 16bit range
   */
  set value (newvalue) {
    super.value = newvalue
    this.broadCast({ topic: this._name + '_' + Bus.topic.updated, value: this.value })
  }
}

export { Bus }
