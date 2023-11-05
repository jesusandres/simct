'use strict'
/**
 * TODO how to document references to third party code
 * @source  https://www.javascripttutorial.net/javascript-queue/
 *
 */
class Queue {
  constructor () {
    this.elements = {}
    this.head = 0
    this.tail = 0
  }

  enqueue (element) {
    this.elements[this.tail] = element
    this.tail++
  }

  dequeue () {
    const item = this.elements[this.head]
    delete this.elements[this.head]
    this.head++
    return item
  }

  peek () {
    return this.elements[this.head]
  }

  removeTail () {
    delete this.elements[this.tail - 1]
    this.tail--
  }

  get length () {
    return this.tail - this.head
  }

  isEmpty () {
    return this.length === 0
  }

  asArray () {
    const keys = Object.keys(this.elements)
    const elements = []
    for (let i = 0; i < keys.length; i++) {
      elements.push(this.elements[keys[i]])
    }

    return elements
  }

  clear () {
    this.elements = {}
    this.head = 0
    this.tail = 0
  }
}

export { Queue }
