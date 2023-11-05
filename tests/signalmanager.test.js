import { FakeDevice } from '../app/control/devices/__mocks__/fakedevice.js'

import { SignalManager, SignalMap, SignalSet } from '../app/control/signalmanager.js'
import { Computer } from '../app/control/computer.js'
import { Bitop } from '../app/lib/bits.js'

import { Observer } from '../app/lib/__mocks__/fakeobserver.js'

import { Uc } from '../app/control/uc.js'

describe('Test signal manager', function () {
  test('Test signals', () => {
    const computer = new Computer()
    const signalManager = computer.cpu.uc.signalmanager

    // Equivalente a MOV [R1],R0
    computer.cpu.reg[1].value = 0x0100
    computer.cpu.reg[2].value = 0x0101
    computer.cpu.reg[4].value = 0x0011
    computer.cpu.reg[5].value = 0x0F11

    signalManager.sig_ri_ib(2)
    expect(computer.cpu.ib.value).toBe(0x0101)

    signalManager.sig_rs_ib(1)
    expect(computer.cpu.ib.value).toBe(0x0100)

    // signalManager.sig_rds_ib(1)
    // expect(computer.cpu.ib.value).toBe(0x0100)

    signalManager.sig_ib_rd(3)
    expect(computer.cpu.reg[3].value).toBe(0x0100)

    // signalManager.sig_ib_rds(3)
    // expect(computer.cpu.reg[3].value).toBe(0x0100)

    signalManager.sig_rs_ib(2)
    signalManager.sig_ibl_rdl(3)
    expect(computer.cpu.reg[3].value).toBe(0x0101)

    signalManager.sig_rs_ib(4)
    signalManager.sig_ibh_rdh(3)
    expect(computer.cpu.reg[3].value).toBe(0x0001)

    signalManager.sig_ib_sr()
    expect(computer.cpu.sr.value).toBe(0b10001)

    signalManager.sig_ri_ib(1)
    signalManager.sig_sr_ib()
    expect(computer.cpu.ib.value).toBe(0b10001)

    computer.cpu.sr.value = 0b00001
    computer.cpu.alu.sf = 1
    computer.cpu.alu.of = 0
    computer.cpu.alu.cf = 0
    computer.cpu.alu.zf = 1
    signalManager.sig_alu_sr()
    expect(computer.cpu.sr.value).toBe(0b10011)

    signalManager.sig_cli()
    expect(Bitop.isOn(computer.cpu.sr.value, 0)).toBe(false)

    signalManager.sig_sti()
    expect(Bitop.isOn(computer.cpu.sr.value, 0)).toBe(true)

    signalManager.sig_ib_ir()
    expect(computer.cpu.ib.value).toBe(computer.cpu.ir.value)

    signalManager.sig_irl_ibl()
    expect(computer.cpu.ib.value).toBe(computer.cpu.ir.value)

    // signalManager.sig_irl_ibh()
    // expect(computer.cpu.ib.value).toBe(computer.cpu.ir.value)

    computer.cpu.ir.value = 0x0081
    signalManager.sig_extirl_ib()
    expect(computer.cpu.ib.value).toBe(0xff81)

    computer.cpu.ir.value = 0x0011
    signalManager.sig_extirl_ib()
    expect(computer.cpu.ib.value).toBe(0x0011)

    computer.cpu.pc.value = 0x0011
    signalManager.sig_pc_ib()
    expect(computer.cpu.ib.value).toBe(computer.cpu.pc.value)

    computer.cpu.pc.value = 0x2011
    signalManager.sig_ib_pc()
    expect(computer.cpu.ib.value).toBe(computer.cpu.pc.value)

    computer.cpu.mdr.value = 0x1235
    signalManager.sig_mdr_ib()
    expect(computer.cpu.ib.value).toBe(computer.cpu.mdr.value)

    computer.cpu.mdr.value = 0x1234
    signalManager.sig_ib_mdr()
    expect(computer.cpu.mdr.value).toBe(0x1235)

    signalManager.sig_ib_tmpe()
    expect(computer.cpu.tmpe.value).toBe(computer.cpu.ib.value)
    expect(computer.cpu.alu.a).toBe(computer.cpu.tmpe.value)

    signalManager.sig_tmpe_set()
    expect(computer.cpu.tmpe.value).toBe(0xffff)
    expect(computer.cpu.alu.a).toBe(0xffff)

    signalManager.sig_tmpe_clr()
    expect(computer.cpu.tmpe.value).toBe(0x0000)
    expect(computer.cpu.alu.a).toBe(0x0000)

    signalManager.sig_ib_mar()
    expect(computer.cpu.mar.value).toBe(computer.cpu.ib.value)

    // BROADCAST ONLY SIGNALS TEST
    const observer = new Observer()
    signalManager.subscribe(observer, 0)
    signalManager.sig_fin()
    expect(observer.lastMessage.topic).toBe(SignalManager.topic.fin)

    signalManager.sig_read()
    expect(observer.lastMessage.topic).toBe(SignalManager.topic.mem_read)

    signalManager.sig_write()
    expect(observer.lastMessage.topic).toBe(SignalManager.topic.mem_write)

    // ALU SIGNALS
    computer.cpu.alu.a = 0x0001
    computer.cpu.alu.b = 0x0003
    signalManager.sig_add()
    expect(computer.cpu.alu.result.value).toBe(0x0004)

    signalManager.sig_alu_tmps()
    expect(computer.cpu.tmps.value).toBe(computer.cpu.alu.result.value)

    signalManager.sig_tmps_ib()
    expect(computer.cpu.ib.value).toBe(computer.cpu.tmps.value)

    computer.cpu.alu.a = 0x0003
    computer.cpu.alu.b = 0x0001
    signalManager.sig_sub()
    expect(computer.cpu.alu.result.value).toBe(0x0002)

    computer.cpu.alu.a = 0x0001
    computer.cpu.alu.b = 0x1001
    signalManager.sig_and()
    expect(computer.cpu.alu.result.value).toBe(0x0001)

    computer.cpu.alu.a = 0x0001
    computer.cpu.alu.b = 0x1001
    signalManager.sig_or()
    expect(computer.cpu.alu.result.value).toBe(0x1001)

    computer.cpu.alu.a = 0x0001
    computer.cpu.alu.b = 0x1001
    signalManager.sig_xor()
    expect(computer.cpu.alu.result.value).toBe(0x1000)

    signalManager.sig_carry_in()
    expect(computer.cpu.alu.carry_in).toBe(1)
  })

  test('Test inta', () => {
    const computer = new Computer()
    const signalManager = computer.cpu.uc.signalmanager

    const fakeDevice1 = new FakeDevice('device1', 0xA000, 2, true)
    computer.io.addDevice(fakeDevice1)
    const fakeDevice2 = new FakeDevice('device2', 0xA002, 3, true)
    computer.io.addDevice(fakeDevice2)

    fakeDevice1.priority = 2
    fakeDevice1.activeInt = true
    fakeDevice2.priority = 1
    fakeDevice2.activeInt = true

    signalManager.sig_inta()
    expect(fakeDevice2.intAck).toBe(true)
  })

  test('Test signal run case left', () => {
    const computer = new Computer()
    const signalManager = computer.cpu.uc.signalmanager

    computer.cpu.reg[0].value = 0b0110100000000000
    computer.cpu.ir.value = 0b0110100000000000

    signalManager.run('r0-ib')
    signalManager.run('ib-r1')
    signalManager.run('r1-ib')
    expect(computer.cpu.ib.value).toBe(0b0110100000000000)
    signalManager.run('r0-ib')
    signalManager.run('ib-r2')
    signalManager.run('r2-ib')
    expect(computer.cpu.ib.value).toBe(0b0110100000000000)
    signalManager.run('r0-ib')
    expect(computer.cpu.ib.value).toBe(0b0110100000000000)
    signalManager.run('ib-r0')
    expect(computer.cpu.reg[0].value).toBe(0b0110100000000000)
  })
})

