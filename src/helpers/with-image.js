/* global module,process,require */

'use strict'

const cloudinary = require('cloudinary')

require('dotenv-safe').load()

cloudinary.config({
  cloud_name: process.env['PICS_CLOUDINARY_CLOUD_NAME'],
  api_key: process.env['PICS_CLOUDINARY_API_KEY'],
  api_secret: process.env['PICS_CLOUDINARY_API_SECRET']
})

function getImageUrl (id, width) {
  return cloudinary.url(id, {
    crop: 'scale',
    quality: 'auto',
    secure: 'true',
    width: width
  })
}

module.exports = (context, options) => {
  const id = `${context.public_id}.${context.format}`

  context.fullsizeUrl = getImageUrl(id, 'auto')
  context.defaultUrl = getImageUrl(id, 512)
  context.smallUrl = getImageUrl(id, 320)

  context.srcset = `${context.smallUrl} 425w, ${context.defaultUrl} 768w`

  return options.fn(context)
}
