'use strict'
/**
 * @module control/clock
 */
import { Observable } from '../lib/observer.js'

/**
 * @class Clock
 * @extends Observable
 * @property {number} pulses Number of pulses
 * @property {number} frequency Frequency of the clock
 * @property {number} pulseInterval Interval of the clock
 * @property {number} _status Status of the clock
 * @property {Object} topic Topics used by the device
 * @property {Object} status Status used by the device
 *
*/
class Clock extends Observable {
  static status = {
    started: 1,
    stopped: 0
  }

  static topic = {
    pulse: 'topic.clock.pulse'
  }

  /**
   * @method reset Reset the clock
   * @param {*} pulses Number of pulses to execute
   */
  reset (pulses = 0) {
    if (this.pulseInterval) clearInterval(this.pulseInterval)
    this.pulses = 0
    const that = this
    this.pulseInterval = setInterval(() => {
      if (pulses === 0 || that.pulses < pulses) that.pulses++
      else {
        that.stop()
        return
      }
      this.pulse()
    }, this.frequency)
  }

  /**
   * @method start Start the clock
   * @param {*} pulses Execute a number of pulses
   */
  start (pulses = 0, callable = null) {
    this.reset(pulses)
    this.status = Clock.status.started
    this.callable = callable
  }

  /**
   * @method stop Stop the clock
   */
  stop () {
    if (this.pulseInterval) clearInterval(this.pulseInterval)
    this.status = Clock.status.stopped
  }

  /**
   * @method pulse Pulse the clock
   */
  pulse () {
    this.broadCast({ topic: Clock.topic.pulse, value: { pulses: this.pulses } })
  }

  /**
   * @method status Set the status of the clock
   */
  set status (status) {
    this._status = status
  }

  /**
   * @method status Get the status of the clock
   */
  get status () {
    return this._status
  }

  constructor (frequency = 1000) {
    super()
    this.pulses = 0
    this.frequency = frequency
    this.pulseInterval = null
    this._status = Clock.status.stopped
    this.callable = null
  }
}

export { Clock }
