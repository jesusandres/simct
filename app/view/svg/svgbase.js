'use strict'

import { Unit, gr } from '../gridmanager.js'
import { Observer } from '../../lib/observer.js'

class SVGBase extends Observer {
  constructor (type, _class = '', id = '') {
    super()
    this.svgNS = document.createElementNS('http://www.w3.org/2000/svg', type)
    this.id = id
    this.transformations = { map: {}, transformations: [] }
    if (_class) this.className = _class
    this.currentUnit = Unit.px
  }

  set id (value) {
    this.svg.setAttribute('id', value)
  }

  get id () {
    return this.svg.getAttribute('id')
  }

  get className () {
    return this.svg.className
  }

  set className (value) {
    this.addClass(value)
  }

  remove () {
    this.svg.remove()
  }

  addClass (value) {
    this.svg.classList.add(value)
    return this
  }

  toggleClass (value) {
    this.svg.classList.toggle(value)
    return this
  }

  removeClass (value) {
    this.svg.classList.remove(value)
    return this
  }

  parent () {
    return this.svg.parentNode
  }

  siblings () {
    return this.parent().children
  }

  /**
 * TODO: It's important to understand transformations in svg, for example rotate makes coord axis to rotate as well
 */

  transform (type, str) {
    if (!(this.transformations.map[type] >= 0)) {
      this.transformations.map[type] = this.transformations.transformations.length
    }

    this.transformations.transformations[this.transformations.map[type]] = str
    this.svg.setAttribute('transform', this.transformations.transformations.join(' '))
    return this
  }

  translate (x, y) {
    return this.transform('translate', 'translate(' + x + ',' + y + ')')
  }

  rotate (d, cx = 0, cy = 0) {
    return this.transform('rotate', 'rotate(' + d + ',' + cx + ',' + cy + ')')
  }

  scale (n) {
    return this.transform('translate', 'scale(' + n + ')')
  }

  get svg () {
    return this.svgNS
  }

  /**
 * Validate unit
 * @param {*} unit
 */

  setUnit (unit) {
    this.currentUnit = unit
    return this
  }

  UnitValue (v) {
    return this.currentUnit !== Unit.px ? gr.gridTopx(v) : v
  }
}

export { SVGBase }