describe('Signal set test', () => {
  test('Signal validator testing all instructions in set', () => {
    function signalLoop (instruction, ucode) {
      const decoded = Uc.parseInstruction(instruction)
      for (let u = 0; u < ucode.length; u++) {
        // signalmanager.validateSignalSet(instructions[i].ucode[u], decoded)
        SignalSet.validateSignalSet(Uc.signalEncodeRegisters(ucode[u], decoded), computer)
      }
    }
    expect.assertions(0)
    const computer = new Computer()
    // const signalmanager = new SignalSet(computer)
    const instructions = computer.cpu.umem.instructions
    // const regex = / R.| Rs.| \[R./g
    try {
      for (let i = 0; i < instructions.length; i++) {
        const regs = instructions[i].mnemonic.match(/ R.| Rs.| \[R./g)

        if (regs && regs.length > 0) {
          for (let r0 = 0; r0 < 8; r0++) {
            if (regs.length > 1) {
              for (let r1 = 0; r1 < 8; r1++) {
                if (regs.length > 2) {
                  for (let r2 = 0; r2 < 8; r2++) {
                    const instruction = (instructions[i].OpCode << 11) | r0 << 8 | r1 << 5 | r2 << 2
                    signalLoop(instruction, instructions[i].ucode)
                  }
                } else {
                  const instruction = (instructions[i].OpCode << 11) | r0 << 8 | r1 << 5
                  signalLoop(instruction, instructions[i].ucode)
                }
              }
            } else {
              const instruction = (instructions[i].OpCode << 11) | r0 << 8
              signalLoop(instruction, instructions[i].ucode)
            }
          }
        } else {
          for (let u = 0; u < instructions[i].ucode.length; u++) {
            SignalSet.validateSignalSet(instructions[i].ucode[u], computer)
          }
        }
      }
    } catch (e) {
      expect(e).toBe(null)
    }
  }
  )

  // test('Fail on ongoing read operation', () => {
  //   expect.assertions(2)
  //   const computer = new Computer()

  //   try {
  //     SignalSet.validateSignalSet(['read', 'ib-mar'], computer)
  //     expect(true).toBe(true)
  //     computer.mem.readMode = true
  //     SignalSet.validateSignalSet(['read', 'ib-mar'], computer)
  //   } catch (e) {
  //     expect(e.message).toBe(SignalSet.error.read_ongoing)
  //   }
  // }
  // )

  // test('Fail on ongoing read operation', () => {
  //   expect.assertions(2)
  //   const computer = new Computer()

  //   try {
  //     SignalSet.validateSignalSet(['read', 'write'], computer)
  //     expect(true).toBe(true)
  //     computer.mem.readMode = true
  //     SignalSet.validateSignalSet(['read', 'write'], computer)
  //   } catch (e) {
  //     expect(e.message).toBe(SignalSet.error.read_ongoing)
  //   }
  // }
  // )

  test('Add / remove signals', () => {
    const computer = new Computer()
    const signalset = new SignalSet(computer)
    // const signals = signalset.signals
    signalset.addSignal('r0-ib')
    expect(signalset.signals.length).toBe(1)
    expect(signalset.signals).toStrictEqual(['r0-ib'])

    signalset.addSignal('ib-r1')
    expect(signalset.signals.length).toBe(2)
    expect(signalset.signals).toStrictEqual(['r0-ib', 'ib-r1'])

    signalset.removeSignal('r0-ib')
    expect(signalset.signals.length).toBe(1)
    expect(signalset.signals).toStrictEqual(['ib-r1'])

    signalset.removeSignal('r0-ib')
    expect(signalset.signals.length).toBe(1)
    expect(signalset.signals).toStrictEqual(['ib-r1'])
  })
  describe('Memory access signals', () => {
    test('Read and write cannot be selected at the same time', () => {
      expect.assertions(1)
      const computer = new Computer()
      const signalset = new SignalSet(computer)

      signalset.addSignal('read')
      try {
        signalset.addSignal('write')
      } catch (error) {
        expect(error.message).toBe(SignalSet.error.same_group)
      }
    })

    test('Read and write cannot be selected if an ongoing reading or writing', () => {
      expect.assertions(4)
      const computer = new Computer()
      const signalset = new SignalSet(computer)

      computer.mem.readMode = true
      try {
        signalset.addSignal('write')
      } catch (error) {
        expect(error.message).toBe(SignalSet.error.read_ongoing)
      }

      try {
        signalset.addSignal('read')
      } catch (error) {
        expect(error.message).toBe(SignalSet.error.read_ongoing)
      }

      computer.mem.readMode = false
      computer.mem.writeMode = true
      try {
        signalset.addSignal('write')
      } catch (error) {
        expect(error.message).toBe(SignalSet.error.write_ongoing)
      }

      try {
        signalset.addSignal('read')
      } catch (error) {
        expect(error.message).toBe(SignalSet.error.write_ongoing)
      }
    })

    test('ib-mar cannot be trigger with on-going read or write', () => {
      expect.assertions(2)
      const computer = new Computer()
      const signalset = new SignalSet(computer)

      computer.mem.readMode = true

      try {
        signalset.addSignal('ib-mar')
      } catch (error) {
        expect(error.message).toBe(SignalSet.error.read_ongoing)
      }

      computer.mem.readMode = false
      computer.mem.writeMode = true

      try {
        signalset.addSignal('ib-mar')
      } catch (error) {
        expect(error.message).toBe(SignalSet.error.write_ongoing)
      }
    })

    test('ib-mdr cannot be triggered with on-going write', () => {
      expect.assertions(1)
      const computer = new Computer()
      const signalset = new SignalSet(computer)

      computer.mem.writeMode = true

      try {
        signalset.addSignal('ib-mdr')
      } catch (error) {
        expect(error.message).toBe(SignalSet.error.write_ongoing)
      }

      signalset.reset()
      computer.mem.readMode = true
      signalset.addSignal('ib-r0')
    })

    test('inta cannot be executed with read or with a read operation ongoing', () => {
      expect.assertions(1)
      const computer = new Computer()
      const signalset = new SignalSet(computer)
      expect.assertions(2)
      try {
        signalset.addSignal('read')
        signalset.addSignal('inta')
      } catch (error) {
        expect(error.message).toBe(SignalSet.error.inta_read)
      }
      signalset.reset()
      computer.mem.readMode = true
      try {
        signalset.addSignal('inta')
      } catch (error) {
        expect(error.message).toBe(SignalSet.error.inta_read)
      }
    })
  })
  test('Non existent signal gives error', () => {
    expect.assertions(1)
    const computer = new Computer()
    const signalset = new SignalSet(computer)
    try {
      signalset.addSignal('ib-read')
    } catch (error) {
      expect(error.message).toBe(SignalSet.error.badsignal)
    }
  })

  test('We cannot use two download signals at the same time', () => {
    expect.assertions(1)
    const computer = new Computer()
    const signalset = new SignalSet(computer)

    signalset.addSignal('r0-ib')
    try {
      signalset.addSignal('r1-ib')
    } catch (error) {
      expect(error.message).toBe(SignalSet.error.multiple_download)
    }
  })

  test('Multiple upload signals to the same register cannot be used at the same time', () => {
    expect.assertions(24)
    const computer = new Computer()
    const signalset = new SignalSet(computer)

    const uploadSignalsRx = ['ib-r#', 'ibl-r#l', 'ibh-r#h']
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < uploadSignalsRx.length; j++) {
        signalset.addSignal(uploadSignalsRx[j].replace('#', i))
        for (let k = j + 1; k < uploadSignalsRx.length; k++) {
          try {
            signalset.addSignal(uploadSignalsRx[k].replace('#', i))
          } catch (error) {
            expect(error.message).toBe(SignalSet.error.multiple_upload_group)
          }
        }
        signalset.reset()
      }
    }

    // const uploadSignalsIR = ['ib-r#', 'ibl-r#l', 'ibh-r#h']
  })
  test('In sr group register signals only sr-ib and ib-sr are allowed at the same time', () => {
    expect.assertions(23)
    const computer = new Computer()
    const signalset = new SignalSet(computer)

    const smap = new SignalMap()
    const srsignals = Object.entries(smap.map).filter(s => s[1].group === 'SR')
    for (let i = 0; i < srsignals.length; i++) {
      signalset.addSignal(srsignals[i][0])
      for (let j = 0; j < srsignals.length; j++) {
        try {
          signalset.addSignal(srsignals[j][0])
        // console.log('NO EXCEPCION', signalset.array, srsignals[j][0])
        } catch (e) {
          if (srsignals[j][0] === srsignals[i][0]) expect(e.message).toBe(SignalSet.error.signal_present)
          else expect(e.message).toBe(SignalSet.error.bad_sr)
        }
      }
      signalset.reset()
    }
  })
  test('rx-ib and ib-rx can be called at the same time', () => {
    const computer = new Computer()
    const signalset = new SignalSet(computer)

    for (let i = 0; i < 8; i++) {
      signalset.addSignal(`r${i}-ib`)
      signalset.addSignal(`ib-r${i}`)
      expect(signalset.signals.length).toBe(2)
      signalset.reset()
    }
  })

  test('In groups alu,ir,tmpe,tmps,mem two signals cannot be executed at the same time', async () => {
    const computer = new Computer()
    const signalset = new SignalSet(computer)

    const smap = new SignalMap()

    expect.assertions(130)

    await ['ALU', 'IR', 'TMPE', 'TMPS', 'MEMORY'].forEach(element => {
      const srsignals = Object.entries(smap.map).filter(s => (s[1].group === element && s[1].group !== 'ALU') || (s[1].group === 'ALU' && s[0] !== 'carry-in'))
      for (let i = 0; i < srsignals.length; i++) {
        signalset.addSignal(srsignals[i][0])
        for (let j = i; j < srsignals.length; j++) {
          try {
            signalset.addSignal(srsignals[j][0])
          } catch (e) {
            // console.log(e.message)
            if (srsignals[j][0] === srsignals[i][0]) expect(e.message).toBe(SignalSet.error.signal_present)
            else expect(e.message === SignalSet.error.same_group || e.message === SignalSet.error.multiple_download).toBe(true)
          }
        }
        signalset.reset()
      }
    })
  })
})
