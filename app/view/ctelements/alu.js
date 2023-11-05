'use strict'

/**
 * @module view/ctelements/alu
 */

import { RectPoints } from '../../lib/rectpoints.js'
import { Unit, gr, measureSVGText } from '../gridmanager.js'
import { SVGGroup, SVGPolygon, SVGText } from '../svg.js'
import { CtElement } from './ctelement.js'
import { RegisterValue } from './partials/registervalue.js'
import { Alu as AluControl } from '../../control/alu.js'
import { SignalManager } from '../../control/signalmanager.js'

/**
 * @class Alu
 * @extends CtElement
 * @property {SVGGroup} alusvg SVG group
 * @property {SVGPolygon} keystone SVG polygon
 * @property {SVGText} Operation SVG text
 * @property {RegisterValue} Result Register value
 * @property {RegisterValue} Op1 Register value
 * @property {RegisterValue} Op2 Register value
 *
 */
class Alu extends CtElement {
  constructor (container, id, x, y) {
    super()

    const fontSize = gr.gridSize * 2.5

    this.id = id

    this.alusvg = new SVGGroup('', this.id)

    const opLabelSz = measureSVGText('OPR', fontSize)

    this.Operation = new SVGText(0, 0, 'ADD', gr.gridSize * 1.72, 'alu-text')

    this.keystone = new SVGPolygon('', 'alu-keystone')
    this.keystone.setUnit(Unit.grid).go(0, gr.gridSize).go(0.6 * gr.gridSize, -gr.gridSize).goRight(2 * gr.gridSize).go(0.6 * gr.gridSize, gr.gridSize).goLeft(1.4 * gr.gridSize).go(-0.2 * gr.gridSize, -0.3 * gr.gridSize).go(-0.2 * gr.gridSize, 0.3 * gr.gridSize)

    this.recLeft = new RectPoints(0, gr.gridTopx(gr.gridSize), gr.gridTopx(0.6 * gr.gridSize), 0)
    this.recRight = new RectPoints(gr.gridTopx(2.6 * gr.gridSize) + gr.gridSize / 2, 0, gr.gridTopx(3.20 * gr.gridSize) + gr.gridSize / 2, gr.gridTopx(gr.gridSize))

    const wrapOperation = new SVGPolygon('', 'alu-reg-operation')

    wrapOperation.setUnit(Unit.grid)
      .addPoint(this.recLeft.getX(gr.gridTopx(0.3 * gr.gridSize) - 3), gr.gridTopx(0.3 * gr.gridSize))
      .goRight(gr.pxTogrid(opLabelSz.width))
      .goDown(gr.pxTogrid(gr.gridSize * 2))
      .addPoint(this.recLeft.getX(gr.gridTopx(0.3 * gr.gridSize) - 3 + 2 * gr.gridSize), gr.gridTopx(0.3 * gr.gridSize) + 2 * gr.gridSize)

    this.Operation.x = this.recLeft.getX(gr.gridTopx(0.30 * gr.gridSize))
    this.Operation.y = gr.gridTopx(0.32 * gr.gridSize) + opLabelSz.height - 2 * opLabelSz.heightAdjust

    container.appendChild(this.alusvg.svg)

    this.alusvg.append(this.keystone)

    this.alusvg.translate(x, y)
    const label = new SVGText(0, 0, 'ALU', fontSize, 'component-label')
    this.alusvg
      .append(wrapOperation)
      .append(label)

    this.Result = new RegisterValue(this.alusvg, ...gr.gridtoxy(0, 0), false)
    this.Op1 = new RegisterValue(this.alusvg, ...gr.gridtoxy(0, 0), false)
    this.Op2 = new RegisterValue(this.alusvg, ...gr.gridtoxy(0, 0), false)

    this.Result.translate(gr.gridTopx(3.2 * gr.gridSize / 2) - (this.Result.getBBox().width / 2), 0)
    this.Op1.translate(this.Result.getBBox().x - this.Op1.getBBox().width - gr.gridTopx(0.2 * gr.gridSize), gr.gridTopx(gr.gridSize) - this.Op1.getBBox().height)
    this.Op2.translate(this.Result.getBBox().x + this.Result.getBBox().width + gr.gridTopx(0.2 * gr.gridSize), gr.gridTopx(gr.gridSize) - this.Op2.getBBox().height)

    label.x = gr.gridTopx(3.2 * gr.gridSize / 2) - measureSVGText('ALU', fontSize).width / 2
    label.y = fontSize + gr.gridTopx(0.30 * gr.gridSize)

    this.alusvg.append(this.Operation)

    this.bbox = { x, y, width: gr.gridTopx(3.20 * gr.gridSize), height: gr.gridTopx(gr.gridSize) }

    this.addAnchor('alu_sr_out', this.bbox.x + this.recLeft.getX(0.6 * gr.gridSize), this.bbox.y + 0.6 * gr.gridSize)
    this.addAnchor('alu_op_in', this.bbox.x + this.recLeft.getX(this.bbox.height * 0.4), this.bbox.y + this.bbox.height * 0.4)
    this.addAnchor('alu_carry_in', this.bbox.x + this.recLeft.getX(this.bbox.height * 0.8), this.bbox.y + this.bbox.height * 0.8)

    this.addAnchor('alu_carry_out', this.bbox.x + this.recLeft.getX(this.bbox.height * 0.8), this.bbox.y + this.bbox.height * 0.8)

    this.addAnchor('alu_tmps_out', this.bbox.x + this.recRight.getX(0) - 5, this.bbox.y)

    this.addAnchor('alu_ib_bus', this.bbox.x + this.bbox.width - gr.gridTopx(7), this.bbox.y + this.bbox.height)

    this.addAnchor('alu_orig_bottom', this.bbox.x, this.bbox.y + this.bbox.height)

    this.lastMessageStep = 0
  }

