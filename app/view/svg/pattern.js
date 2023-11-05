'use strict'

import { SVGBase } from './svgbase.js'

class SVGPattern extends SVGBase {
  constructor (_class = '', id = '') {
    super('pattern', _class, id)
  }

  append (svgObject) {
    this.svg.appendChild(svgObject.svg)
    return this
  }
}

export { SVGPattern }
