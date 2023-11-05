import { beforeEach } from '@jest/globals'
import { Computer } from '../app/control/computer.js'

const computer = new Computer()
computer.mem.addModule(0x0000, 32)
let uc = computer.cpu.uc

beforeEach(() => {
  computer.reset()
  computer.mem.removeModule(0x0000)
  computer.mem.addModule(0x0000, 32)
  for (let i = 0; i < 8; i++) {
    computer.mem.setPos((0x0100 + i), i)
  }
  uc = computer.cpu.uc
})

describe('Movement instructions', function () {
  test('MOV Rd, Rs ', () => {
    const opbase = 0b0000100000000000
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        computer.cpu.reg[i].value = i
        computer.cpu.reg[j].value = j
        uc.runStep()
        uc.runStep()
        computer.cpu.mdr.value = opbase | (i << 8) | (j << 5)
        uc.runStep()
        computer.cpu.clock.pulse()
        expect(computer.cpu.reg[i].value).toBe(j)
      }
    }
  })

  test('MOV Rd, [Ri] ', () => {
    const opbase = 0b0001000000000000
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        computer.cpu.reg[i].value = i
        computer.cpu.reg[j].value = 0x0100 + j
        uc.runStep()
        uc.runStep()
        computer.cpu.mdr.value = opbase | (i << 8) | (j << 5)
        uc.runStep()
        computer.cpu.clock.pulse()
        computer.cpu.clock.pulse()
        computer.cpu.clock.pulse()
        expect(computer.cpu.reg[i].value).toBe(j)
      }
    }
  })

  test('MOV [Ri], Rs ', () => {
    const opbase = 0b0001100000000000
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (i !== j) {
          computer.cpu.reg[i].value = 0x0100 + i
          computer.cpu.reg[j].value = j
          computer.cpu.clock.pulse()
          computer.cpu.clock.pulse()
          computer.cpu.mdr.value = opbase | (i << 8) | (j << 5)
          computer.cpu.clock.pulse()
          computer.cpu.clock.pulse()
          computer.cpu.clock.pulse()
          computer.cpu.clock.pulse()
          expect(computer.mem.getPos(computer.cpu.reg[i].value)).toBe(j)
        }
      }
    }
  })

  test('MOVL Rd, Inm8', () => {
    const opbase = 0b0010000000000000
    for (let i = 0; i < 8; i++) {
      computer.cpu.reg[i].value = 0xFF00
      computer.cpu.clock.pulse()
      computer.cpu.clock.pulse()
      computer.cpu.mdr.value = opbase | (i << 8) | 0x34
      computer.cpu.clock.pulse()
      computer.cpu.clock.pulse()
      expect(computer.cpu.reg[i].value).toBe(0xFF00 | 0x34)
    }
  }
  )

  test('MOVH Rd, Inm8', () => {
    const opbase = 0b0010100000000000
    for (let i = 0; i < 8; i++) {
      computer.cpu.reg[i].value = 0x00FF
      computer.cpu.clock.pulse()
      computer.cpu.clock.pulse()
      computer.cpu.mdr.value = opbase | (i << 8) | 0x34
      computer.cpu.clock.pulse()
      computer.cpu.clock.pulse()
      expect(computer.cpu.reg[i].value).toBe(0x00FF | 0x3400)
    }
  }
  )
})
test('PUSH Rs', () => {
  const opbase = 0b0011000000000000
  computer.cpu.reg[7].value = 0x0100
  for (let i = 0; i < 7; i++) {
    computer.cpu.reg[i].value = i
    computer.cpu.clock.pulse()
    computer.cpu.clock.pulse()
    computer.cpu.mdr.value = opbase | (i << 8)
    computer.cpu.clock.pulse()
    computer.cpu.clock.pulse()
    computer.cpu.clock.pulse()
    computer.cpu.clock.pulse()
    computer.cpu.clock.pulse()
    const address = computer.cpu.reg[7].value
    expect(computer.mem.getPos(address)).toBe(i)
  }
}
)

test('POP Rs', () => {
  let opbase = 0b0011000000000000
  computer.cpu.reg[7].value = 0x0100
  const tmp = []
  for (let i = 0; i < 7; i++) {
    computer.cpu.reg[i].value = i
    tmp[i] = i
    computer.cpu.clock.pulse()
    computer.cpu.clock.pulse()
    computer.cpu.mdr.value = opbase | (i << 8)
    computer.cpu.clock.pulse()
    computer.cpu.clock.pulse()
    computer.cpu.clock.pulse()
    computer.cpu.clock.pulse()
    computer.cpu.clock.pulse()
  }
  opbase = 0b0011100000000000
  for (let i = 0; i < 7; i++) {
    computer.cpu.clock.pulse()
    computer.cpu.clock.pulse()
    computer.cpu.mdr.value = opbase | (i << 8)
    computer.cpu.clock.pulse()
    computer.cpu.clock.pulse()
    computer.cpu.clock.pulse()
    computer.cpu.clock.pulse()
    // const address = computer.cpu.reg[7].value
    expect(computer.cpu.reg[i].value).toBe(6 - i)
  }
}
)

