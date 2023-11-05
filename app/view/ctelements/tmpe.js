'use strict'

/**
 * @module control/actions
 */

import { Register } from './partials/register.js'

/**
 * @class TmpeRegister
 * @extends Register
 * @property {Number} lastMessageStep Last message step
 * @property {Object} labels Labels
 *
 */
class TmpeRegister extends Register {
  constructor (container, id, x, y) {
    super(container, id, x, y)
    this.addAnchor('tmpe_ib_bus_tmpe', this.bbox.x + this.bbox.width, this.bbox.y + this.bbox.height * 0.5)

    this.addAnchor('ib_tmpe_signal', this.bbox.x, this.bbox.y)

    this.addAnchor('tmpe_clr', this.bbox.x, this.bbox.y + this.bbox.height * 0.5)
    this.addAnchor('tmpe_set', this.bbox.x, this.bbox.y + this.bbox.height)

    this.addAnchor('tmpe_alu_bus', this.bbox.x + this.bbox.width * 0.5, this.bbox.y)

    this.lastMessageStep = 0
  }

  listen (message) {
    super.listen(message)
    switch (message.topic) {
      case 'ib-tmpe':
      case 'tmpe-set':
      case 'tmpe-clr':
        this.activate()
        if (message.value && message.value.step) this.lastMessageStep = message.value.step
        break
      default: {
        if (message.value && message.value.step && this.lastMessageStep !== message.value.step) this.deactivate()
      }
    }
  }
}

export { TmpeRegister }
