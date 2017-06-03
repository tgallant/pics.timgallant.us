/* global history,location */

'use strict'

import Layzr from 'layzr.js'

const instance = Layzr()

window.onload = () => {
  initLayzr(instance)
  checkHash()
  handleTags()
}

function initLayzr (lzr) {
  lzr
    .update()
    .check()
    .handlers(true)
}

function checkHash () {
  const hash = location.hash

  if (hash !== '') {
    const tagName = hash.substr(1)
    const tag = document.querySelector(`[data-tag="${tagName}"]`)

    if (tag) {
      tag.classList.toggle('selected')
    }
  }
}

function handleTags () {
  const tags = document.querySelectorAll('.tag')

  Array.from(tags).forEach(tag => {
    tag.addEventListener('click', toggleTag, false)
  })
}

function toggleTag (e) {
  const target = e.target

  if (target.classList.contains('selected')) {
    target.classList.toggle('selected')
    history.pushState('', document.title, location.pathname)
    return
  }

  const selected = document.querySelector('.selected')

  if (selected) {
    selected.classList.toggle('selected')
  }

  target.classList.toggle('selected')

  const tag = target.innerText
  const hash = encodeURIComponent(tag.toLowerCase())

  history.pushState(null, null, `#${hash}`)
}
