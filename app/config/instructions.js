import { baseConvert as bC } from '../lib/baseconvert.js'
import { Bitop } from '../lib/bits.js'
import { _jStr } from '../lib/jstr.js'

const conditionals = []

conditionals[0b100] = 'Z'
conditionals[0b101] = 'NZ'
conditionals[0b000] = 'C'
conditionals[0b001] = 'NC'
conditionals[0b010] = 'O'
conditionals[0b011] = 'NO'
conditionals[0b110] = 'S'
conditionals[0b111] = 'NS'

const instructions = [
  {
    method: 'nop',
    mnemonic: 'NOP',
    mnemonictpl: 'NOP',
    OpCode: 0b00000,
    encode: function () { return 0b00000 << 11 },
    ucode: [
      ['fin']
    ]
  },
  {
    method: 'mov_rdrs',
    mnemonic: 'MOV Rd, Rs',
    mnemonictpl: 'MOV R$0, R$1',
    OpCode: 0b00001,
    regex: '00001([01]{3})([01]{3})00000',
    encode: function (rd, rs) {
      return (0b00001 << 11) | (rd << 8) | (rs << 5)
    },
    ucode: [
      ['rs-ib', 'ib-rd', 'fin']
    ]
  },
  {
    method: 'mov_rdri',
    mnemonic: 'MOV Rd, [Ri]',
    mnemonictpl: 'MOV R$0, [R$1]',
    OpCode: 0b00010,
    regex: '00010([01]{3})([01]{3})00000',
    encode: function (rd, ri) {
      return (0b00010 << 11) | (rd << 8) | (ri << 5)
    },
    ucode: [
      ['ri-ib', 'ib-mar', 'read'],
      [],
      ['mdr-ib', 'ib-rd', 'fin']
    ]
  },
  {
    method: 'mov_rirs',
    mnemonic: 'MOV [Ri], Rs',
    mnemonictpl: 'MOV [R$0], R$1',
    OpCode: 0b00011,
    regex: '00011([01]{3})([01]{3})00000',
    encode: function (ri, rs) {
      return (0b00011 << 11) | (ri << 8) | (rs << 5)
    },
    ucode: [
      ['ri-ib', 'ib-mar'],
      ['rs-ib', 'ib-mdr', 'write'],
      ['fin']
    ]
  },
  {
    method: 'movl_rdinm8',
    mnemonic: 'MOVL Rd, Inm8',
    mnemonictpl: 'MOVL R$0, #short1h',
    OpCode: 0b00100,
    regex: '00100([01]{3})([01]{8})',
    encode: function (rd, inm8) {
      return (0b00100 << 11) | (rd << 8) | inm8
    },
    ucode: [
      ['irl-ibl', 'ibl-rdl', 'fin']
    ]
  },
  {
    method: 'movh_rdinm8',
    mnemonic: 'MOVH Rd, Inm8',
    mnemonictpl: 'MOVH R$0, #short1h',
    OpCode: 0b00101,
    regex: '00101([01]{3})([01]{8})',
    encode: function (rd, inm8) {
      return (0b00101 << 11) | (rd << 8) | inm8
    },
    ucode: [
      ['irl-ibh', 'ibh-rdh', 'fin']
    ]
  },
  {
    method: 'push_rs',
    mnemonic: 'PUSH Rs',
    mnemonictpl: 'PUSH R$0',
    OpCode: 0b00110,
    regex: '00110([01]{3})00000000',
    encode: function (rs) {
      return (0b00110 << 11) | (rs << 8)
    },
    ucode: [
      ['r7-ib', 'tmpe-set', 'add', 'alu-tmps'],
      ['rs-ib', 'ib-mdr'],
      ['tmps-ib', 'ib-r7', 'ib-mar', 'write'],
      ['fin']
    ]
  },
  {
    method: 'pop_rd',
    mnemonic: 'POP Rd',
    mnemonictpl: 'POP R$0',
    OpCode: 0b00111,
    regex: '00111([01]{3})00000000',
    encode: function (rd) {
      return (0b00111 << 11) | (rd << 8)
    },
    ucode: [
      ['r7-ib', 'tmpe-clr', 'carry-in', 'add', 'alu-tmps', 'ib-mar', 'read'],
      ['tmps-ib', 'ib-r7'],
      ['mdr-ib', 'ib-rd', 'fin']
    ]
  },
  {
    method: 'add_rdrs1rs2',
    mnemonic: 'ADD Rd, Rs1, Rs2',
    mnemonictpl: 'ADD R$0, R$1, R$2',
    OpCode: 0b01000,
    regex: '01000([01]{3})([01]{3})([01]{3})00',
    encode: function (rd, rs1, rs2) {
      return (0b01000 << 11) | (rd << 8) | (rs1 << 5) | (rs2 << 2)
    },
    ucode: [
      ['rs1-ib', 'ib-tmpe'],
      ['rs2-ib', 'add', 'alu-sr', 'alu-tmps'],
      ['tmps-ib', 'ib-rd', 'fin']
    ]
  },
  {
    method: 'sub_rdrs1rs2',
    mnemonic: 'SUB Rd, Rs1, Rs2',
    mnemonictpl: 'SUB R$0, R$1, R$2',
    OpCode: 0b01001,
    regex: '01001([01]{3})([01]{3})([01]{3})00',
    encode: function (rd, rs1, rs2) {
      return (0b01001 << 11) | (rd << 8) | (rs1 << 5) | (rs2 << 2)
    },
    ucode: [
      ['rs1-ib', 'ib-tmpe'],
      ['rs2-ib', 'sub', 'alu-sr', 'alu-tmps'],
      ['tmps-ib', 'ib-rd', 'fin']
    ]
  },
  {
    method: 'or_rdrs1rs2',
    mnemonic: 'OR Rd, Rs1, Rs2',
    mnemonictpl: 'OR R$0, R$1, R$2',
    OpCode: 0b01010,
    regex: '01010([01]{3})([01]{3})([01]{3})00',
    encode: function (rd, rs1, rs2) {
      return (0b01010 << 11) | (rd << 8) | (rs1 << 5) | (rs2 << 2)
    },
    ucode: [
      ['rs1-ib', 'ib-tmpe'],
      ['rs2-ib', 'or', 'alu-sr', 'alu-tmps'],
      ['tmps-ib', 'ib-rd', 'fin']
    ]
  },
  {
    method: 'and_rdrs1rs2',
    mnemonic: 'AND Rd, Rs1, Rs2',
    mnemonictpl: 'AND R$0, R$1, R$2',
    OpCode: 0b01011,
    regex: '01011([01]{3})([01]{3})([01]{3})00',
    encode: function (rd, rs1, rs2) {
      return (0b01011 << 11) | (rd << 8) | (rs1 << 5) | (rs2 << 2)
    },
    ucode: [
      ['rs1-ib', 'ib-tmpe'],
      ['rs2-ib', 'and', 'alu-sr', 'alu-tmps'],
      ['tmps-ib', 'ib-rd', 'fin']
    ]
  },
  {
    method: 'xor_rdrs1rs2',
    mnemonic: 'XOR Rd, Rs1, Rs2',
    mnemonictpl: 'XOR R$0, R$1, R$2',
    OpCode: 0b01100,
    regex: '01100([01]{3})([01]{3})([01]{3})00',
    encode: function (rd, rs1, rs2) {
      return (0b01100 << 11) | (rd << 8) | (rs1 << 5) | (rs2 << 2)
    },
    ucode: [
      ['rs1-ib', 'ib-tmpe'],
      ['rs2-ib', 'xor', 'alu-sr', 'alu-tmps'],
      ['tmps-ib', 'ib-rd', 'fin']
    ]
  },
  {
    method: 'cmp_rs1rs2',
    mnemonic: 'CMP Rs1, Rs2',
    mnemonictpl: 'CMP R$0, R$1',
    OpCode: 0b01101,
    regex: '01101([01]{3})([01]{3})00000',
    encode: function (rs1, rs2) {
      return (0b01101 << 11) | (rs1 << 8) | (rs2 << 5)
    },
    ucode: [
      ['rs1-ib', 'ib-tmpe'],
      ['rs2-ib', 'sub', 'alu-sr', 'fin']
    ]
  },
  {
    method: 'not_rds',
    mnemonic: 'NOT Rd/s',
    mnemonictpl: 'NOT R$0',
    OpCode: 0b10000,
    regex: '10000([01]{3})00000000',
    encode: function (rd) {
      return (0b10000 << 11) | (rd << 8)
    },
    ucode: [
      ['rds-ib', 'tmpe-set', 'xor', 'alu-sr', 'alu-tmps'],
      ['tmps-ib', 'ib-rds', 'fin']
    ]
  },
  {
    method: 'inc_rds',
    mnemonic: 'INC Rd/s',
    mnemonictpl: 'INC R$0',
    OpCode: 0b10001,
    regex: '10001([01]{3})00000000',
    encode: function (rd) {
      return (0b10001 << 11) | (rd << 8)
    },
    ucode: [
      ['rds-ib', 'tmpe-clr', 'carry-in', 'add', 'alu-sr', 'alu-tmps'],
      ['tmps-ib', 'ib-rds', 'fin']
    ]
  },
  {
    method: 'dec_rds',
    mnemonic: 'DEC Rd/s',
    mnemonictpl: 'DEC R$0',
    OpCode: 0b10010,
    regex: '10010([01]{3})00000000',
    encode: function (rd) {
      return (0b10010 << 11) | (rd << 8)
    },
    ucode: [
      ['rds-ib', 'tmpe-set', 'add', 'alu-sr', 'alu-tmps'],
      ['tmps-ib', 'ib-rds', 'fin']
    ]
  },
  {
    method: 'neg_rds',
    mnemonic: 'NEG Rd/s',
    mnemonictpl: 'NEG R$0',
    OpCode: 0b10011,
    regex: '10011([01]{3})00000000',
    encode: function (rd) {
      return (0b10011 << 11) | (rd << 8)
    },
    ucode: [
      ['rds-ib', 'tmpe-clr', 'sub', 'alu-sr', 'alu-tmps'],
      ['tmps-ib', 'ib-rds', 'fin']
    ]
  },
  {
    method: 'cli',
    mnemonic: 'CLI',
    mnemonictpl: 'CLI',
    OpCode: 0b10100,
    regex: '1010000000000000',
    encode: function () { return 0b10100 << 11 },
    ucode: [
      ['cli', 'fin']
    ]
  },
  {
    method: 'sti',
    mnemonic: 'STI',
    mnemonictpl: 'STI',
    OpCode: 0b10101,
    regex: '1010100000000000',
    encode: function () { return 0b10101 << 11 },
    ucode: [
      ['sti', 'fin']
    ]
  },
  {
    method: 'int_inm8',
    mnemonic: 'INT Inm8',
    mnemonictpl: 'INT #d0',
    OpCode: 0b10110,
    regex: '10110000([01]{8})',
    encode: function (inm8) {
      return (0b10110 << 11) | inm8
    },
    ucode: [
      ['r7-ib', 'tmpe-set', 'add', 'alu-tmps'],
      ['sr-ib', 'ib-mdr'],
      ['tmps-ib', 'ib-r7', 'ib-mar', 'write'],
      ['r7-ib', 'tmpe-set', 'add', 'alu-tmps'],
      ['pc-ib', 'ib-mdr'],
      ['tmps-ib', 'ib-r7', 'ib-mar', 'write'],
      [],
      ['extirl-ib', 'ib-mar', 'read'],
      [],
      ['mdr-ib', 'ib-pc', 'fin']
    ]
  },
  {
    method: 'iret',
    mnemonic: 'IRET',
    mnemonictpl: 'IRET',
    OpCode: 0b10111,
    regex: '1011100000000000',
    encode: function () { return 0b10111 << 11 },
    ucode: [
      ['r7-ib', 'tmpe-clr', 'carry-in', 'add', 'alu-tmps', 'ib-mar', 'read'],
      ['tmps-ib', 'ib-r7'],
      ['mdr-ib', 'ib-pc'],
      ['r7-ib', 'tmpe-clr', 'carry-in', 'add', 'alu-tmps', 'ib-mar', 'read'],
      ['tmps-ib', 'ib-r7'],
      ['mdr-ib', 'ib-sr', 'fin']
    ]
  },
  {
    method: 'jmp_inm8',
    mnemonic: 'JMP inm8',
    mnemonictpl: 'JMP #d0',
    OpCode: 0b11000,
    regex: '11000000([01]{8})',
    encode: function (inm8) {
      return (0b11000 << 11) | inm8
    },
    ucode: [
      ['pc-ib', 'ib-tmpe'],
      ['extirl-ib', 'add', 'alu-tmps'],
      ['tmps-ib', 'ib-pc', 'fin']
    ]
  },
  {
    method: 'jmp_rx',
    mnemonic: 'JMP Rx',
    mnemonictpl: 'JMP R$0',
    OpCode: 0b11001,
    regex: '11001([01]{3})00000000',
    encode: function (rx) {
      return (0b11001 << 11) | (rx << 8)
    },
    ucode: [
      ['rx-ib', 'ib-pc', 'fin']
    ]
  },
  {
    method: 'call_inm8',
    mnemonic: 'CALL Inm8',
    mnemonictpl: 'CALL #d0',
    OpCode: 0b11010,
    regex: '11010000([01]{8})',
    encode: function (inm8) {
      return (0b11010 << 11) | inm8
    },
    ucode: [
      ['r7-ib', 'tmpe-set', 'add', 'alu-tmps'],
      ['pc-ib', 'ib-mdr', 'ib-tmpe'],
      ['tmps-ib', 'ib-r7', 'ib-mar', 'write'],
      ['extirl-ib', 'add', 'alu-tmps'],
      ['tmps-ib', 'ib-pc', 'fin']
    ]
  },
  {
    method: 'call_rx',
    mnemonic: 'CALL Rx',
    mnemonictpl: 'CALL R$0',
    OpCode: 0b11011,
    regex: '11011([01]{3})00000000',
    encode: function (rx) {
      return (0b11011 << 11) | (rx << 8)
    },
    ucode: [
      ['r7-ib', 'tmpe-set', 'add', 'alu-tmps'],
      ['pc-ib', 'ib-mdr'],
      ['tmps-ib', 'ib-r7', 'ib-mar', 'write'],
      ['rx-ib', 'ib-pc', 'fin']
    ]
  },
  {
    method: 'ret',
    mnemonic: 'RET',
    mnemonictpl: 'RET',
    OpCode: 0b11100,
    regex: '1110000000000000',
    encode: function () { return 0b11100 << 11 },
    ucode: [
      ['r7-ib', 'tmpe-clr', 'carry-in', 'add', 'alu-tmps', 'ib-mar', 'read'],
      ['tmps-ib', 'ib-r7'],
      ['mdr-ib', 'ib-pc', 'fin']
    ]
  },
  {
    // When branching condition is true
    method: 'brcond_inm8',
    mnemonic: 'BRCond Inm8',
    mnemonictpl: 'BR@0 #d1',
    OpCode: 0b11110,
    regex: '11110([01]{3})([01]{8})',
    encode: function (cond, inm8) {
      return (0b11110 << 11) | (cond << 8) | inm8
    },
    ucode: [
      ['pc-ib', 'ib-tmpe'],
      ['extirl-ib', 'add', 'alu-tmps'],
      ['tmps-ib', 'ib-pc', 'fin']
    ]
  },
  {
    // This instruction doesn't exist, it is a HACK FOR BRANCH WHEN BRANCHING CONDITION IS FALSE
    method: 'brcond__inm8',
    mnemonic: 'BRCond Inm8',
    OpCode: 0b11111,
    regex: '11111([01]{3})([01]{8})',
    encode: function (cond, inm8) {
      return (0b11111 << 11) | (cond << 8) | inm8
    },
    ucode: [
      ['fin']
    ]
  }
]

