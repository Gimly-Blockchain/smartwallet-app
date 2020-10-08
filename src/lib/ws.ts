/**
  * This is effectively a polyfill so that the jolocom-sdk can require('ws')
  * see metro.config.js
  */

//@ts-ignore
module.exports = global.WebSocket
