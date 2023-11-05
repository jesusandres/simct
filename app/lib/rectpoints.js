'use strict'

class RectPoints {
  constructor (x1, y1, x2, y2) {
    this.m = (y2 - y1) / (x2 - x1)
    this.b = y2 - this.m * x2
  }

  getY (x) {
    return (this.m * x) + this.b
  }

  getX (y) {
    return (y - this.b) / this.m
  }
}

export { RectPoints }
