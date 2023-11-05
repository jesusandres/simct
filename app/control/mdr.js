'use strict'
/**
 * @module control/mdr
 */
import { Bit16Val } from '../lib/bit16val.js'
import { Observable } from '../lib/observer.js'
import { Register } from './register.js'

/**
 * @class Mdr
 * @extends Register
 * @property {Bit16Val} value Value of the register
 * @property {Observable.transmit_mode} transmit Transmission mode of the register
 */
class Mdr extends Register {
  constructor (value = 0) {
    super('MDR', value)
  }

  listen (message) {
    switch (message.topic) {
      case 'SDB-bus_' + Bit16Val.topic.updated:
        this.transmit = Observable.transmit_mode.off
        this.value = message.value
        this.transmit = Observable.transmit_mode.on
        break
    }
  }
}

export { Mdr }
