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

  context.defaultUrl = getImageUrl(id, 512)
  context.mediumeUrl = getImageUrl(id, 768)
  context.smallUrl = getImageUrl(id, 425)

  return options.fn(context)
}
