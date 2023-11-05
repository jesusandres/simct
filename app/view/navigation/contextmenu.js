'use strict'

/**
 * @module view/navigation/contextmenu
 */

/**
 * @class ContextMenu
 * @property {HTMLElement} dom DOM
 * @property {Boolean} callOnSave Call on save
 * @property {Simulator} sim Simulator
 * @property {Object} labels Labels
 * @property {HTMLElement} content Content
 *
 */
class ContextMenu {
  static new (target, items) {
    return new ContextMenu(target, items)
  }

  constructor (target, items) {
    target.addEventListener('mousedown', function (e) {
      let isRightMB
      e = e || window.event

      // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
      if ('which' in e) {
        isRightMB = e.which === 3
      } else if ('button' in e) {
        isRightMB = e.button === 2
      }

      if (isRightMB) {
        let contextmenu = document.querySelector('#contextmenu')
        if (!contextmenu) {
          contextmenu = document.createElement('div')
          contextmenu.id = 'contextmenu'
          document.body.appendChild(contextmenu)
        }
        contextmenu.innerHTML = ''

        contextmenu.style.display = 'block'
        contextmenu.style.cursor = 'pointer'

        document.body.addEventListener('click', function () {
          contextmenu.style.display = 'none'
        })

        contextmenu.style.left = e.clientX + 10 + 'px'
        contextmenu.style.top = e.clientY - 10 + 'px'
        const ul = document.createElement('ul')
        contextmenu.appendChild(ul)
        for (let i = 0; i < items.length; i++) {
          const li = document.createElement('li')
          li.textContent = typeof items[i].label === 'function' ? items[i].label() : items[i].label
          li.addEventListener('click', items[i].callback)
          ul.appendChild(
            li
          )
        }
      }
    })
    target.addEventListener('contextmenu', function (e) {
      e.preventDefault()
    })
  }
}

export { ContextMenu }
