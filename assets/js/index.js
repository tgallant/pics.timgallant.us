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
      filterSection(tag.dataset.tag)
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
    showSections()
    const hidden = document.querySelectorAll('[data-normal-hidden]')

    Array.from(hidden).forEach(image => {
      image.dataset['normal'] = image.dataset['normalHidden']
      image.dataset['srcset'] = image.dataset['srcsetHidden']
      delete image.dataset['normalHidden']
      delete image.dataset['srcsetHidden']
    })

    instance.update()
    instance.check()

    history.pushState('', document.title, location.pathname)
    return
  }

  const selected = document.querySelector('.selected')

  if (selected) {
    selected.classList.toggle('selected')
  }

  target.classList.toggle('selected')

  const tag = target.dataset.tag

  history.pushState(null, null, `#${tag}`)
  filterSection(tag)
}

function showSections () {
  const sections = document.querySelectorAll('[data-section]')

  Array.from(sections).forEach(section => {
    section.classList.remove('hidden')
  })
}

function filterSection (id) {
  const sections = document.querySelectorAll('[data-section]')
  const selected = document.querySelector(`[data-section="${id}"]`)

  Array.from(sections).forEach(section => {
    section.classList.add('hidden')
  })

  selected.classList.remove('hidden')

  const newSelected = document.querySelectorAll(`[data-section="${id}"] [data-normal-hidden]`)

  Array.from(newSelected).forEach(image => {
    image.dataset['normal'] = image.dataset['normalHidden']
    image.dataset['srcset'] = image.dataset['srcsetHidden']
    delete image.dataset['normalHidden']
    delete image.dataset['srcsetHidden']
  })

  const hidden = document.querySelectorAll('.hidden [data-normal]')

  Array.from(hidden).forEach(image => {
    image.dataset['normalHidden'] = image.dataset['normal']
    image.dataset['srcsetHidden'] = image.dataset['srcset']
    delete image.dataset['normal']
    delete image.dataset['srcset']
  })

  instance.update()
  instance.check()
}
