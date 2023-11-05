'use strict'

import { gr } from '../gridmanager.js'
import { SVGText } from './text.js'
import { SVGTspan } from './tspan.js'

class SVGTextMulti extends SVGText {
  constructor (x, y, textArr, size = '8', _class = '', id = '') {
    super(x, y, textArr, size, _class, id)
  }

  clear () {
    this.svg.innerHTML = ''
  }

  get text () {
    return this.svg.innerHTML
  }

  set text (valueArr) {
    for (let i = 0; i < valueArr.length; i++) {
      const tmp = new SVGTspan(this.x, i === 0 ? gr.gridSize * 0.5 : gr.gridSize * 1.2, valueArr[i], this.fontSize)
      tmp.svg.setAttribute('overflow', 'scroll')
      this.svg.appendChild(tmp.svg)
    }
  }
}

class SVGTextMultiCaps extends SVGTextMulti {
  get text () {
    return super.text
  }

  set text (valueArr) {
    for (let i = 0; i < valueArr.length; i++) {
      const caps = valueArr[i].toUpperCase().replace(/L-/g, 'l-').replace(/H-/g, 'h-').replace(/L$/g, 'l').replace(/H$/g, 'h').replace(/EXT/g, 'Ext')
      const tmp = new SVGTspan(this.x, i === 0 ? gr.gridSize * 0.5 : gr.gridSize * 1.2, caps, this.fontSize)
      tmp.svg.setAttribute('overflow', 'scroll')
      this.svg.appendChild(tmp.svg)
    }
  }
}

export { SVGTextMulti, SVGTextMultiCaps }
