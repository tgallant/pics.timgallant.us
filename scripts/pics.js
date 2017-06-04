/* global __dirname,process,require */

'use strict'

const cloudinary = require('cloudinary')
const fs = require('fs')
const path = require('path')

require('dotenv-safe').load()

function transform (resources) {
  return resources.reduce((acc, cur) => {
    const tag = cur.tags[0]

    if (acc[tag]) {
      acc[tag].push(cur)

      return acc
    }

    acc[tag] = [cur]

    return acc
  }, {})
}

function getImages (acc, next) {
  function handleImages (results) {
    const resources = acc.concat(results.resources)

    if (results.next_cursor) {
      const cur = results.next_cursor
      getImages(resources, cur)
      return
    }

    const json = transform(resources)
    const jsonStr = JSON.stringify(json, null, '  ')
    const p = path.join(__dirname, '../data/pics.json')
    fs.writeFile(p, jsonStr, 'utf8', () => {
      console.log('pics.json created!')
    })
  }

  cloudinary.config({
    cloud_name: process.env['PICS_CLOUDINARY_CLOUD_NAME'],
    api_key: process.env['PICS_CLOUDINARY_API_KEY'],
    api_secret: process.env['PICS_CLOUDINARY_API_SECRET']
  })

  const resourceOptions = {
    prefix: 'trip2017',
    tags: true,
    type: 'upload'
  }

  if (next) {
    resourceOptions.next_cursor = next
  }

  cloudinary.api.resources(handleImages, resourceOptions)
}

getImages([])
