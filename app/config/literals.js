import { State } from './control.js'
import { en } from './lang/en.js'
import { es } from './lang/es.js'

const lang = { en, es }

function literals (literal) {
  return lang[State.config.lang][literal]
}

export { literals }
