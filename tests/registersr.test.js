import { RegisterSR } from '../app/control/registersr'

test('Reading state bits', () => {
  const register = new RegisterSR()
  register.value = 0b01011
  expect(register.zf).toBe(0)
  expect(register.cf).toBe(1)
  expect(register.of).toBe(0)
  expect(register.sf).toBe(1)
  register.if = 0
  expect(register.if).toBe(0)
})

test('Resetting value', () => {
  const register = new RegisterSR()
  register.value = 0b01011
  register.reset()
  expect(register.zf).toBe(0)
  expect(register.cf).toBe(0)
  expect(register.of).toBe(0)
  expect(register.sf).toBe(0)
  expect(register.if).toBe(0)
})
