'use strict'

/**
 * @module control/main
 */

import { Simulator } from './app/view/sim.js'
import { State } from './app/config/control.js'

const sim = new Simulator()

window.sim = sim
window.state = State
