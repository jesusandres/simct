'use strict'

/**
 * @module control/TmpsRegister
 */

import { Register } from './partials/register.js'

/**
 * @class TmpsRegister
 * @extends Register
 * @property {Number} lastMessageStep Last message step
 *
 */
class TmpsRegister extends Register {
  constructor (container, id, x, y) {
    super(container, id, x, y)
    this.addAnchor('tmps_bus_ib', this.bbox.x + this.bbox.width, this.bbox.y + this.bbox.height * 0.5)
    this.addAnchor('alu_tmps_in', this.bbox.x, this.bbox.y)

    this.addAnchor('tmps_ib', this.bbox.x, this.bbox.y + this.bbox.height * 0.5)
    this.addAnchor('alu_tmps', this.bbox.x, this.bbox.y + this.bbox.height)

    this.lastMessageStep = 0
  }

  listen (message) {
    super.listen(message)
    switch (message.topic) {
      case 'alu-tmps':
        this.activate()
        if (message.value && message.value.step) this.lastMessageStep = message.value.step
        break
      default: {
        if (message.value && message.value.step && this.lastMessageStep !== message.value.step) this.deactivate()
      }
    }
  }
}

export { TmpsRegister }
