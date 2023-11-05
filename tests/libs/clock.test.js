import { Clock } from '../../app/control/clock'
import { Observer } from '../../app/lib/__mocks__/fakeobserver.js'
import { jest } from '@jest/globals'

jest.useFakeTimers()
jest.spyOn(global, 'setInterval')

describe('System clock emulator', function () {
  test('Test time loop', () => {
    const time = 5000
    const frequency = 1000
    const clock = new Clock(frequency)

    clock.start()
    expect(clock.status).toBe(Clock.status.started)
    // expect(setInterval).toHaveBeenCalledTimes(1)
    jest.advanceTimersByTime(time)
    clock.stop()
    expect(clock.status).toBe(Clock.status.stopped)
    expect(clock.pulses).toBe(time / frequency)
  })
  test('Test time loop listening', () => {
    const time = 5000
    const frequency = 1000
    const clock = new Clock(frequency)
    const observerTest = new Observer()
    clock.subscribe(observerTest)
    clock.start()
    jest.advanceTimersByTime(time)
    clock.stop()
    expect(clock.pulses).toBe(time / frequency)
  })

  test('Test limitedpulses', () => {
    const time = 5000
    const frequency = 1000
    const clock = new Clock(frequency)
    const observerTest = new Observer()
    clock.subscribe(observerTest)
    clock.start(4)
    jest.advanceTimersByTime(time)
    clock.stop()
    expect(clock.pulses).toBe(4)
    clock.reset()
    clock.stop()
    expect(clock.pulses).toBe(0)
  })

  test('Test without frequencies', () => {
    const time = 5000
    const clock = new Clock()
    const observerTest = new Observer()
    clock.subscribe(observerTest)
    clock.start(4)
    jest.advanceTimersByTime(time)
    clock.stop()
    expect(clock.pulses).toBe(4)
    clock.reset()
    clock.stop()
    expect(clock.pulses).toBe(0)
  })
})
