'use strict'
/**
 * @fileoverview Sdb class
 */
import { Bus } from './bus.js'
import { Register } from './register.js'

/**
 * @class Sdb
 * @extends Bus
 * @description Emulates a Computer Bus
 */
class Sdb extends Bus {
  constructor () {
    super('SDB', 0x0000)
  }

  listen (message) {
    switch (message.topic) {
      case 'MDR_' + Register.topic.updated:
        this.value = message.value
        break
    }
  }
}

export { Sdb }
