import { Register } from '../app/control/register'
import { Observer } from '../app/lib/__mocks__/fakeobserver'
test('Listening to Register value changes', () => {
  const register = new Register('registro')
  const observe = new Observer()
  register.subscribe(observe)
  register.value = 1

  expect(observe.lastMessage.topic).toBe('registro_updated-value')
  expect(observe.lastMessage.value).toBe(1)
})

test('Check base change in values', () => {
  const register = new Register('registro')

  register.value = 0x2102
  expect(register.hex).toBe('2102')
  expect(register.hex8).toBe('0002')
  expect(register.value8).toBe(0x02)
  expect(register.bin).toBe('0010000100000010')

  register.value8 = 0x2102
  expect(register.hex).toBe('0002')
  expect(register.hex8).toBe('0002')
  expect(register.value8).toBe(0x02)
  expect(register.bin).toBe('0000000000000010')

  register.hex = '2102'
  expect(register.value).toBe(0x2102)
  expect(register.value8).toBe(0x02)
  expect(register.hex).toBe('2102')
  expect(register.hex8).toBe('0002')
  expect(register.bin).toBe('0010000100000010')

  register.hex8 = '2102'
  expect(register.value).toBe(0x0002)
  expect(register.value8).toBe(0x02)
  expect(register.hex).toBe('0002')
  expect(register.hex8).toBe('0002')
  expect(register.bin).toBe('0000000000000010')

  register.bin = '0010000100000010'
  expect(register.value).toBe(0x2102)
  expect(register.value8).toBe(0x02)
  expect(register.hex).toBe('2102')
  expect(register.hex8).toBe('0002')
  expect(register.bin).toBe('0010000100000010')
})
