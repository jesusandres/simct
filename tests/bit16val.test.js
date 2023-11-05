import { Bit16Val } from '../app/lib/bit16val.js'

test('Test for character type error and range error Bit16Val', () => {
  expect.assertions(3)
  const register = new Bit16Val('registro')

  expect(register.name).toBe('registro')

  try {
    register.value = 'a'
  } catch (error) {
    expect(error.message).toBe(Bit16Val.error.type)
  }

  try {
    register.value = 0x10000
  } catch (error) {
    expect(error.message).toBe(Bit16Val.error.range)
  }
})
