'use strict'

/**
 * @module control/Trigger
 */

import { SVGGroup, SVGRect } from '../svg.js'

import { Unit, gr } from '../gridmanager.js'
import { CtElement } from './ctelement.js'
import { SVGPolyline } from '../svg/polyline.js'
import { ContextMenu } from '../navigation/contextmenu.js'
import { Computer } from '../../control/computer.js'
import { actions } from '../../control/actions.js'

/**
 * @class Trigger
 * @extends CtElement
 * @property {SVGGroup} registersvg SVG group
 * @property {SVGRect} outWrap SVG rect
 * @property {SVGText} textLabel SVG text
 * @property {RegisterValue} registerValue Register value
 *
 */
class Trigger extends CtElement {
  constructor (container, id, x, y, ct) {
    super()
    this.clicks = 0
    this.id = id

    const group = new SVGGroup('', this.id)
    container.appendChild(group.svg)

    const outerWrapper = new SVGRect(...gr.gridtoxy(0, 0), ...gr.gridtowh(4, 4), 'register-sq-outer')

    const triggerline = new SVGPolyline('triggerline', ...gr.gridtoxy(0.5, 2.8)).setUnit(Unit.grid).goRight(1.5).goUp(1.5).goRight(1.5)

    group.append(outerWrapper)
    group.append(triggerline)

    group.translate(x, y)

    this.bbox = outerWrapper.svg.getBBox()
    this.bbox.x = x
    this.bbox.y = y

    this.svg = group.svg
    const _this = this
    this.svg.addEventListener('click', function () {
      actions.runStep(ct)
      this.setAttribute('data-clicks', ++_this.clicks)
    })

    this.addAnchor('trigger_out_clock', this.bbox.x + this.bbox.width, this.bbox.y + gr.gridTopx(2))

    const items = [{
      label: 'Ejecutar instrucción',
      callback: function () {
        actions.runInstruction(ct)
      }
    }, {
      label: function () { return ct.cpu.clock.status === Computer.cpu.clock.status.started ? 'Stop' : 'Run' },
      callback: function (e) {
        if (ct.cpu.clock.status === Computer.cpu.clock.status.stopped) actions.runProgram(ct)
        else actions.stopProgram(ct)
      }
    }
    ]

    ContextMenu.new(group.svg, items)
  }
}

export { Trigger }
