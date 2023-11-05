'use strict'

import { Forms } from './forms.js'

class baseConvert {
  static bin2dec (bin) {
    return parseInt(bin, 2)
  }

  static dec2bin (dec, bits = 16) {
    return dec.toString(2).padStart(bits, '0')
  }

  static dec2hex (dec, pad = 4) {
    return dec.toString(16).padStart(pad, '0')
  }

  static hex2dec (hex) {
    return parseInt(hex, 16)
  }

  static bin2hex (bin) {
    return baseConvert.dec2hex(baseConvert.bin2dec(bin))
  }

  static hex2bin (hex) {
    return baseConvert.dec2bin(baseConvert.hex2dec(hex))
  }

  static is16bitHex (hex) {
    return Forms.isHexString(hex) && baseConvert.hex2dec(hex) <= 0xffff && baseConvert.hex2dec(hex) >= 0
  }
}
export { baseConvert }
