import { Memory } from '../app/control/memory.js'
// import { Device } from '../app/control/devices/device.js'
import { State } from '../app/config/control.js'

describe('Memory module management', function () {
  test('Test that we can add/remove Modules', () => {
    const mem = new Memory(State.config.memSize)
    const modules = [[32, 32], [16, 16, 16, 16], [8, 8, 16, 16, 16], [4, 4, 8, 16, 32]]
    // const modulo = []
    //   const mem = new Memory(State.config.memSize)
    for (let i = 0; i < modules.length; i++) {
      for (let k = mem.modules.length - 1; k >= 0; k--) {
        mem.removeModule(mem.modules[k][0] * 1)
      }
      let current = 0
      for (let j = 0; j < modules[i].length; j++) {
        if (j !== 0) current += modules[i][j - 1] * 1024
        mem.addModule(current, modules[i][j])
      }
    }
  })

  test('Test for an error trying to remove a module from empty space', () => {
    expect.assertions(1)
    const mem = new Memory(State.config.memSize)
    try {
      mem.removeModule(0x0000)
    } catch (error) {
      expect(error.message).toBe(Memory.error.module_nomodule)
    }
  })

  test('Test that only valid modules can be added', () => {
    expect.assertions(2)
    const mem = new Memory(State.config.memSize)

    try {
      mem.addModule(0x1000, 45)
    } catch (error) {
      expect(error.message).toBe(Memory.error.module_notvalid)
    }

    try {
      mem.addModule(0xFFFF, 4)
    } catch (error) {
      expect(error.message).toBe(Memory.error.address_space)
    }
  })

  test('Test that a module can not place a module in an address not multiple of its size', () => {
    expect.assertions(1)
    const mem = new Memory(State.config.memSize)
    try {
      mem.addModule(0x1000, 16)
    } catch (error) {
      expect(error.message).toBe(Memory.error.module_size)
    }
  })

  test('Test that you cannot overlap memory modules', () => {
    expect.assertions(3)

    const mem = new Memory(State.config.memSize)
    mem.addModule(0x2000, 8)
    try {
      mem.addModule(0x0000, 16)
    } catch (error) {
      expect(error.message).toBe(Memory.error.module_collision)
    }

    mem.removeModule(0x2000)
    mem.addModule(0x4000, 8)
    try {
      mem.addModule(0x0000, 32)
    } catch (error) {
      expect(error.message).toBe(Memory.error.module_collision)
    }

    mem.removeModule(0x4000)
    mem.addModule(0x0000, 32)
    try {
      mem.addModule(0x2000, 8)
    } catch (error) {
      expect(error.message).toBe(Memory.error.module_collision)
    }
  })
})

describe('Get/Set/ from/to memory', function () {
  test('Test for available space in empty memory', () => {
    const mem = new Memory(State.config.memSize)
    expect(mem.isAvailable(0x0101)).toBe(true)
  })

  test('Test that we can store a value in memory address and after that recover it', () => {
    const mem = new Memory(State.config.memSize)
    mem.addModule(0x0000, 32)
    mem.setPos(0x0101, 0xFFFF)
    expect(mem.getPos(0x0101)).toBe(0xFFFF)
  })

  test('Test that you cannot get/set a value in a position with no module', () => {
    expect.assertions(2)

    const mem = new Memory(State.config.memSize)
    try {
      mem.setPos(0x0101, 0xFFFF)
    } catch (error) {
      expect(error.message).toBe(Memory.error.nomodule_noes)
    }

    try {
      mem.getPos(0x0101)
    } catch (error) {
      expect(error.message).toBe(Memory.error.nomodule_noes)
    }
  })
})

describe('Peek from memory', function () {
  test('Test that we can peek the value of a memory position', () => {
    const mem = new Memory(State.config.memSize)
    mem.addModule(0x0000, 32)
    mem.setPos(0x0101, 0xFFFF)
    expect(mem.peekPos(0x0101)).toBe(0xFFFF)
  })

  test('Test that we can peek the value of a memory position within no module', () => {
    const mem = new Memory(State.config.memSize)

    const empty = mem.peekPos(0x0101)

    expect(empty).toBe(Memory.labels.empty)
  })
})

describe('Test read operation with memory modules', function () {
  test('Test that there are only two valid read modes', () => {
    expect.assertions(1)
    const mem = new Memory(State.config.memSize)
    try {
      mem.readMode = '-'
    } catch (error) {
      expect(error.message).toBe(Memory.error.mode_notsupported)
    }
  }
  )
  test('Test that we can get a value from memory after 2 cycles', () => {
    const fakeSab = { value: 0X1000 }
    const fakeSdb = { value: 0x0000 }
    const mem = new Memory(State.config.memSize, fakeSab, fakeSdb)
    mem.addModule(0x0000, 32)

    mem.setPos(0x1000, 0xFFFF)
    mem.readMode = Memory.rmode.on
    expect(mem.readMode).toBe(Memory.rmode.on)
    mem.clockPulse()
    mem.clockPulse()
    expect(fakeSdb.value).toBe(0xFFFF)
  })
})

describe('Test write operation with memory modules', function () {
  test('Test that there are only two valid write modes', () => {
    expect.assertions(1)
    const mem = new Memory(State.config.memSize)
    try {
      mem.writeMode = '-'
    } catch (error) {
      expect(error.message).toBe(Memory.error.mode_notsupported)
    }
  }
  )

  test('Test that we can set a value to memory after 2 cycles', () => {
    const fakeSab = { value: 0X1000 }
    const fakeSdb = { value: 0xFFFF }

    const mem = new Memory(State.config.memSize, fakeSab, fakeSdb)
    mem.addModule(0x0000, 32)

    mem.writeMode = Memory.wmode.on
    expect(mem.writeMode).toBe(Memory.wmode.on)
    mem.clockPulse()
    mem.clockPulse()
    expect(mem.getPos(0x1000)).toBe(0xFFFF)
  })
})
