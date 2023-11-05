import { baseConvert } from '../../app/lib/baseconvert'

describe('Test base conversion', function () {
  test('Test conversions', () => {
    const dec = 256
    const bin = baseConvert.dec2bin(dec)
    const hex = baseConvert.dec2hex(dec)
    expect(bin).toBe('0000000100000000')
    expect(hex).toBe('0100')
    expect(baseConvert.bin2hex(bin)).toBe('0100')
    expect(baseConvert.hex2bin(hex)).toBe(bin)
    expect(baseConvert.hex2dec(hex)).toBe(256)
  })
})
