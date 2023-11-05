'use strict'

import { SVGBase } from './svgbase.js'

class SVGContainer extends SVGBase {
  constructor (_class = '', id = '') {
    super('svg', _class, id)
  }

  append (svgObject) {
    this.svg.appendChild(svgObject.svg)
    return this
  }
}

export { SVGContainer }
