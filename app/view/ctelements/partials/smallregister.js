'use strict'

/**
 * @module control/actions
 */

import { CtElement } from '../ctelement.js'
import { SVGRect, SVGGroup, SVGText } from '../../svg.js'
import { gr } from '../../gridmanager.js'

/**
 * @class SmallRegister
 * @extends CtElement
 * @property {SVGGroup} registersvg SVG group
 * @property {SVGRect} outWrap SVG rect
 * @property {SVGText} textLabel SVG text
 * @property {RegisterValue} registerValue Register value
 * @property {Object} bbox Bounding box
 * @property {Number} bbox.x Bounding box x
 * @property {Number} bbox.y Bounding box y
 * @property {Number} bbox.width Bounding box width
 * @property {Number} bbox.height Bounding box height
 * @property {String} id Register id
 *
 */
class SmallRegister extends CtElement {
  constructor (container, x, y, id, text, value) {
    super()

    const registergroup = new SVGGroup('', id)

    this.value = new SVGText(...gr.gridtoxy(0.5, 1.9), value, 2 * gr.gridSize, 'register-value')
    const tmpText = new SVGText(...gr.gridtoxy(0.2, -0.4), text, 1.5 * gr.gridSize, 'register-value', id)
    registergroup
      .append(new SVGRect(0, 0, 2.3 * gr.gridSize, 2.3 * gr.gridSize, 'register-sq-inner'))
      .append(this.value)
      .append(tmpText)

    container.append(registergroup)

    registergroup.translate(x, y)
  }

  /**
   * @method updateValue Update the value of the register
   * @param {*} value Value to update
   */
  updateValue (value) {
    this.value.text = value
  }

  listen (message) {
    switch (message.topic) {
      case this.id + 'updatedValue': {
        this.updateValue(message.value)
      }
    }
  }
}

export { SmallRegister }
