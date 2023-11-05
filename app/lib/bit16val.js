'use strict'
/**
 * @module lib/bit16val
 */
import { baseConvert as _bc } from './baseconvert.js'
import { Observable } from './observer.js'

/**
 * @class Bit16Val
 * @extends Observable
 * @property {string} _name Name of the value
 * @property {number} _value Value
 * @property {string} topic Topics used by the device
 * @property {string} error Errors used by the device
 * @property {string} hex Hexadecimal representation of the value
 * @property {string} hex8 Hexadecimal representation of the value (8 bits)
 * @property {string} bin Binary representation of the value
 * @property {number} value8 Value (8 bits)
 */
class Bit16Val extends Observable {
  static topic = {
    updated: 'updated-value',
    reset: 'reset-value'
  }

  static error = {
    type: 'error.Bit16Val.type',
    range: 'error.Bit16Val.range'
  }

  constructor (name, value) {
    super()

    this._name = name
    this._value = value
  }

  get name () {
    return this._name
  }

  get value () {
    return this._value
  }

  set value (newValue) {
    if (typeof newValue !== 'number') throw Error(Bit16Val.error.type)
    if (newValue > 0xFFFF) throw Error(Bit16Val.error.range)
    this._value = newValue
  }

  get value8 () {
    return this.value & 0xFF
  }

  get hex () {
    return _bc.dec2hex(this.value)
  }

  get hex8 () {
    return _bc.dec2hex(this.value8)
  }

  get bin () {
    return _bc.dec2bin(this.value)
  }

  set value8 (value) {
    this.value = value & 0xFF
  }

  set hex (value) {
    this.value = _bc.hex2dec(value)
  }

  set hex8 (value) {
    this.value = _bc.hex2dec(value) & 0xFF
  }

  set bin (value) {
    this.value = _bc.bin2dec(value)
  }
}

export { Bit16Val }
