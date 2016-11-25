if (typeof window != 'undefined') {
  require('babel-polyfill')
} else {
  global.sinon = require('sinon')
}

var assert = require('power-assert')
var match = require('./')

describe('matchRoute', function () {
  context('when the path and the route path are identical', function () {
    it('returns an object with corresponding route', function () {
      var result = match('/test', [{path: '/test2'}, {path: '/test'}])
      assert.deepEqual(result, {
        route: {path: '/test'},
        segments: {},
        query: {},
        fragment: ''
      })
    })
  })

  context('when the path is a root path', function () {
    it('returns an object with corresponding route', function () {
      var result = match('/', [{path: '/test2'}, {path: '/'}])
      assert.deepEqual(result, {
        route: {path: '/'},
        segments: {},
        query: {},
        fragment: ''
      })
    })
  })

  context('when the path is an empty string', function () {
    it('returns an object with corresponding route', function () {
      var result = match('', [{path: '/test2'}, {path: '/'}])
      assert.deepEqual(result, {
        route: {path: '/'},
        segments: {},
        query: {},
        fragment: ''
      })
    })
  })

  context('when the path has the leading slash', function () {
    it('returns an object with corresponding route', function () {
      var result = match('/test/', [{path: '/test2'}, {path: '/test'}])
      assert.deepEqual(result, {
        route: {path: '/test'},
        segments: {},
        query: {},
        fragment: ''
      })
    })
  })

  context('when the matching route path has the leading slash', function () {
    it('returns an object with corresponding route', function () {
      var result = match('/test', [{path: '/test2'}, {path: '/test/'}])
      assert.deepEqual(result, {
        route: {path: '/test/'},
        segments: {},
        query: {},
        fragment: ''
      })
    })
  })

  context('when the path has a query', function () {
    context('when the query params are plain strings', function () {
      it('returns an object with the parse query object', function () {
        var result = match('/test?qwe=123&asd=456', [{path: '/test2'}, {path: '/test/'}])
        assert.deepEqual(result, {
          route: {path: '/test/'},
          segments: {},
          query: {qwe: '123', asd: '456'},
          fragment: ''
        })
      })
    })

    context('when one of query params is boolean', function () {
      it('parses true', function () {
        var result = match('/test?qwe=true&asd=456', [{path: '/test2'}, {path: '/test/'}])
        assert.deepEqual(result, {
          route: {path: '/test/'},
          segments: {},
          query: {qwe: true, asd: '456'},
          fragment: ''
        })
      })

      it('parses false', function () {
        var result = match('/test?qwe=false&asd=456', [{path: '/test2'}, {path: '/test/'}])
        assert.deepEqual(result, {
          route: {path: '/test/'},
          segments: {},
          query: {qwe: false, asd: '456'},
          fragment: ''
        })
      })

      it('parses the query without value as true', function () {
        var result = match('/test?qwe&asd=456', [{path: '/test2'}, {path: '/test/'}])
        assert.deepEqual(result, {
          route: {path: '/test/'},
          segments: {},
          query: {qwe: true, asd: '456'},
          fragment: ''
        })
      })
    })

    context('when query has an array', function () {
      it('parses the array')
    })
  })

  context('when path has a fragment', function () {
    it('returns an object with fragment value', function () {
      var result = match('/test#qwe', [{path: '/test2'}, {path: '/test/'}])
      assert.deepEqual(result, {
        route: {path: '/test/'},
        segments: {},
        query: {},
        fragment: 'qwe'
      })
    })
  })

  context('when the matching route is not found', function () {
    it('returns an object where route equals null', function () {
      var result = match('/test', [{path: '/test2'}])
      assert.deepEqual(result, null)
    })
  })

  context('when the matching route has segments', function () {
    context('when the path matches the route path', function () {
      it('returns an object with corresponding route', function () {
        var result = match('/test/123', [{path: '/test2'}, {path: '/test/:id'}])
        assert.deepEqual(result, {
          route: {path: '/test/:id'},
          segments: {id: '123'},
          query: {},
          fragment: ''
        })
      })
    })

    context('when the route path has leading slash', function () {
      it('returns an object with corresponding route', function () {
        var result = match('/test/123', [{path: '/test2'}, {path: '/test/:id/'}])
        assert.deepEqual(result, {
          route: {path: '/test/:id/'},
          segments: {id: '123'},
          query: {},
          fragment: ''
        })
      })
    })

    context('when the path has leading slash', function () {
      it('returns an object with corresponding route', function () {
        var result = match('/test/123/', [{path: '/test2'}, {path: '/test/:id'}])
        assert.deepEqual(result, {
          route: {path: '/test/:id'},
          segments: {id: '123'},
          query: {},
          fragment: ''
        })
      })
    })
  })

  context('when the matching route has segments', function () {
    it('returns an object with corresponding route', function () {
      var result = match('/test/123/456', [{path: '/test2'}, {path: '/test/:first/:second'}])
      assert.deepEqual(result, {
        route: {path: '/test/:first/:second'},
        segments: {first: '123', second: '456'},
        query: {},
        fragment: ''
      })
    })
  })

  describe('buildURL', function () {
    it('builds URL from passed route', function () {
      assert.deepEqual(match.buildURL({
        route: {path: '/test/'},
        segments: {},
        query: {},
        fragment: ''
      }), '/test/')
    })

    it('considers segments', function () {
      assert.deepEqual(match.buildURL({
        route: {path: '/test/:first/:second'},
        segments: {first: '123', second: '456'},
        query: {},
        fragment: ''
      }), '/test/123/456')
    })

    it('builds search string', function () {
      assert.deepEqual(match.buildURL({
        route: {path: '/test'},
        segments: {},
        query: {qwe: true, asd: '456'},
        fragment: ''
      }), '/test?qwe&asd=456')
    })

    it('attaches the fragment', function () {
      assert.deepEqual(match.buildURL({
        route: {path: '/test'},
        segments: {},
        query: {},
        fragment: 'hello-word'
      }), '/test#hello-word')
    })

    it('works all together', function () {
      assert.deepEqual(match.buildURL({
        route: {path: '/test/:qwe'},
        segments: {qwe: 'true'},
        query: {a: 'A', b: 'B'},
        fragment: 'hello-word'
      }), '/test/true?a=A&b=B#hello-word')
    })
  })
})