test('ADD Rd, Rs1, Rs2', () => {
  const opbase = 0b0100000000000000

  for (let k = 0; k < 7; k++) {
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        computer.cpu.reg[i].value = i
        computer.cpu.reg[j].value = j
        computer.cpu.clock.pulse()
        computer.cpu.clock.pulse()
        computer.cpu.mdr.value = opbase | (k << 8) | (i << 5) | (j << 2)
        computer.cpu.clock.pulse()
        computer.cpu.clock.pulse()
        computer.cpu.clock.pulse()
        computer.cpu.clock.pulse()
        expect(computer.cpu.reg[k].value).toBe((i + j))
      }
    }
  }
}
)

test('SUB Rd, Rs1, Rs2', () => {
  const opbase = 0b0100100000000000

  for (let k = 0; k < 7; k++) {
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        computer.cpu.reg[i].value = i
        computer.cpu.reg[j].value = j
        computer.cpu.clock.pulse()
        computer.cpu.clock.pulse()
        computer.cpu.mdr.value = opbase | (k << 8) | (i << 5) | (j << 2)
        computer.cpu.clock.pulse()
        computer.cpu.clock.pulse()
        computer.cpu.clock.pulse()
        computer.cpu.clock.pulse()
        expect(computer.cpu.reg[k].value).toBe(0xffff & (i - j))
      }
    }
  }
}
)

test('OR Rd, Rs1, Rs2', () => {
  const opbase = 0b0101000000000000

  for (let k = 0; k < 7; k++) {
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        computer.cpu.reg[i].value = i
        computer.cpu.reg[j].value = j

        computer.cpu.clock.pulse()
        computer.cpu.clock.pulse()
        computer.cpu.mdr.value = opbase | (k << 8) | (i << 5) | (j << 2)
        computer.cpu.clock.pulse()
        computer.cpu.clock.pulse()
        computer.cpu.clock.pulse()
        computer.cpu.clock.pulse()

        expect(computer.cpu.reg[k].value).toBe(i | j)
      }
    }
  }
}
)

test('AND Rd, Rs1, Rs2', () => {
  const opbase = 0b0101100000000000

  for (let k = 0; k < 7; k++) {
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        computer.cpu.reg[i].value = i
        computer.cpu.reg[j].value = j

        computer.cpu.clock.pulse()
        computer.cpu.clock.pulse()
        computer.cpu.mdr.value = opbase | (k << 8) | (i << 5) | (j << 2)
        computer.cpu.clock.pulse()
        computer.cpu.clock.pulse()
        computer.cpu.clock.pulse()
        computer.cpu.clock.pulse()
        expect(computer.cpu.reg[k].value).toBe(i & j)
      }
    }
  }
}
)

test('XOR Rd, Rs1, Rs2', () => {
  const opbase = 0b0110000000000000

  for (let k = 0; k < 7; k++) {
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        computer.cpu.reg[i].value = i
        computer.cpu.reg[j].value = j

        computer.cpu.clock.pulse()
        computer.cpu.clock.pulse()
        computer.cpu.mdr.value = opbase | (k << 8) | (i << 5) | (j << 2)
        computer.cpu.clock.pulse()
        computer.cpu.clock.pulse()
        computer.cpu.clock.pulse()
        computer.cpu.clock.pulse()
        expect(computer.cpu.reg[k].value).toBe(i ^ j)
      }
    }
  }
}
)

test('CMP Rs1, Rs2', () => {
  const opbase = 0b0110100000000000

  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 7; j++) {
      computer.cpu.reg[i].value = i
      computer.cpu.reg[j].value = j

      computer.cpu.clock.pulse()
      computer.cpu.clock.pulse()
      computer.cpu.mdr.value = opbase | (i << 8) | (j << 5)
      computer.cpu.clock.pulse()
      computer.cpu.clock.pulse()
      computer.cpu.clock.pulse()
      if (i === j) expect(computer.cpu.sr.zf).toBe(1)
      else expect(computer.cpu.sr.zf).toBe(0)
    }
  }
}

)

