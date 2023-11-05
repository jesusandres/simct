'use strict'

/**
 * @module view/ctperipherals/deviceforms
 */

import { _jsc, _jss } from '../../lib/jsnc.js'
import { _jStr } from '../../lib/jstr.js'
import { Forms } from '../../lib/forms.js'

const deviceFormErrors = {
  input_device: 'errors.deviceform.input_device',
  output_device: 'errors.deviceform.output_device'
}

const deviceFormLabels = {
  form_name: 'labels.deviceform.form_name',
  form_address: 'labels.deviceform.form_address',
  form_vector: 'labels.deviceform.form_vector',
  form_priority: 'labels.deviceform.form_priority',
  form_int: 'labels.deviceform.form_int'
}

/**
 * @method OutputDeviceForm Creates a form for output devices
 * @param {*} callback Callable after OK button is pressed
 * @returns {HTMLElement} Form
 */
function OutputDeviceForm (callback) {
  const form = _jsc({ s: 'form', _class: 'device-form' })
  const name = Forms.inputwlabel('text', _jStr(deviceFormLabels.form_name).translate(), 'device-name')
  const basedir = Forms.inputwlabel('text', _jStr(deviceFormLabels.form_address).translate(), 'device-basedir')
  const btok = Forms.button('OK', 'btok')

  Forms.hexInput(basedir)

  form.append(name.dom)
  form.append(basedir.dom)

  form.append(document.createElement('br'))
  form.append(btok.input)

  btok.input.addEventListener('click', (event) => {
    event.preventDefault()
    const tmp = { name: name.input.value, basedir: basedir.input.value }
    if (basedir.input.value !== '') {
      callback(tmp)
    } else alert(_jStr(deviceFormErrors.output_device).translate())
  }
  )

  return form
}

/**
 * @method InputDeviceForm Creates a form for input devices
 * @param {*} callback Callable after OK button is pressed
 * @returns {HTMLElement} Form
 */
function InputDeviceForm (callback) {
  const form = _jsc({ s: 'form', _class: 'device-form' })
  const name = Forms.inputwlabel('text', _jStr(deviceFormLabels.form_name).translate(), 'device-name')
  const basedir = Forms.inputwlabel('text', _jStr(deviceFormLabels.form_address).translate(), 'device-basedir')
  const btok = Forms.button('OK', 'btok')
  const vector = Forms.inputwlabel('text', _jStr(deviceFormLabels.form_vector).translate(), 'kbvector')
  const priority = Forms.inputwlabel('text', _jStr(deviceFormLabels.form_priority).translate(), 'kbpriority')
  const int = Forms.input('checkbox', _jStr(deviceFormLabels.form_int).translate(), 'kbint')

  Forms.hexInput(basedir)
  Forms.decInput(vector, 0, 255)
  Forms.decInput(priority, 0, 255)

  form.append(name.dom)
  form.append(basedir.dom)
  const checkwrap = _jsc({ s: 'div', _class: 'checkwrap' })
  checkwrap.append(int.input)

  form.append(checkwrap.element)
  _jss(int.label).addClass('genintlabel')
  checkwrap.append(int.label)

  const genint = _jsc({ s: 'div', _class: 'genintwrap' })

  genint.append(vector.dom)
  genint.append(priority.dom)
  form.append(genint.element)

  form.append(document.createElement('br'))
  form.append(btok.input)

  _jss(int.input).on('mousedown', (event) => {
    event.preventDefault()
    event.stopPropagation()
  })
  _jss(int.input).on('mouseup', (event) => {
    event.preventDefault()
    event.stopPropagation()
    if (!event.target.checked) {
      genint.removeClass('genintwrap').addClass('genintwrap-active')
    } else {
      genint.removeClass('genintwrap-active').addClass('genintwrap')
    }
  })

  btok.input.addEventListener('click', (event) => {
    event.preventDefault()
    if (!int.input.checked) {
      vector.input.value = null
      priority.input.value = null
    }
    const tmp = { name: name.input.value, basedir: basedir.input.value, vector: vector.input.value, priority: priority.input.value, int: int.input.checked }
    if (basedir.input.value && (!int.input.checked || (int.input.checked && vector.input.value !== '' && vector.input.value !== undefined && priority.input.value !== '' && priority.input.value !== undefined))) {
      callback(tmp)
    } else alert(_jStr(deviceFormErrors.input_device).translate())
  })

  return form
}

export { OutputDeviceForm, InputDeviceForm }
