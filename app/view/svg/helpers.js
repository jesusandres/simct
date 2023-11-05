'use strict'

import { SVGContainer } from './svg/container.js'
import { SVGText } from './svg/text.js'

function measureSVGText (text, fontSize) {
  const svg = new SVGContainer()
  const ttext = new SVGText(0, 0, text, fontSize, '', '')

  svg.append(ttext)
  document.body.appendChild(svg.svg)

  const measures = ttext.svg.getBBox()

  ttext.remove()
  svg.remove()

  return measures
}

export { measureSVGText }
