'use strict'
/**
 * @fileoverview Sab class
 */
import { Bus } from './bus.js'
import { Bit16Val } from '../lib/bit16val.js'

/**
 * @class Sab
 * @extends Bus
 * @description Emulates a Computer Bus
 */
class Sab extends Bus {
  constructor () {
    super('SAB', 0x0000)
  }

  listen (message) {
    switch (message.topic) {
      case 'MAR_' + Bit16Val.topic.updated:
        this.value = message.value
        break
    }
  }
}

export { Sab }
