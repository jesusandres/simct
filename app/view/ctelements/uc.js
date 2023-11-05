'use strict'

/**
 * @module control/Uc
 */
import { Uc as UcControl } from '../../control/uc.js'
import { SVGGroup, SVGRect, SVGText, SVGTextMultiCaps } from '../svg.js'
import { gr } from '../gridmanager.js'
import { CtElement } from './ctelement.js'
import { _jStr } from '../../lib/jstr.js'

/**
 * @class Uc
 * @extends CtElement
 * @property {Object} labels Labels
 * @property {SVGText} step Step
 * @property {SVGTextMultiCaps} signalsBlock Signals block
 * @property {SVGRect} signalsBlockContainer Signals block container
 * @property {Function} sselector Signal selector
 *
 */
class Uc extends CtElement {
  static labels = {
    controllabel: 'labels.ctuc.controllabel',
    steplabel: 'labels.ctuc.steplabel'
  }

  constructor (container, id, x, y) {
    super()

    this.sselector = null
    this.id = id

    const group = new SVGGroup('', this.id)

    this.step = new SVGText(...gr.gridtoxy(12.5, 16), '0', 1.8 * gr.gridSize, 'register-value')
    this.signalsBlock = new SVGTextMultiCaps(...gr.gridtoxy(1, 2), [], 1.2 * gr.gridSize, 'register-value')
    this.signalsBlockContainer = new SVGRect(...gr.gridtoxy(0.5, 0.5), ...gr.gridtowh(8.5, 17), 'register-sq-inner')
    this.signalsBlock.svg.addEventListener('click', (e) => { if (this.sselector) this.sselector() })
    this.signalsBlockContainer.svg.addEventListener('click', () => { if (this.sselector) this.sselector() })

    container.appendChild(group.svg)

    const outerWrapper = new SVGRect(...gr.gridtoxy(0, 0), ...gr.gridtowh(17, 18), 'register-sq-outer')
    group.append(outerWrapper)
      .append(this.signalsBlockContainer)
      .append(this.signalsBlock)
      .append(new SVGRect(...gr.gridtoxy(9.5, 10.5), ...gr.gridtowh(7, 7), 'register-sq-step'))
      .append(new SVGText(...gr.gridtoxy(10.9, 6.5), _jStr(Uc.labels.controllabel).translate(), 2.5 * gr.gridSize, 'component-label'))
      .append(new SVGText(...gr.gridtoxy(10.8, 13), _jStr(Uc.labels.steplabel).translate(), 1.8 * gr.gridSize, 'register-value'))
      .append(this.step)

    group.translate(x, y)

    this.bbox = outerWrapper.svg.getBBox()
    this.bbox.x = x
    this.bbox.y = y

    this.addAnchor('ib_ir_out', this.bbox.x + this.bbox.width, this.bbox.y * 1.1)
    this.addAnchor('irl_ibh_out', this.bbox.x + this.bbox.width, this.bbox.y * 1.5)
    this.addAnchor('irl_ibl_out', this.bbox.x + this.bbox.width, this.bbox.y * 1.9)
    this.addAnchor('ExtIrl_ib_out', this.bbox.x + this.bbox.width, this.bbox.y * 2.3)

    this.addAnchor('ir_in_bus', this.bbox.x + this.bbox.width, this.bbox.y * 3.3)

    this.addAnchor('uc_out_left', this.bbox.x, this.bbox.y + this.bbox.height * 0.5)
    this.addAnchor('uc_in_left', this.bbox.x, this.bbox.y + this.bbox.height * 0.6)

    this.addAnchor('uc_in_clock', this.bbox.x, this.bbox.y + gr.gridTopx(2))

    this.addAnchor('uc_fin_out', this.bbox.x, this.bbox.y + this.bbox.height - gr.gridTopx(1))
    this.addAnchor('uc_fin_in', this.bbox.x, this.bbox.y + this.bbox.height - gr.gridTopx(2.5))

    this.addAnchor('uc_joint_up', this.bbox.x + this.bbox.width * 0.55, this.bbox.y)

    this.addAnchor('uc_down', this.bbox.x + gr.gridTopx(2), this.bbox.y + this.bbox.height)
  }

  updateValue (value) {
    this.step.text = (value.int ? 'I' : '') + '' + (value.step)
    this.signalsBlock.clear()
    this.signalsBlock.text = value.signals
  }

  /**
   * @method setSignalSelector Set signal selector
   * @param {*} selector Selector
   */
  setSignalSelector (selector) {
    this.sselector = selector
  }

  listen (message) {
    switch (message.topic) {
      case UcControl.topic.newstep:
        this.step.text = (message.value.int ? 'I' : '') + '' + (message.value.step)
        break
      case UcControl.topic.update: {
        this.updateValue(message.value)
      }
    }
  }
}

export { Uc }
