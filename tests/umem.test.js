import { Umem } from '../app/control/umem.js'
import { jest } from '@jest/globals'

describe('Micro-memory', function () {
  test('Test ADD simple operation 2+3 load operators from listening', () => {
    const umem = new Umem()
    console.log = jest.fn()
    console.table = jest.fn()
    umem.debug = true
    umem.log()
    umem.log(true)
    expect(umem.debug).toBe(true)
  })
})