test('NOT Rd/s', () => {
  const opbase = 0b1000000000000000

  for (let i = 0; i < 7; i++) {
    computer.cpu.reg[i].value = i

    computer.cpu.clock.pulse()
    computer.cpu.clock.pulse()
    computer.cpu.mdr.value = opbase | (i << 8)
    computer.cpu.clock.pulse()
    computer.cpu.clock.pulse()
    computer.cpu.clock.pulse()
    expect(computer.cpu.reg[i].value).toBe((~i) & 0xFFFF)
  }
}

)

test('NOT Rd/s', () => {
  const opbase = 0b1000100000000000

  for (let i = 0; i < 7; i++) {
    computer.cpu.reg[i].value = i

    computer.cpu.clock.pulse()
    computer.cpu.clock.pulse()
    computer.cpu.mdr.value = opbase | (i << 8)
    computer.cpu.clock.pulse()
    computer.cpu.clock.pulse()
    computer.cpu.clock.pulse()
    expect(computer.cpu.reg[i].value).toBe((i + 1) & 0xFFFF)
  }
}

)

test('DEC Rd/s', () => {
  const opbase = 0b1001000000000000

  for (let i = 0; i < 7; i++) {
    computer.cpu.reg[i].value = i

    computer.cpu.clock.pulse()
    computer.cpu.clock.pulse()
    computer.cpu.mdr.value = opbase | (i << 8)
    computer.cpu.clock.pulse()
    computer.cpu.clock.pulse()
    computer.cpu.clock.pulse()
    expect(computer.cpu.reg[i].value).toBe((i - 1) & 0xFFFF)
  }
}

)

test('NEG Rd/s', () => {
  const opbase = 0b1001100000000000

  for (let i = 0; i < 7; i++) {
    computer.cpu.reg[i].value = i

    computer.cpu.clock.pulse()
    computer.cpu.clock.pulse()
    computer.cpu.mdr.value = opbase | (i << 8)
    computer.cpu.clock.pulse()
    computer.cpu.clock.pulse()
    computer.cpu.clock.pulse()
    expect(computer.cpu.reg[i].value).toBe(((~i + 1) >>> 0) & 0xFFFF)
  }
}

)

test('CLI', () => {
  const opbase = 0b1010000000000000
  computer.cpu.sr.value = 0b11111
  const tmpsr = 0b11111
  computer.cpu.clock.pulse()
  computer.cpu.clock.pulse()
  computer.cpu.mdr.value = opbase
  computer.cpu.clock.pulse()
  computer.cpu.clock.pulse()
  expect(computer.cpu.sr.value).toBe(tmpsr & 0b11110)
}
)

test('STI', () => {
  const opbase = 0b1010100000000000
  computer.cpu.sr.value = 0b11111
  const tmpsr = 0b11111
  computer.cpu.clock.pulse()
  computer.cpu.clock.pulse()
  computer.cpu.mdr.value = opbase
  computer.cpu.clock.pulse()
  computer.cpu.clock.pulse()
  expect(computer.cpu.sr.value).toBe(tmpsr | 0b00001)
}
)

test('INT Inm8', () => {
  computer.mem.setPos(0x0005, 0x0101)
  computer.cpu.reg[7].value = 0x0110
  const opbase = 0b1011000000000000
  computer.cpu.sr.value = 0b11111
  computer.cpu.clock.pulse()
  computer.cpu.clock.pulse()
  computer.cpu.mdr.value = opbase | 0x05
  computer.cpu.clock.pulse()
  for (let i = 0; i <= 9; i++) {
    computer.cpu.clock.pulse()
  }

  expect(computer.cpu.mar.value).toBe(0x0005)
  expect(computer.cpu.mdr.value).toBe(0x0101)
}
)

test('IRET', () => {
  computer.mem.setPos(0x0110, 0x0120)
  computer.mem.setPos(0x0111, 0b11111)

  computer.cpu.reg[7].value = 0x0110

  const opbase = 0b1011100000000000
  computer.cpu.clock.pulse()
  computer.cpu.clock.pulse()
  computer.cpu.mdr.value = opbase
  computer.cpu.clock.pulse()
  for (let i = 0; i <= 6; i++) {
    computer.cpu.clock.pulse()
  }

  expect(computer.cpu.pc.value).toBe(0x0120)
  expect(computer.cpu.sr.value).toBe(0b11111)
}
)

test('JMP inm_8', () => {
  const opbase = 0b1100000000000000
  computer.cpu.clock.pulse()
  computer.cpu.clock.pulse()
  computer.cpu.mdr.value = opbase | 0x05
  computer.cpu.pc.value = 0x0100
  computer.cpu.clock.pulse()
  for (let i = 0; i <= 3; i++) {
    computer.cpu.clock.pulse()
  }

  expect(computer.cpu.pc.value).toBe(0x0105)
}
)

