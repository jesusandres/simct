'use strict'
/**
 * @module control/PathManager
 */
import { CtElement } from './ctelement.js'

/**
 * @class PathManager
 * @extends CtElement
 * @property {Object} paths Paths
 * @property {Object} labels Labels
 */
class PathManager extends CtElement {
  constructor (paths) {
    super()
    this.paths = paths
  }

  listen (message) {
    switch (message.topic) {
      case 'signal': {
        this.updateValue(message.value)
      }
    }
  }
}

export { PathManager }
