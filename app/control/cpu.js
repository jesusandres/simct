'use strict'
/**
 * @module control/cpu
 */

import { Clock } from './clock.js'
import { Register } from './register.js'
import { Bus } from './bus.js'
import { Alu } from './alu.js'
import { Uc } from './uc.js'
import { Umem } from './umem.js'
import { RegisterSR } from './registersr.js'
import { ObservableObserver } from '../lib/observer.js'
import { baseConvert as bC } from '../lib/baseconvert.js'
import { SignalManager } from './signalmanager.js'
import { Mdr } from './mdr.js'

/**
 * @class Cpu
 * @extends ObservableObserver
 * @property {Array} reg Array of registers
 * @property {Register} pc Program counter
 * @property {Register} ir Instruction register
 * @property {Register} tmps Temporal output register
 * @property {Register} tmpe Temporal input register
 * @property {RegisterSR} sr Status register
 * @property {Bus} ib Internal bus
 * @property {Alu} alu Arithmetical and logical unit
 * @property {Umem} umem Micro-memory program manager
 * @property {Uc} uc Control unit
 * @property {Clock} clock System clock
 * @property {Object} mode Modes used by the device
 * @property {Object} topic Topics used by the device
 */
class Cpu extends ObservableObserver {
  static mode = {
    normal: 1,
    manual: 2
  }

  static topic = {
    set_carry: 'set-carry',
    loaded_program: 'loaded-program'

  }

  /**
   * @method backup Backup the device
   * @returns {Object} Backup of the device
   */
  backup () {
    const backup = {
      reg: this.reg.map(function (item) {
        return item.value
      }),
      pc: this.pc.value,
      ir: this.ir.value,
      tmps: this.tmps.value,
      tmpe: this.tmpe.value,
      sr: this.sr.value,
      alu: this.alu.backup(),
      uc: this.uc.backup()
    }
    return backup
  }

  /**
   * @method restore Restore the device
   * @param {*} backup  Backup of the device
   */
  restore (backup) {
    this.reg.forEach(function (item, index) {
      item.value = backup.reg[index]
    })
    this.pc.value = backup.pc
    this.ir.value = backup.ir
    this.tmps.value = backup.tmps
    this.tmpe.value = backup.tmpe
    this.sr.value = backup.sr
    this.alu.restore(backup.alu)
    this.uc.restore(backup.uc)
  }

  /**
   * @method reset Reset the device
   */
  reset () {
    this.clock.stop()
    this.reg.forEach(function (item) {
      // item.value = 0x0000
      item.reset()
    })
    this.pc.reset()
    this.pc.value = 0x0100

    this.ib.reset()
    this.mar.reset()
    this.mdr.reset()

    this.ir.reset()
    this.tmps.reset()
    this.tmpe.reset()

    this.sr.reset()
    this.alu.reset()

    this.uc.reset()
  }

  constructor (instructions, computer) {
    super()

    // Link to the computer
    this.computer = computer
    // R0-7 General purpose registers
    this.reg = Array.from({ length: 8 }, (v, i) => new Register('R' + i, 0x0000))
    // PC Register, always points to current memory position
    this.pc = new Register('PC', 0x0000)
    // IR Register contains current instruction
    this.ir = new Register('IR', 0x0000)

    // Alu temporal output register
    this.tmps = new Register('TMPS', 0x0000)

    // Alu temporal input register
    this.tmpe = new Register('TMPE', 0x0000)

    // Status register
    this.sr = new RegisterSR(0x0000)

    // Internal bus
    this.ib = new Bus('IB', 0x0000)

    // Arithmetic logic unit, performs arithmetic and logical operations
    this.alu = new Alu()
    this.tmpe.subscribe(this.alu)
    this.ib.subscribe(this.alu)

    this.subscribe(this.alu)

    // Memory data register
    this.mdr = new Mdr()

    // Memory address register
    this.mar = new Register('MAR')

    // Micro-memory program manager
    this.umem = new Umem(instructions)

    // Control Unit
    this.uc = new Uc(this)

    // System clock that generates the pulses of execution
    this.clock = new Clock(1)
    this.clock.subscribe(this.uc, 0)
    this.reset()
  }

  /**
   * @method setInt activetes de int state of the uc
   */
  setInt () {
    this.uc.int = Uc.state.active_int
  }

  /**
   * @method unSetInt deactivates de int state of the uc
   */
  unSetInt () {
    if (this.computer.io.getIntDevices().length === 0) { this.uc.int = Uc.state.inactive_int }
  }

  /**
   * @method setMode Set the mode of the CPU
   * @param {*} mode Mode to set
   */
  setMode (mode) {
    if (mode === Cpu.mode.normal) this.uc.setMode(Uc.mode.normal.auto)
    else this.uc.setMode(Uc.mode.manual)
  }

  /**
   * @method log Log the state of the device to the browser console
   */
  get log () {
    const tmp = {
      PC: bC.dec2hex(this.pc.value),
      IB: bC.dec2hex(this.ib.value),
      IR: bC.dec2hex(this.ir.value),
      TMPE: bC.dec2hex(this.tmpe.value),
      TMPS: bC.dec2hex(this.tmps.value),
      upc: bC.dec2hex(this.uc.upc.value),
      MAR: bC.dec2hex(this.mar.value),
      MDR: bC.dec2hex(this.mdr.value),
      SR: bC.dec2bin(this.sr.value, 5)
    }

    const reg = {}
    for (let i = 0; i < 8; i++) { reg['R' + i] = bC.dec2hex(this.reg[i].value) }

    const ALU = this.alu.log

    return [reg, ALU, tmp]
  }

  /**
   * @method lsiten Listen to possible notifications
   * @param {*} message Message to listen
   */
  listen (message) {
    switch (message.topic) {
      case SignalManager.topic.mem_read:
        this.broadCast({ topic: SignalManager.topic.mem_read, value: message.value })
    }
  }
}

export { Cpu }
