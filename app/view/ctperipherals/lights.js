'use strict'

/**
 * @module view/ctperipherals/lights
 */

import { _jsc } from '../../lib/jsnc.js'
import { _jStr } from '../../lib/jstr.js'
import { baseConvert as bc } from '../../lib/baseconvert.js'
import { Observer } from '../../lib/observer.js'
import { Lights } from '../../control/devices/lights.js'

/**
 * @class CTLights
 * @extends Observer
 * @property {String} name Name
 * @property {HTMLElement} content Content
 * @property {Lights} control Control
 * @property {HTMLElement} head Head
 * @property {HTMLElement} lights Lights
 * @property {Object} labels Labels
 *
 */
class CTLights extends Observer {
  static labels = {
    address: 'labels.ctlights.address',
    vector: 'labels.ctlights.vector',
    priority: 'labels.ctlights.priority',
    int: 'labels.ctlights.int',
    genint: 'labels.ctlights.genint',
    group_lights: 'labels.ctlights.group_lights',
    group_switches: 'labels.ctlights.group_switches'
  }

  constructor (lights) {
    super()
    this.content = _jsc({ s: 'div' })
    this.name = lights.name
    this.control = lights
    this.control.subscribe(this)
    this.draw()
  }

  /**
   * @method drawHead Draws the head of the device
   */
  drawHead () {
    this.head.empty()

    const dir = _jsc({ s: 'div' })
    const vec = _jsc({ s: 'div' })
    const prior = _jsc({ s: 'div' })
    const state = _jsc({ s: 'div' })

    dir.html(_jStr(CTLights.labels.address).translate() + ': <strong>' + bc.dec2hex(this.control.baseaddress).toUpperCase() + 'h</strong>')
    vec.html(_jStr(CTLights.labels.vector).translate() + ': <strong>' + bc.dec2hex(this.control.vector).toUpperCase() + 'h</strong>')
    prior.html(_jStr(CTLights.labels.priority).translate() + ': <strong>' + this.control.priority + '</strong>')

    this.head.append(dir)
    if (this.control.int) this.head.append(vec)
    if (this.control.int) this.head.append(prior)
    this.head.append(state)

    if (this.control.int) {
      const btWrap = _jsc({ s: 'div' })
      const btINT = _jsc({ s: 'button', _id: 'genint' })
      const label = _jsc({ s: 'label' })

      btWrap.append(label)
      label.text(_jStr(CTLights.labels.genint).translate() + ': ')
      btWrap.append(btINT)
      btINT.text('INT')
      this.head.append(btWrap)

      const that = this
      btINT.on('click', function () { that.control.setInt() })
    }
  }

  /**
   * @method drawLight Draws a light
   * @param {*} i Light number
   * @param {*} value Light value
   * @returns {HTMLElement} Light
   */
  drawLight (i, value) {
    const wrap = _jsc({ s: 'div', _class: 'light-wrap' })
    const light = _jsc({ s: 'div', _class: 'light' })
    const label = _jsc({ s: 'label' })

    label.text(i.toString())
    light.addClass('light-' + (value.toString() === '0' ? 'in' : '') + 'active')

    wrap.append(label)
    wrap.append(light)

    return wrap
  }

  /**
   * @method addSwitch Adds a switch
   * @param {*} value Switch value
   * @returns {HTMLElement} Switch
   */
  addSwitch (value) {
    const wrap = _jsc({ s: 'div' })
    const _switch = _jsc({ s: 'label', _class: 'switch' })
    const _switchCheck = _jsc({ s: 'input', _attr: { type: 'checkbox' } })
    const _switchSpan = _jsc({ s: 'span' })
    const label = _jsc({ s: 'label' })

    label.text(value)

    wrap.addClass('switch-wrap')
    _switch.addClass('switch-inactive')

    _switchSpan.addClass('slider')
    wrap.append(label)
    wrap.append(_switch)

    _switch.append(_switchCheck)
    _switch.append(_switchSpan)

    const _this = this

    _switchCheck.on('change', function () {
      if (this.checked) _this.control.switchOn(value)
      else _this.control.switchOff(value)
    })

    return wrap
  }

  /**
   * @method drawLights Draws the lights
   *
   * @param {*} value Lights value
   */
  drawLights (value) {
    this.lights.empty()

    const label = _jsc({ s: 'label', _class: 'label-panel' })

    label.text(_jStr(CTLights.labels.group_lights).translate())

    this.lights.append(label)

    const lightString = bc.dec2bin(value)

    for (let i = 15; i >= 0; i--) {
      this.lights.append(this.drawLight(i, lightString[15 - i]))
    }
  }

  /**
   * @method createSwitches Creates the switches
   * @param {*} dom DOM
   * @returns {HTMLElement} Switches
   * @throws {Error} If the device is not created
   *
   */
  createSwitches (dom) {
    const label = _jsc({ s: 'label', _class: 'label-panel' })

    label.text(_jStr(CTLights.labels.group_switches).translate())

    dom.append(label)

    for (let i = 15; i >= 0; i--) {
      dom.append(this.addSwitch(i.toString()))
    }
  }

  /**
   * @method draw Draws the device
   * @throws {Error} If the device is not created
   *
   */
  draw () {
    if (!this.control) throw new Error('Es necesario crear el dispositivo previamente')

    this.head = _jsc({ s: 'div', _class: 'lights-head' })
    const lightsIn = _jsc({ s: 'div', _class: 'lights-in' })
    this.lights = _jsc({ s: 'div', _class: 'lights-out' })

    this.content.append(this.head)
    this.content.append(this.lights)
    this.content.append(lightsIn)

    this.drawLights(this.control.lights)
    this.createSwitches(lightsIn)
    this.drawHead()
  }

  listen (message) {
    switch (message.topic) {
      case Lights.topics.update + this.name:
        this.drawLights(message.value)
        break
    }
  }
}

export { CTLights }