const instructionErrors = {
  lenght_16: 'error.instructions.lenght_16',
  badinstruction: 'error.instructions.badinstruction',
  duplicated: 'error.instructions.duplicated',
  structure: 'error.instructions.structure'

}

function decodeInstruction (instruccion) {
  const opcode = _jStr(instruccion).left(5).toString()

  if (bC.bin2dec(opcode) === 0) return 'NOP'

  if (instruccion.length !== 16 && !instruccion.match(/[0,1]{16}/)) throw new Error(instructionErrors.lenght_16)
  const tmpInstruccion = instructions.filter(item => (item.OpCode === bC.bin2dec(opcode)) && item.OpCode !== 0b00000)

  if (tmpInstruccion.length === 0) throw new Error(instructionErrors.lenght_16)
  if (tmpInstruccion.length > 1) throw new Error(instructionErrors.duplicated)

  const regexMatch = instruccion.match(new RegExp(tmpInstruccion[0].regex))
  const result = {
    // metodo: 'todo',
    desc: tmpInstruccion[0].desc,
    params: []
  }

  if (regexMatch.length >= 1) result.params = regexMatch.slice(1, regexMatch.length)
  else throw new Error(instructionErrors.structure)

  let mnemonictpl = tmpInstruccion[0].mnemonictpl

  for (let i = 0; i < result.params.length; i++) {
    if (mnemonictpl) {
      mnemonictpl = mnemonictpl.replace('$' + i, bC.bin2dec(result.params[i]))
      mnemonictpl = mnemonictpl.replace('#' + i, bC.bin2hex(result.params[i]).toUpperCase())
      mnemonictpl = mnemonictpl.replace('#short' + i, _jStr(bC.bin2hex(result.params[i]).toUpperCase()).right(2).toString())
      mnemonictpl = mnemonictpl.replace('#d' + i, Bitop.two(bC.bin2dec(result.params[i]), 8))
      if (_jStr(opcode).left(4).toString() === '1111' && i === 0) {
        mnemonictpl = mnemonictpl.replace('@' + i, conditionals[bC.bin2dec(result.params[i])])
      }
    }
  }

  return mnemonictpl
}

export { instructions, decodeInstruction }
