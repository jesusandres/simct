'use strict'

import { SVGBase } from './svgbase.js'

class SVGText extends SVGBase {
  constructor (x, y, text, fontsize = '8', _class = '', id = '', op = {}) {
    super('text', _class, id)

    const defaults = { fontFamily: 'Verdana' }; const options = { ...defaults, ...op }

    this.x = x
    this.y = y
    this.text = text
    this.fontSize = fontsize
    this.fontFamily = options.fontFamily
  }

  set text (value) {
    this.svg.textContent = value
  }

  set x (value) {
    this.svgNS.setAttribute('x', value)
  }

  set y (value) {
    this.svgNS.setAttribute('y', value)
  }

  get x () {
    return Number(this.svgNS.getAttribute('x'))
  }

  get y () {
    return Number(this.svgNS.getAttribute('y'))
  }

  set fontSize (value) {
    this.svg.style.fontSize = value + 'px'
  }

  /**
     * @param {string} value Indicates the font family
     */
  set fontFamily (value) {
    this.svg.style.fontFamily = value
  }

  get fontFamily () {
    return this.svg.style.fontFamily
  }

  get fontSize () {
    return Number(this.svg.style.fontSize.replace('px', ''))
  }

  get text () {
    return this.svg.textContent
  }
}

export { SVGText }
