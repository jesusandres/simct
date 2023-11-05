'use strict'

/**
 * @module control/anchor
 */

/**
 * @class Anchor
 * @property {String} id Anchor id
 * @property {Number} x Anchor x position
 * @property {Number} y Anchor y position
 * @property {Array} connections Connections
 *
 */
class Anchor {
  constructor (id, x, y, target = '') {
    this.id = id
    this.x = x
    this.y = y
    this.connections = []
  }
}

/**
 * @class AnchorFactory
 * @property {Object} anchors Anchors
 *
 */
class AnchorFactory {
  constructor () {
    this.anchors = {}
  }

  /**
   * @method anchor Create an anchor
   * @param {*} id id of the anchor
   * @param {*} x x position of the anchor
   * @param {*} y y position of the anchor
   * @param {*} target target of the anchor
   * @returns {Anchor} Anchor
   */
  anchor (id, x, y, target) {
    this.anchors[id] = new Anchor(id, x, y, target)
    return this.anchors[id]
  }

  /**
   * @method getAnchor Get an anchor
   * @param {*} id id of the anchor
   * @returns {Array} Anchor coordinates
   */
  getAnchor (id) {
    return [this.anchors[id].x, this.anchors[id].y]
  }

  /**
   * @method getAnchors Get all anchors
   * @returns {Array} Anchors array
   */
  getAnchors () {
    return this.anchors
  }
}

const anchors = new AnchorFactory()

export { anchors }
