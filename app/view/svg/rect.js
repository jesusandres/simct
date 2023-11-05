'use strict'

import { SVGBase } from './svgbase.js'

class SVGRect extends SVGBase {
  constructor (x, y, width, height, _class = '', id = '') {
    super('rect', _class, id)
    this.x = x
    this.y = y
    this.width = width
    this.height = height
  }

  get x () {
    return this.svgNS.getAttribute('x')
  }

  set x (value) {
    this.svgNS.setAttribute('x', value)
  }

  get y () {
    return this.svgNS.getAttribute('y')
  }

  set y (value) {
    this.svgNS.setAttribute('y', value)
  }

  set width (value) {
    this.svgNS.setAttribute('width', value)
  }

  set height (value) {
    this.svgNS.setAttribute('height', value)
  }

  get width () {
    return this.svgNS.getAttribute('width')
  }

  get height () {
    return this.svgNS.getAttribute('height')
  }
}

export { SVGRect }
