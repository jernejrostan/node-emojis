'use strict'

const url = require('url')
const emojis = require('./asset/emojis')

exports.unicode = function (input) {
  return replace(input, unicodeForEmoji)
}

exports.html = function (input, baseUrl) {
  return replace(input, htmlForEmoji, baseUrl)
}

function replace (input, fn, baseUrl) {
  const tokens = input.split(':') // tokens split by colon
  const parsed = [ ]              // parsed tokens
  let emojiBefore = true          // flag indicating if previous iteration token is an emoji

  for (let i = 0; i < tokens.length; ++i) { // for each token
    const emojiCurrent = isEmoji(tokens[i]) // flag indicating if current iteration token is an emoji

    if (!emojiBefore && !emojiCurrent) {    // if we are not dealing with an emoji
      parsed.push(':') // adds the colon back
    }

    if (emojiCurrent) { // if current iteration token is an emoji
      parsed.push(fn(tokens[i], baseUrl)) // parses the emoji and push it to the parsed array
    } else {            // if current iteration token isn't an emoji
      parsed.push(tokens[i]) // push it without any parsing
    }
    emojiBefore = emojiCurrent // setting current flag as before flag
  }

  return parsed.join('') // joining the parsed tokens and returning it
}

function isEmoji (token) {
  return emojis[token] !== undefined
}

function unicodeForEmoji (token) {
  return emojis[token]
}

function htmlForEmoji (token, baseUrl) {
  const src = (baseUrl ? url.resolve(baseUrl, token) : token) + '.png'
  return `<img class="emoji" width="20" height="20" src="${src}" alt="${token}">`
}
