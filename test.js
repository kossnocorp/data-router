if (typeof window != 'undefined') {
  require('babel-polyfill')
} else {
  global.sinon = require('sinon')
}

require('./src/match/test')

var dataRouter = require('./')

describe('dataRouter', function() {

})
