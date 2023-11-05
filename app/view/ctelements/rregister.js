'use strict'

/**
 * @module control/RRegister
 */

import { Register } from './partials/register.js'
import { gr } from '../gridmanager.js'

/**
 * @class RRegister
 * @extends Register
 * @property {Number} lastMessageStep Last message step
 * @property {Object} labels Labels
 *
 */
class RRegister extends Register {
  constructor (container, id, x, y, callable = null, checkEditable = null) {
    super(container, id, x, y, false, callable, checkEditable)

    this.addAnchor(this.id + '_ib', this.bbox.x + this.bbox.width, this.bbox.y)
    this.addAnchor('ib_' + this.id, this.bbox.x + this.bbox.width, this.bbox.y + gr.gridTopx(1.2))
    this.addAnchor('ibh_' + this.id + 'h', this.bbox.x + this.bbox.width, this.bbox.y + gr.gridTopx(2.4))
    this.addAnchor('ibl_' + this.id + 'l', this.bbox.x + this.bbox.width, this.bbox.y + gr.gridTopx(3.6))

    this.addAnchor('ibbus_' + this.id, this.bbox.x, this.bbox.y + this.bbox.height / 2)

    this.addAnchor('reg_orig_' + this.id, this.bbox.x, this.bbox.y)
    this.lastMessageStep = 0
  }

  listen (message) {
    super.listen(message)

    switch (message.topic) {
      case 'ibh-' + this.id.toLowerCase() + 'h':
      case 'ibl-' + this.id.toLowerCase() + 'l':
      case 'ib-' + this.id.toLowerCase():
        this.activate()
        if (message.value && message.value.step) this.lastMessageStep = message.value.step
        break

      default:

        if (message.value && message.value.step && this.lastMessageStep !== message.value.step && message.value.step) this.deactivate()
        break
    }
  }
}

export { RRegister }
