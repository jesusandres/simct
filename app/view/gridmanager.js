'use strict'

/**
 * @module view/gridmanager
 */

/**
 * @class GridManager
 * @property {Number} gridSize Grid size
 */
class GridManager {
  constructor (gridSize) {
    this.gridSize = gridSize
  }

  set gridSize (size) {
    this._gridSize = size
  }

  get gridSize () {
    return this._gridSize
  }

  /**
   * @method gridTopx Convert grid units to pixels
   * @param {*} value Value to convert
   * @returns {Number} Converted value in pixels
   */
  gridTopx (value) {
    return value * this.gridSize
  }

  /**
   * @method pxTogrid Convert pixels to grid units
   * @param {*} value Value to convert
   * @returns {Number} Converted value in grid units
   */
  pxTogrid (value) {
    return value / this.gridSize
  }

  /**
   * @method gridtowh Convert grid units to width and height
   * @param {*} nw width in grid units
   * @param {*} nh height in grid units
   * @returns {Object} Object with width and height in pixels
   */
  gridtowh (nw, nh) {
    return [this.gridTopx(nw), this.gridTopx(nh)]
  }

  /**
   * @method gridtoxy Convert grid units to x and y
   * @param {*} nx x in grid units
   * @param {*} ny y in grid units
   * @returns {Object} Object with x and y in pixels
   */
  gridtoxy (nx, ny) {
    return [this.gridTopx(nx), this.gridTopx(ny)]
  }
}

const Unit = {
  px: 'px',
  grid: 'grid'
}

const gridSize = {
  small: 4,
  medium: 8,
  large: 16,
  default: 8
}

function gridtowh (nx, ny, size = gridSize.default) {
  return { w: nx * size, h: ny * size }
}

function gridtoxy (i, j, size = gridSize.default) {
  return { x: i * size, y: j * size }
}

function gridtoxyarray (i, j, size = gridSize.default) {
  return [gridtoxy(i, j, size).x, gridtoxy(i, j, size).y]
}

function gridtowharray (nx, ny, size = gridSize.default) {
  return [gridtowh(nx, ny, size).w, gridtowh(nx, ny, size).h]
}

function gridtopx (value, size = gridSize.default) {
  return value * size
}

function pxtogrid (value, size = gridSize.default) {
  return value / size
}

function measureSVGText (value, fontSize, op) {
  const defaults = { fontFamily: 'Arial' }; const options = { ...defaults, ...op }

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  const text = document.createElementNS('http://www.w3.org/2000/svg', 'text')

  text.textContent = value

  svg.appendChild(text)
  document.body.appendChild(svg)

  text.style.fontSize = fontSize
  text.style.fontFamily = options.fontFamily

  const measures = text.getBBox()

  measures.heightAdjust = (measures.height + measures.y)

  text.remove()
  svg.remove()

  return measures
}

const gr = new GridManager(gridSize.default)

export { Unit, gr, gridSize, measureSVGText, gridtowh, gridtoxy, gridtoxyarray, gridtowharray, gridtopx, pxtogrid }
