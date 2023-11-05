'use strict'

/**
 * @module control/anchor
 */

import { _jStr } from '../../lib/jstr.js'
import { gr } from '../gridmanager.js'
import { Bus } from './partials/bus.js'
import { Bus as BusControl } from '../../control/bus.js'

/**
 * @class BusSDB
 * @extends Bus
 * @property {Number} lastMessageStep Last message step
 * @property {Object} labels Labels
 *
 */
class BusSDB extends Bus {
  static labels = {
    data_bus: 'labels.bussdb.data_bus'
  }

  reset () {
    this.updateValue(0x0000)
  }

  constructor (container, id, x, y) {
    super(container, id, x, y)

    this.width = gr.gridTopx(46)
    this.setLabel(_jStr(BusSDB.labels.data_bus).translate())

    this.addAnchor('bus_sdb_orig', this.bbox.x, this.bbox.y)
    this.addAnchor('bus_sdb_orig_bottom', this.bbox.x, this.bbox.y + this.bbox.height)

    this.addAnchor('sdb_io_bus', this.bbox.x + this.bbox.width - gr.gridTopx(4), this.bbox.y + this.bbox.height)

    this.lastMessageStep = 0
  }

  // activate () {
  //   this.bussvg.addClass('active')
  // }

  // deactivate () {
  //   this.bussvg.removeClass('active')
  // }

  listen (message) {
    super.listen(message)
    switch (message.topic) {
      case this.id + '-bus_' + BusControl.topic.reset:
        this.updateValue(message.value)
        this.deactivate()
        break
      case 'mdr-ib':
      case 'ib-mdr':
        this.activate()
        if (message.value && message.value.step) this.lastMessageStep = message.value.step
        break
      default: {
        if (message.value && message.value.step && this.lastMessageStep !== message.value.step) this.deactivate()
      }
    }
  }
}

export { BusSDB }
