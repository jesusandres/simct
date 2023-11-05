import { _jStr } from '../../app/lib/jstr'

describe('Test jStr', function () {
  test('Test string operations', () => {
    const str = 'hola {0} {1} {2}'
    expect(_jStr(str).format('mundo', 2).toString()).toBe('hola mundo 2 {2}')
    expect(_jStr(str).left(4).toString()).toBe('hola')
  })
})
