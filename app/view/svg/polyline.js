'use strict'

import { SVGBase } from './svgbase.js'
import { SVGGroup } from './group.js'

class SVGPolyline extends SVGBase {
  /**
     *
     * @param {*} container
     * @param {*} id
     * @param {*} x
     * @param {*} y
     * @param {*} direction 2 characters first horizontal: (L)eft (R)ight, second vertical (U)p (D)own
     */
  constructor (id, x, y) {
    super('polyline', '', id)

    this.id = id
    this.pointArray = []
    this.points = ''

    this.addPoint(x, y)

    const group = new SVGGroup('', this.id)

    // container.appendChild(group.svg);
    group.append(this)
  }

  addPoint (x, y) {
    const pointArray = this.pointsArr
    pointArray.push([x, y])
    this.pointsArr = pointArray
    return this
  }

  /**
     * Expects x increment and y increment in the unit provided by the property currentUnit in the base class SVGElement
     * @param {*} x
     * @param {*} y
     * @returns
     */
  go (x, y) {
    const npoints = this.pointsArr.length
    const lastpoint = this.pointsArr[npoints - 1]
    if (lastpoint) this.addPoint(lastpoint[0] + this.UnitValue(x), lastpoint[1] + this.UnitValue(y))
    else this.addPoint(this.UnitValue(x), this.UnitValue(y))
    return this
  }

  goRight (v) {
    return this.go(v, 0)
  }

  goLeft (v) {
    return this.go(-v, 0)
  }

  goUp (v) {
    return this.go(0, -v)
  }

  goDown (v) {
    return this.go(0, v)
  }

  set points (pointsstr) {
    this.svg.setAttribute('points', pointsstr)
  }

  get points () {
    return this.svg.getAttribute('points')
  }

  get pointsArr () {
    return this.points.trim() !== '' ? this.points.match(/[-0-9.]+[ ]+[-0-9.]+/gm).map(point => point.replace(/  +/g, ' ').split(' ').map(Number)) : []
  }

  set pointsArr (pointArray) {
    this.points = pointArray.map(point => point.join(' ')).join(' ')
  }

  updateValue (value) {
    this.registerValue.text = value
  }

  listen (message) {
    switch (message.topic) {
      case this.id + 'updatedValue': {
        this.updateValue(message.value)
      }
    }
  }

  setColor (value) {
    this.arrowStart.svg.style.stroke = value
    this.arrowStart.svg.style.fill = value
    this.svg.style.stroke = value
  }
}

export { SVGPolyline }
