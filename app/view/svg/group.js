'use strict'

import { SVGBase } from './svgbase.js'

class SVGGroup extends SVGBase {
  constructor (_class = '', id = '') {
    super('g', _class, id)
  }

  append (svgObject) {
    this.svg.appendChild(svgObject.svg)
    return this
  }
}

export { SVGGroup }
