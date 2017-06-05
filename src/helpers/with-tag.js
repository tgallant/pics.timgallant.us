'use strict'

module.exports = (tag, context, options) => {
  context.sectionId = encodeURIComponent(tag.toLowerCase())
  return options.fn(context)
}