test('JMP rx', () => {
  computer.cpu.reg[1].value = 0x0105
  const opbase = 0b1100100000000000
  computer.cpu.clock.pulse()
  computer.cpu.clock.pulse()
  computer.cpu.mdr.value = opbase | (0b001 << 8)
  computer.cpu.clock.pulse()
  computer.cpu.clock.pulse()

  expect(computer.cpu.pc.value).toBe(0x0105)
}
)

test('CALL Inm8', () => {
  const tmpPcValue = 0x0100
  const opbase = 0b1101000000000000
  computer.cpu.clock.pulse()
  computer.cpu.clock.pulse()
  computer.cpu.pc.value = tmpPcValue
  computer.cpu.reg[7].value = 0x0120
  computer.cpu.mdr.value = opbase | 0x05
  computer.cpu.clock.pulse()
  computer.cpu.clock.pulse()
  computer.cpu.clock.pulse()
  computer.cpu.clock.pulse()
  computer.cpu.clock.pulse()
  computer.cpu.clock.pulse()

  expect(computer.cpu.reg[7].value).toBe(0x011f)
  expect(computer.mem.getPos(computer.cpu.reg[7].value)).toBe(tmpPcValue)
  expect(computer.cpu.pc.value).toBe(tmpPcValue + 0x0005)
}
)

test('CALL rx', () => {
  computer.cpu.reg[1].value = 0x0105
  const tmpPcValue = 0x0100
  const opbase = 0b1101100000000000
  computer.cpu.clock.pulse()
  computer.cpu.clock.pulse()
  computer.cpu.pc.value = tmpPcValue
  computer.cpu.reg[7].value = 0x0120
  computer.cpu.mdr.value = opbase | (0b001 << 8)
  computer.cpu.clock.pulse()
  computer.cpu.clock.pulse()
  computer.cpu.clock.pulse()
  computer.cpu.clock.pulse()
  computer.cpu.clock.pulse()

  expect(computer.cpu.reg[7].value).toBe(0x011f)
  expect(computer.mem.getPos(computer.cpu.reg[7].value)).toBe(tmpPcValue)
  expect(computer.cpu.pc.value).toBe(computer.cpu.reg[1].value)
}
)

test('RET', () => {
  const opbase = 0b1110000000000000
  computer.cpu.clock.pulse()
  computer.cpu.clock.pulse()
  computer.cpu.reg[7].value = 0x0120
  computer.mem.setPos(0x0120, 0x0100)
  computer.cpu.mdr.value = opbase
  computer.cpu.clock.pulse()
  computer.cpu.clock.pulse()
  computer.cpu.clock.pulse()
  computer.cpu.clock.pulse()

  expect(computer.cpu.reg[7].value).toBe(0x0121)
  expect(computer.cpu.pc.value).toBe(0x0100)
}
)

test('BRCond Inm8', () => {
  function tesConditional (conditioneval) {
    const opbase = 0b1111000000000000
    computer.cpu.clock.pulse()
    computer.cpu.clock.pulse()
    computer.cpu.sr.value = conditioneval[1]
    computer.cpu.mdr.value = opbase | (conditioneval[0] << 8) | 0x05
    if (!computer.cpu.uc.condIsTrue(conditioneval[0])) {
      computer.cpu.clock.pulse()
      computer.cpu.pc.value = 0x0100
      computer.cpu.clock.pulse()
      return false
    }
    computer.cpu.clock.pulse()
    computer.cpu.pc.value = 0x0100
    computer.cpu.clock.pulse()
    computer.cpu.clock.pulse()
    computer.cpu.clock.pulse()
    return true
  }

  const conditions = [
    [0b100, 0b10000],
    [0b100, 0b00000],
    [0b101, 0b00000],
    [0b101, 0b10000],
    [0b000, 0b01000],
    [0b000, 0b00000],
    [0b001, 0b00000],
    [0b001, 0b01000],
    [0b010, 0b00100],
    [0b010, 0b00000],
    [0b011, 0b00000],
    [0b011, 0b00100],
    [0b110, 0b00010],
    [0b110, 0b00000],
    [0b111, 0b00000],
    [0b111, 0b00010]

  ]
  for (let i = 0; i < 16; i++) {
    if (tesConditional(conditions[i])) {
      // Extirl has to work with two's complement so if bit 8 of ir is 1 then the value is negative, lsb bit of the condition is the 8th bit of ir
      expect(computer.cpu.pc.value).toBe(0x0105)
    } else {
      expect(computer.cpu.pc.value).toBe(0x0100)
    }
  }
}
)
