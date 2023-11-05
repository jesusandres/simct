'use strict'

/**
 * @module view/RegisterSR
 */

import { SVGGroup, SVGRect, SVGText } from '../svg.js'
import { SmallRegister } from './partials/smallregister.js'
import { gr } from '../gridmanager.js'
import { CtElement } from './ctelement.js'

import { Register as RegisterControl } from '../../control/register.js'

/**
 * @class RegisterSR
 * @extends CtElement
 * @property {SVGGroup} registersvg SVG group
 * @property {SVGRect} outWrap SVG rect
 * @property {SVGText} textLabel SVG text
 * @property {RegisterValue} registerValue Register value
 *
 */
class RegisterSR extends CtElement {
  constructor (container, id, x, y) {
    super()

    this.id = id

    const register = new SVGGroup('', this.id)

    const tmpText = new SVGText(...gr.gridtoxy(0.7, 3.8), id, 2 * gr.gridSize, 'component-label')
    const tmpOuter = new SVGRect(...gr.gridtoxy(0, 0), ...gr.gridtowh(21.5, 6), 'register-sq-outer')

    container
      .appendChild(register.svg)
    register
      .append(tmpOuter)
      .append(tmpText)

    this.zfr = new SmallRegister(register, ...gr.gridtoxy(4.3, 2.7), 'zf', 'ZF', 0)
    this.cfr = new SmallRegister(register, ...gr.gridtoxy(7.8, 2.7), 'cf', 'CF', 0)
    this.ofr = new SmallRegister(register, ...gr.gridtoxy(11.3, 2.7), 'of', 'OF', 0)
    this.sfr = new SmallRegister(register, ...gr.gridtoxy(14.8, 2.7), 'sf', 'SF', 0)
    this.ifr = new SmallRegister(register, ...gr.gridtoxy(18.3, 2.7), 'if', 'IF', 0)

    register.translate(x, y)

    this.bbox = tmpOuter.svg.getBBox()
    this.bbox.x = x
    this.bbox.y = y

    this.addAnchor('sr_ib', this.bbox.x, this.bbox.y)
    this.addAnchor('ib_sr', this.bbox.x, this.bbox.y + gr.gridTopx(1.5))
    this.addAnchor('alu_sr', this.bbox.x, this.bbox.y + gr.gridTopx(3))
    this.addAnchor('cli', this.bbox.x, this.bbox.y + gr.gridTopx(4.5))
    this.addAnchor('sti', this.bbox.x, this.bbox.y + gr.gridTopx(6))

    this.addAnchor('alu_sr_in', this.bbox.x + gr.gridTopx(3), this.bbox.y + this.bbox.height)

    this.addAnchor('sr_bus_ib', this.bbox.x + this.bbox.width, this.bbox.y + this.bbox.height * 0.5)

    this.addAnchor('sr_uc_up', this.bbox.x + gr.gridTopx(4), this.bbox.y)
    this.lastMessageStep = 0
  }

  updateValue (value) {
    this.zfr.updateValue((value & 0b10000) >> 4)
    this.cfr.updateValue((value & 0b01000) >> 3)
    this.ofr.updateValue((value & 0b00100) >> 2)
    this.sfr.updateValue((value & 0b00010) >> 1)
    this.ifr.updateValue((value & 0b00001))
  }

  activate () {
    this.zfr.value.addClass('active')
    this.cfr.value.addClass('active')
    this.ofr.value.addClass('active')
    this.sfr.value.addClass('active')
    this.ifr.value.addClass('active')
  }

  deactivate () {
    this.zfr.value.removeClass('active')
    this.cfr.value.removeClass('active')
    this.ofr.value.removeClass('active')
    this.sfr.value.removeClass('active')
    this.ifr.value.removeClass('active')
  }

  listen (message) {
    switch (message.topic) {
      case this.id + '_' + RegisterControl.topic.reset:
        this.updateValue(message.value)
        this.deactivate()
        break
      case this.id + '_' + RegisterControl.topic.updated:
        this.updateValue(message.value)
        break
      case 'sti':
      case 'cli':
      case 'alu-sr':
      case 'ib-sr':
        this.activate()
        if (message.value && message.value.step) this.lastMessageStep = message.value.step
        break
      default:
        if (message.value && message.value.step && this.lastMessageStep !== message.value.step) this.deactivate()
        break
    }
  }
}

export { RegisterSR }
