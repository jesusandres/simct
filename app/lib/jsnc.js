import { ObservableObserver } from './observer.js'
class _jsDomElement extends ObservableObserver {
  constructor (element) {
    super()
    this.element = element
  }

  static parseStyle (dom, _style) {
    const style = Object.keys(_style)

    style.forEach((prop) => {
      const tmpProp = prop.replace(/-([a-z])/ig, function (all, letter) { return letter.toUpperCase() })
      if (tmpProp in dom.style) {
        dom.style[tmpProp] = _style[prop]
      } else throw new Error(_jscerror.bad_property)
    })
  }

  static parseAttr (dom, _attr) {
    const attr = Object.keys(_attr)

    attr.forEach((prop) => {
      dom.setAttribute(prop, _attr[prop])
    })
  }

  attr (_attr, _value = null) {
    if (_value === null && typeof _attr === 'string') return this.element.getAttribute(_attr)

    if (_value !== null && typeof _attr === 'string') return this.element.setAttribute(_attr, _value)
    else if (_value === null && typeof _attr === 'object') {
      _jsDomElement.parseAttr(this.element, _attr)
    } else throw new Error(_jscerror.bad_attribute)
  }

  append () {
    for (const newChild of arguments) {
      this.element.appendChild(newChild.element ? newChild.element : newChild)
    }
    return this
  }

  prepend () {
    for (const newChild of arguments) {
      this.element.prepend(newChild.element ? newChild.element : newChild)
    }
    return this
  }

  static fromNode (element) {
    const tmp = new _jsDomElement()
    tmp.element = element
    return tmp
  }

  hasClass (tgtClass) {
    const regex = new RegExp(tgtClass)
    let className = this.element.className
    if (Object.getPrototypeOf(this.element).prototype === Node.prototype) className = this.element.className.baseVal
    if (regex.test(className)) return true
    return false
  }

  addClass () {
    for (const newClass of arguments) {
      const regex = new RegExp(newClass)
      let className = this.element.className
      if (Object.getPrototypeOf(this.element).prototype === Node.prototype) className = this.element.className.baseVal
      if (!regex.test(className)) this.element.classList.add(newClass)
    }
    return this
  }

  remove () {
    this.element.remove()
  }

  removeClass (newClass) {
    const regex = new RegExp(newClass)
    // if (Object.getPrototypeOf(this.element).prototype === Node.prototype && regex.test(this.className.baseVal)) this.className.baseVal = this.className.baseVal.replace(newClass, '')
    if (regex.test(this.element.className.baseVal)) this.element.className.baseVal = this.element.className.baseVal.replace(newClass, '')
    else if (regex.test(this.element.className)) this.element.className = this.element.className.replace(newClass, '')
    return this
  }

  on (event, callable) {
    this.element.addEventListener(event, callable)
  }

  parent () {
    return this.element.parentNode
  }

  empty () {
    this.element.innerHTML = ''
    return this
  }

  text (text = null) {
    if (text) this.element.textContent = text
    return this.element.textContent
  }

  html (html = null) {
    if (html) this.element.innerHTML = html
    return this.element.innerHTML
  }

  find (selector) {
    return this.element.querySelector(selector)
  }

  style (_style = null) {
    if (!_style) return this.element.style
    _jsDomElement.parseStyle(this.element, _style)
  }
}
class _jsDomElementCollection {
  constructor (elements) {
    this.elements = []
    elements.forEach((element) => this.elements.push(new _jsDomElement(element)))
  }

  static fromNodeList (elements) {
    const tmp = new _jsDomElementCollection([])
    elements.forEach((element) => tmp.elements.push(_jsDomElement.fromNode(element)))
    return tmp
  }

  addClass (newClass) {
    this.elements.forEach((element) => element.addClass(newClass))
    return this
  }

  removeClass (newClass) {
    this.elements.forEach((element) => element.removeClass(newClass))
    return this
  }

  filter (callable) {
    return Array.from(this.elements).filter(callable)
  }

  on (event, callable) {
    this.elements.forEach((element) => element.on(event, callable))
    return this
  }
}

const _jss = function (selector) {
  let elements = []
  switch (typeof selector) {
    case 'string':
      elements = document.querySelectorAll(selector)
      if (elements.length > 1) return new _jsDomElementCollection(elements)
      return new _jsDomElement(elements[0])
    case 'object':
      if (Object.getPrototypeOf(selector) === NodeList.prototype) return _jsDomElementCollection.fromNodeList(selector)
      else return new _jsDomElement(selector)
  }
}

const _jscerror = {
  bad_property: 'error._jscerror.bad_property',
  bad_attribute: 'error._jscerror.bad_attr'
}

const _jsc = function ({ s, _id, _class, _style, _attr } = {}) {
  const tmpDom = document.createElement(s)
  if (_id) tmpDom.id = _id
  if (_class) tmpDom.className = Array.isArray(_class) === true ? _class.join(' ') : _class

  if (_style) {
    _jsDomElement.parseStyle(tmpDom, _style)
  }
  if (_attr) {
    _jsDomElement.parseAttr(tmpDom, _attr)
  }

  return _jss(tmpDom)
}

export { _jss, _jsc }
