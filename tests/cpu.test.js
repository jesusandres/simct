import { Cpu } from '../app/control/cpu.js'
import { Uc } from '../app/control/uc.js'
import { Computer } from '../app/control/computer.js'
import { Observer } from '../app/lib/__mocks__/fakeobserver.js'
import { SignalManager } from '../app/control/signalmanager.js'

describe('Control process Unit', function () {
  test('Cpu', () => {
    const computer = new Computer()
    const cpu = computer.cpu
    cpu.setInt()
    expect(cpu.uc.int).toBe(true)
    cpu.unSetInt()
    expect(cpu.uc.int).toBe(false)
    cpu.setMode(Cpu.mode.normal)
    expect(cpu.uc.mode).toBe(Uc.mode.normal.auto)
    cpu.setMode(Cpu.mode.manual)
    expect(cpu.uc.mode).toBe(Uc.mode.manual)

    const log = cpu.log

    expect(log[0].R0).toBe('0000')
    expect(log[0].R1).toBe('0000')
    expect(log[0].R2).toBe('0000')
    expect(log[0].R3).toBe('0000')
    expect(log[0].R4).toBe('0000')
    expect(log[0].R5).toBe('0000')
    expect(log[0].R6).toBe('0000')
    expect(log[0].R7).toBe('0000')
    expect(log[1].OP).toBe('ADD')
    expect(log[1].A).toBe('0000')
    expect(log[1].B).toBe('0000')
    expect(log[1].RESULT).toBe('0000')
    expect(log[1].ZCOS).toBe('0000')
    expect(log[2].PC).toBe('0100')
    expect(log[2].IB).toBe('0000')
    expect(log[2].IR).toBe('0000')
    expect(log[2].TMPE).toBe('0000')
    expect(log[2].TMPS).toBe('0000')
    expect(log[2].upc).toBe('0000')
    expect(log[2].MAR).toBe('0000')
    expect(log[2].MDR).toBe('0000')
    expect(log[2].SR).toBe('00000')

    const observer = new Observer()
    cpu.subscribe(observer, 0)
    cpu.listen({ topic: SignalManager.topic.mem_read })
    expect(observer.lastMessage.topic).toBe(SignalManager.topic.mem_read)
  })
})
