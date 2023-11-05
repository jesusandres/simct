'use strict'
/**
 * @module control/bus
 */
import { SVGTextHex, SVGPolygon, SVGGroup, SVGText } from '../../svg.js'
import { CtElement } from '../ctelement.js'
import { Bus as BusControl } from '../../../control/bus.js'
import { gr } from '../../gridmanager.js'

/**
 * @class Bus
 * @extends CtElement
 * @property {SVGGroup} bussvg SVG group
 * @property {SVGPolygon} polygon SVG polygon
 * @property {SVGText} Busname Bus name
 * @property {SVGTextHex} Busvalue Bus value
 * @property {Object} bbox Bounding box
 * @property {Number} bbox.x Bounding box x
 * @property {Number} bbox.y Bounding box y
 * @property {Number} bbox.width Bounding box width
 * @property {Number} bbox.height Bounding box height
 * @property {String} id Bus id
 *
 */
class Bus extends CtElement {
  constructor (container, id, x, y) {
    super()

    this.id = id

    this.bussvg = new SVGGroup('', this.id)

    this.polygon = new SVGPolygon('0 0 14 8 4 12 10 16 2 26 40 26 30 16 36 12 26 8 40 0', 'bus')

    container.appendChild(this.bussvg.svg)

    this.bussvg.append(this.polygon)
    this.bussvg.translate(x, y)

    this.Busname = new SVGText(gr.gridTopx(19), -3, 'BUS', gr.gridSize, 'wire-text')
    this.Busname.addClass('wire-text-inactive')

    this.Busvalue = new SVGTextHex(gr.gridTopx(21), gr.gridSize * 2, '0000', gr.gridSize * 2, 'register-value', '', true)

    this.bussvg.append(this.Busname)
    this.bussvg.append(this.Busvalue)

    this.bbox = this.polygon.svg.getBBox()
    this.bbox.x = x
    this.bbox.y = y
  }

  /**
   * @method  addClass Add a class to the bus dom element
   * @param {String} cssclass
   */
  addClass (cssclass) {
    this.polygon.addClass(cssclass)
  }

  /**
   * @method  scale Scale the bus dom element
   * @param {*} n Scale factor
   */
  scale (n) {
    this.bussvg.scale(n)
  }

  /**
   * @method  width Get the bus dom element width
   */
  get width () {
    return this.bbox.width
  }

  /**
   * @method  width Set the bus dom element width
   * @param {Number} px Width in pixels
   */
  set width (px) {
    const points = this.polygon.pointsArr
    for (let i = 5; i < points.length; i++) {
      points[i][0] = points[i][0] + (px - 40)
    }
    this.polygon.pointsArr = points
    this.bbox.width = px
  }

  /**
   * @method updateValue Update the bus value
   * @param {*} value Value to update
   */
  updateValue (value) {
    this.Busvalue.text = value
  }

  /**
   * @method activate Activate the bus
   * @param {*} value Value to update
   */
  activate () {
    this.bussvg.addClass('active')
  }

  /**
   * @method deactivate Deactivate the bus
   */
  deactivate () {
    this.bussvg.removeClass('active')
  }

  /**
   * @method listen Listen to the bus
   * @param {*} message Message received
   */
  listen (message) {
    switch (message.topic) {
      case this.id + '-bus_' + BusControl.topic.reset:
        this.updateValue(message.value)
        this.deactivate()
        break
      case this.id + '-bus_' + BusControl.topic.updated: {
        this.updateValue(message.value)
      }
    }
  }

  /**
   * @method setLabel Set the bus label
   * @param {*} text Text to set
   */
  setLabel (text) {
    this.Busname.text = text
  }
}

export { Bus }
