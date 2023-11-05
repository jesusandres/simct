import { Memory } from '../app/control/memory.js'
import { IOManager } from '../app/control/io.js'
import { State } from '../app/config/control.js'

import { FakeDevice } from '../app/control/devices/__mocks__/fakedevice.js'

const fakeSab = { value: 0X1000 }
const fakeSdb = { value: 0x0000 }

describe('Test I/O devices', function () {
  test('Test adding I/O device', () => {
    const io = new IOManager()
    const memory = new Memory(State.memSize, fakeSab, fakeSdb)
    memory.setIOManager(io)

    const fakeDevice1 = new FakeDevice('device1', 0xA000, 2)

    io.addDevice(fakeDevice1)

    expect(io.devices.length).toBe(1)
    expect(memory.isDevice(0xA000)).not.toBe(false)
  })

  test('Test removing I/O device', () => {
    const io = new IOManager()
    const memory = new Memory(State.memSize, fakeSab, fakeSdb)
    memory.setIOManager(io)

    const fakeDevice1 = new FakeDevice('device1', 0xA000, 2)

    io.addDevice(fakeDevice1)
    io.removeDevice(fakeDevice1)

    expect(io.devices.length).toBe(0)
    expect(memory.isDevice(0xA000)).toBe(false)
  })

  test('Test you cannot map a I/O device where there is another one mapped', () => {
    expect.assertions(1)

    const io = new IOManager()
    const memory = new Memory(State.memSize, fakeSab, fakeSdb)
    memory.setIOManager(io)

    const fakeDevice1 = new FakeDevice('device1', 0xA000, 2)
    const fakeDevice2 = new FakeDevice('device2', 0xA001, 2)

    try {
      io.addDevice(fakeDevice1)
      io.addDevice(fakeDevice2)
    } catch (error) {
      expect(error.message).toBe(Memory.error.io_module_present)
    }
  })

  test('Test you cannot map a I/O device where there is a memory module', () => {
    expect.assertions(1)

    const io = new IOManager()
    const memory = new Memory(State.memSize, fakeSab, fakeSdb)
    memory.setIOManager(io)

    memory.addModule(0x0000, 32)

    const fakeDevice1 = new FakeDevice('device2', 0x4000, 2)

    try {
      io.addDevice(fakeDevice1)
    } catch (error) {
      expect(error.message).toBe(Memory.error.module_collision)
    }
  })

  test('Test reading from I/O device', () => {
    const es = new IOManager()
    const memory = new Memory(State.memSize, fakeSab, fakeSdb)
    memory.setIOManager(es)

    const fakeDevice1 = new FakeDevice('device1', 0xA000, 2)
    fakeDevice1.mem = [1, 0]

    es.addDevice(fakeDevice1)

    expect(memory.getPos(0xA000)).toBe(1)
    expect(memory.getPos(0xA001)).toBe(0)

    expect(memory.peekPos(0xA000)).toBe(Memory.labels.IOlabel)

    try {
      memory.getPos(0xA002)
    } catch (error) {
      expect(error.message).toBe(Memory.error.nomodule_noes)
    }

    try {
      memory.peekPos(0xA002)
    } catch (error) {
      expect(error.message).toBe(Memory.error.nomodule_noes)
    }
  })

  test('Test writing to I/O device', () => {
    const es = new IOManager()
    const memory = new Memory(State.memSize, fakeSab, fakeSdb)
    memory.setIOManager(es)

    // let fakeMem = 0
    const fakeDevice1 = new FakeDevice('device1', 0xA000, 2)
    es.addDevice(fakeDevice1)
    memory.setPos(0xA000, 34)

    expect(memory.getPos(0xA000)).toBe(34)
    expect(fakeDevice1.getPos(0xA000 - fakeDevice1.baseaddress)).toBe(34)
  })
  test('Test that writing to empty space with IOManager causes error', () => {
    expect.assertions(1)
    const es = new IOManager()
    const memory = new Memory(State.memSize, fakeSab, fakeSdb)
    memory.setIOManager(es)

    // let fakeMem = 0
    const fakeDevice1 = new FakeDevice('device1', 0xA000, 2)
    es.addDevice(fakeDevice1)
    try {
      memory.setPos(0xA003, 34)
    } catch (error) {
      expect(error.message).toBe(Memory.error.nomodule_noes)
    }
  })

  test('Get int devices', () => {
    const es = new IOManager()
    const memory = new Memory(State.memSize, fakeSab, fakeSdb)
    memory.setIOManager(es)

    const fakeDevice1 = new FakeDevice('device1', 0xA000, 2, true)
    es.addDevice(fakeDevice1)

    const fakeDevice2 = new FakeDevice('device2', 0xA002, 3, true)
    es.addDevice(fakeDevice2)

    const fakeDevice3 = new FakeDevice('device3', 0x8000, 1, false)
    es.addDevice(fakeDevice3)
    let intDevices = es.getIntDevices()
    expect(intDevices.length).toBe(0)

    fakeDevice1.activeInt = true
    intDevices = es.getIntDevices()
    expect(intDevices.length).toBe(1)

    fakeDevice1.priority = 2
    fakeDevice2.priority = 1
    fakeDevice2.activeInt = true

    expect(es.getNextInt()).toBe(fakeDevice2)

    es.clockPulse()
    expect(fakeDevice1.pulseCount).toBe(1)
    expect(fakeDevice2.pulseCount).toBe(1)
  })

  test('Can not add devices if not memory linked ', () => {
    expect.assertions(2)
    const io = new IOManager()

    const fakeDevice1 = new FakeDevice('device1', 0xA000, 2)
    try {
      io.addDevice(fakeDevice1)
    } catch (error) {
      expect(error.message).toBe(IOManager.error.memorylink_missing)
    }

    const memory = new Memory(State.memSize, fakeSab, fakeSdb)
    memory.setIOManager(io)
    const fakeDevice2 = new FakeDevice('device2', 0x0001, 2)
    try {
      io.addDevice(fakeDevice2)
    } catch (error) {
      expect(error.message).toBe(IOManager.error.io_vectors)
    }
  })
})
