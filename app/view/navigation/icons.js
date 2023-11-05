'use strict'

/**
 * @module view/navigation/icons
 */

/**
 * @class iconLib
 * @description Icon library
 */
class iconLib {
  static bulb (size = 32) {
    return this.icon(size, 'app/view/icons/bulb.svg')
  }

  static keyboard (size = 32) {
    return this.icon(size, 'app/view/icons/keyboard.svg')
  }

  static screen (size = 32) {
    return this.icon(size, 'app/view/icons/screen.svg')
  }

  static memory (size = 32) {
    return this.icon(size, 'app/view/icons/memory.svg')
  }

  static memorygreen (size = 32) {
    return this.icon(size, 'app/view/icons/memorygreen.svg')
  }

  static icon (size, ref) {
    const image = document.createElementNS('http://www.w3.org/2000/svg', 'image')
    image.setAttribute('x', 0)
    image.setAttribute('y', 0)
    image.setAttribute('width', size)
    image.setAttribute('height', size)
    image.setAttributeNS('http://www.w3.org/1999/xlink', 'href', ref)
    return image
  }
}
export { iconLib }
