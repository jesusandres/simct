'use strict'

/**
 * @module control/actions
 */

import { _jStr } from '../../lib/jstr.js'
import { gr } from '../gridmanager.js'
import { Bus } from './partials/bus.js'

/**
 * @class BusSCB
 * @extends Bus
 * @property {Object} labels Labels
 */
class BusSCB extends Bus {
  static labels = {
    control_bus: 'labels.busscb.control_bus'
  }

  constructor (container, id, x, y) {
    super(container, id, x, y)

    this.width = gr.gridTopx(46)
    this.setLabel(_jStr(BusSCB.labels.control_bus).translate())

    this.Busvalue.remove()

    this.addAnchor('int_signal', this.bbox.x + gr.gridTopx(4), this.bbox.y)

    this.addAnchor('memory_write_read', this.bbox.x + gr.gridTopx(4), this.bbox.y + this.bbox.height)
    this.addAnchor('io_write_read', this.bbox.x + this.bbox.width - gr.gridTopx(4), this.bbox.y + this.bbox.height)

    this.addAnchor('io_inta', this.bbox.x + this.bbox.width, this.bbox.y)
    this.addAnchor('io_int', this.bbox.x + this.bbox.width - gr.gridTopx(0.4), this.bbox.y + gr.gridTopx(1.3))

    this.addAnchor('bus_scb_inta_in', this.bbox.x + this.bbox.width - gr.gridTopx(2), this.bbox.y)
    this.addAnchor('bus_scb_write_in', this.bbox.x + this.bbox.width - gr.gridTopx(4), this.bbox.y)
    this.addAnchor('bus_scb_read_in', this.bbox.x + this.bbox.width - gr.gridTopx(3), this.bbox.y)
  }
}

export { BusSCB }
