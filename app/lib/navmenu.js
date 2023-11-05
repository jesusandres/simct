import { _jsc, _jss } from './jsnc.js'
import { Observer } from './observer.js'
import { Actions } from '../control/actions.js'

class NavMenu extends Observer {
  dropNode (value, children, menutype = 'menu-h') {
    const nested = _jsc({ s: 'ul' })

    const span = _jsc({ s: 'span' })
    span.text(value)

    const i = _jsc({ s: 'i', _style: { 'margin-left': '4px' } })

    const li = _jsc({ s: 'li' })
    if (menutype === 'menu-v') {
      li.addClass('menu-v')
      i.addClass('chevron', 'chevron-right')
    } else {
      li.addClass('menu-h')
      i.addClass('chevron', 'chevron-down')
    }

    li.append(span, i, nested)

    li.addClass('drop')

    li.on('mouseenter', (event) => {
      event.preventDefault()
      const target = _jss(event.target)
      const ultarget = _jss(target.find('ul'))
      target.addClass('hover')
      ultarget.addClass('show')

      if (target.hasClass('menu-v')) {
        ultarget.style({ left: 3.5 + target.element.offsetLeft + target.element.offsetWidth + 'px', top: 9 + ultarget.element.offsetTop - target.element.offsetHeight + 'px' })
      }

      if (target.hasClass('menu-h')) {
        ultarget.style({ left: target.element.offsetLeft + 3 + 'px', top: target.element.offsetHeight - 1.5 + 'px' })
      }
    })

    li.on('mouseleave', (event) => {
      const target = _jss(event.target)
      const ultarget = _jss(event.target.querySelector('ul'))
      target.removeClass('hover')
      ultarget.removeClass('show')

      ultarget.style({ top: '' })
    })

    children.forEach(element => {
      if (element.children && element.children.length > 0) nested.append(this.dropNode(element.title, element.children, element.menutype))
      else {
        if (element.separator) nested.append(_jsc({ s: 'li', _class: 'separator' }))
        else nested.append(this.Node(element.title, element.id, element.action))
      }
    })

    return li
  }

  Node (title, id, action, menutype = '') {
    const li = _jsc({ s: 'li', _id: id })

    if (title instanceof Function) li.html(title())
    else li.html(title)

    if (menutype === 'widget') li.addClass('widget')

    li.on('mouseenter', (event) => {
      _jss(event.target).addClass('hover')
    })
    li.on('mouseleave', (event) => {
      _jss(event.target).removeClass('hover')
    })
    if (action) li.on('click', function (e) { action(e) })
    return li
  }

  redraw () {
    this.menujson.forEach(element => {
      if (element.children && element.children.length > 0) this._dom.append(this.dropNode(element.title, element.children, element.menutype))
      else {
        this._dom.append(this.Node(element.title, element.id, element.action, element.menutype))
      }
    })
  }

  constructor (menujson) {
    super()

    this._dom = _jsc({ s: 'ul' })
    // root.addClass('menu')
    this.menujson = menujson
    this.redraw()
  }

  get dom () {
    return this._dom.element
  }

  listen (event) {
    switch (event.topic) {
      case Actions.topic.update:
        this._dom.empty()
        this.redraw()
        break
    }
  }
}

export { NavMenu }
