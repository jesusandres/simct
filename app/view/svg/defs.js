'use strict'

import { SVGBase } from './svgbase.js'

class SVGDefs extends SVGBase {
  constructor (_class = '', id = '') {
    super('defs', _class, id)
  }

  append (svgObject) {
    this.svg.appendChild(svgObject.svg)
    return this
  }
}

export { SVGDefs }