  /**
   * @method scale Scale the element
   * @param {Number} n Scale factor
   */
  scale (n) {
    this.keystone.scale(n)
  }

  /**
   * @method updateValue Update the value of the register
   * @param {*} value Value to update
   */
  updateValue (value) {
    this.Op1.text = value.op1
    this.Op2.text = value.op2

    this.Result.text = value.result.value
    if (value.op.toUpperCase() !== 'FAKE') this.Operation.text = value.op.toUpperCase()
  }

  /**
   * @method activate Activate the element
   */
  activate () {
    this.Result.value.addClass('active')
  }

  listen (message) {
    if (/.*-ib.*/.test(message.topic)) {
      this.Op1.value.removeClass('active')
      this.Op2.value.addClass('active')
      this.Result.value.addClass('active')
      this.Operation.removeClass('active')
      if (message.value && message.value.step) this.lastMessageStep = message.value.step
    } else {
      switch (message.topic) {
        case AluControl.topic.reset:
          this.Result.value.removeClass('active')
          this.Operation.removeClass('active')
          this.Op1.value.removeClass('active')
          this.Op2.value.removeClass('active')
          this.updateValue(message.value)
          break
        case AluControl.topic.updated:
          this.updateValue(message.value)
          break
        case 'alu-op':
          this.Result.value.addClass('active')
          this.Operation.addClass('active')
          if (message.value && message.value.step) this.lastMessageStep = message.value.step
          break
        case 'tmpe-set':
        case 'ib-tmpe':
          this.Op1.value.addClass('active')
          this.Op2.value.removeClass('active')
          this.Result.value.addClass('active')
          this.Operation.removeClass('active')
          if (message.value && message.value.step) this.lastMessageStep = message.value.step
          break
        case 'tmpe-clr':
          this.Op1.value.addClass('active')
          this.Operation.removeClass('active')
          if (message.value && message.value.step) this.lastMessageStep = message.value.step
          break
        default: {
          if ((message.value && message.value.step && this.lastMessageStep !== message.value.step) || (message.topic === SignalManager.topic.empty)) {
            this.Result.value.removeClass('active')
            this.Operation.removeClass('active')
            this.Op1.value.removeClass('active')
            this.Op2.value.removeClass('active')
          }
        }
      }
    }
  }
}

export { Alu }
