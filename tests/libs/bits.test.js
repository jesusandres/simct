import { Bitop } from '../../app/lib/bits'

describe('Test BitOp', function () {
  test('Test bit operations', () => {
    let bitseq = 0b1010

    expect(Bitop.isOn(bitseq, 1)).toBe(true)
    expect(Bitop.isOn(bitseq, 0)).toBe(false)
    bitseq = Bitop.set(bitseq, 0, 1)
    expect(Bitop.isOn(bitseq, 0)).toBe(true)
    bitseq = Bitop.off(bitseq, 0)
    expect(Bitop.isOn(bitseq, 0)).toBe(false)
    bitseq = Bitop.on(bitseq, 0)
    expect(Bitop.isOn(bitseq, 0)).toBe(true)
    bitseq = Bitop.toggle(bitseq, 0)
    expect(Bitop.isOn(bitseq, 0)).toBe(false)
    bitseq = Bitop.toggle(bitseq, 0)
    expect(Bitop.isOn(bitseq, 0)).toBe(true)

    bitseq = 0b01001101
    expect(Bitop.lsb(bitseq, 3)).toBe(0b101)
    expect(Bitop.hsb(bitseq, 3, 8)).toBe(0b010)
    expect(Bitop.hsb(bitseq, 3)).toBe(0b000)
    expect(Bitop.msb(bitseq, 4, 4)).toBe(0b0110)
    expect(Bitop.two(bitseq)).toBe(77)

    bitseq = 0x8000
    expect(Bitop.two(bitseq)).toBe(-32768)
  })
})
