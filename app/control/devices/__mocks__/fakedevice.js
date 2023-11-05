class FakeDevice {
  constructor (name, address, size, int = false) {
    this.name = name
    this.baseaddress = address
    this.memsize = size
    this.mem = []
    this.priority = 0
    this.activeInt = false
    this.pulseCount = 0
    this.intAck = false
    this.int = int
  }

  isInt () {
    return this.activeInt
  }

  getPos (address) {
    return this.mem[address]
  }

  setPos (address, value) {
    this.mem[address] = value
  }

  clockPulse () {
    this.pulseCount++
  }

  inta () {
    this.intAck = true
  }
}

export { FakeDevice }
