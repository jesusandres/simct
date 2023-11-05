'use strict'
/**
 * @module control/actions
 */
import { Observer } from '../../lib/observer.js'
import { anchors } from './anchor.js'

/**
 * @class CtElement
 * @extends Observer
 * @property {Object} anchors Anchors
 * @property {Object} bbox Bounding box
 * @property {Number} bbox.x Bounding box x
 * @property {Number} bbox.y Bounding box y
 * @property {Number} bbox.width Bounding box width
 * @property {Number} bbox.height Bounding box height
 */
class CtElement extends Observer {
  constructor () {
    super()
    this.anchors = {}
  }

  /**
   * @method addAnchors Add anchors to the element
   * @param {*} callable Callable to process the anchors
   */
  addAnchors (callable) {
    callable(this)
  }

  /**
   * @method addAnchor Add an anchor to the element
   * @param {*} id Name of the anchor
   * @param {*} x x position of the anchor
   * @param {*} y y position of the anchor
   */
  addAnchor (id, x, y) {
    this.anchors[id] = anchors.anchor(id, x, y, this)
  }

  /**
   * @method getAnchors Get the anchors of the element
   * @returns {Object} Anchors
   */
  getAnchors () {
    return this.anchors
  }

  /**
   * @method getBBox Get bounding box
   * @returns {Object} Bounding box
   */
  getBBox () {
    return this.bbox
  }
}

export { CtElement }
