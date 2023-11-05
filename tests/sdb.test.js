import { Sdb } from '../app/control/sdb.js'
import { Register } from '../app/control/register.js'

test('Listening to Register value changes', () => {
  const sdbbus = new Sdb()

  sdbbus.listen({ topic: 'MDR_' + Register.topic.updated, value: 0x0001 })

  expect(sdbbus.value).toBe(0x0001)
})
