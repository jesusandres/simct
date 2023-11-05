'use strict'
/**
 * @module view/navigation/keys
 */

import { Clock } from '../../control/clock.js'
import { actions } from '../../control/actions.js'
import { vwactions } from './viewactions.js'

/**
 * @method initKeys Initializes the key shortcuts
 * @param {Computer} ct COmputer link
 */
function initKeys (ct) {
  document.querySelector('body').addEventListener('keydown', function (e) {
    if ([116, 117, 118, 119, 120, 121].includes((e.which || e.keyCode)) || ['F5', 'F6', 'F7', 'F8', 'F9', 'F10'].includes(e.key)) {
      e.preventDefault()
      e.returnValue = false
    }

    const keyCode = e.keyCode || e.which

    if (keyCode >= 112 && keyCode <= 123) {
      switch (keyCode) {
        case 116:
          e.preventDefault()
          actions.changeMode(ct)
          break
        case 118:
          e.preventDefault()
          actions.runStep(ct)
          break
        case 119:
          e.preventDefault()
          actions.runInstruction(ct)
          break
        case 120:
          e.preventDefault()
          if (ct.cpu.clock.status === Clock.status.stopped) actions.runProgram(ct)
          else actions.stopProgram(ct)
          break
        case 121:
          e.preventDefault()
          if (e.ctrlKey) vwactions.reload()
          break
      }
    }
  })
}

export { initKeys }
