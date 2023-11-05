'use strict'
/**
 * @module control/actions
 */

import { Register as RegisterControl } from '../../control/register.js'
import { SignalManager } from '../../control/signalmanager.js'
import { Bus as BusControl } from '../../control/bus.js'

import { Register } from './partials/register.js'

/**
 * @class IB
 * @extends Register
 * @property {Number} lastMessageStep Last message step
 * @property {Object} labels Labels
 *
 */
class IB extends Register {
  constructor (container, id, x, y) {
    super(container, id, x, y)

    this.addAnchor('tmpe_ib_bus_ib', this.bbox.x + this.bbox.width + 1, this.bbox.y + this.bbox.height)
    this.addAnchor('ib_registers', this.bbox.x + this.bbox.width, this.bbox.y + this.bbox.height)
    this.lastMessageStep = 0
  }

  listen (message) {
    if (/.*-ib.*/.test(message.topic)) {
      this.activate()
      if (message.value && message.value.step) this.lastMessageStep = message.value.step
    } else {
      switch (message.topic) {
        case this.id + '-bus_' + BusControl.topic.reset:
          this.updateValue(message.value)
          this.deactivate()
          break
        case this.id + '-bus_' + RegisterControl.topic.updated:
          this.updateValue(message.value)
          break
        default:
          if ((message.value && message.value.step && this.lastMessageStep !== message.value.step) || (message.topic === SignalManager.topic.empty)) this.deactivate()
          break
      }
    }
  }
}

export { IB }
