import { Queue } from '../../app/lib/queue'

describe('Test queue', function () {
  test('Test limitedpulses', () => {
    const queue = new Queue()

    queue.enqueue(1)
    expect(queue.peek()).toBe(1)
    expect(queue.length).toBe(1)
    expect(queue.isEmpty()).toBe(false)
    const dequeued = queue.dequeue(1)
    expect(dequeued).toBe(1)
    expect(queue.isEmpty()).toBe(true)
  })

  test('Test asArray', () => {
    const queue = new Queue()
    for (let i = 0; i < 3; i++) {
      queue.enqueue(i)
    }
    const arrayqueue = queue.asArray()
    for (let i = 0; i < arrayqueue.length; i++) {
      expect(arrayqueue[i]).toBe(i)
    }
  })
})
