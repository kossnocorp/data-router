var assert = require('power-assert')
var match = require('./')

describe('match', function() {
  context('when the path and the route path are identical', function() {
    it('returns an object with corresponding route', function() {
      var result = match('/test', [{path: '/test2'}, {path: '/test'}])
      assert.deepEqual(result, {
        route: {path: '/test'},
        segments: {},
        query: {},
        fragment: ''
      })
    })
  })

  context('when the path is a root path', function() {
    it('returns an object with corresponding route', function() {
      var result = match('/', [{path: '/test2'}, {path: '/'}])
      assert.deepEqual(result, {
        route: {path: '/'},
        segments: {},
        query: {},
        fragment: ''
      })
    })
  })

  context('when the path is an empty string', function() {
    it('returns an object with corresponding route', function() {
      var result = match('', [{path: '/test2'}, {path: '/'}])
      assert.deepEqual(result, {
        route: {path: '/'},
        segments: {},
        query: {},
        fragment: ''
      })
    })
  })

  context('when the path has the leading slash', function() {
    it('returns an object with corresponding route', function() {
      var result = match('/test/', [{path: '/test2'}, {path: '/test'}])
      assert.deepEqual(result, {
        route: {path: '/test'},
        segments: {},
        query: {},
        fragment: ''
      })
    })
  })

  context('when the matching route path has the leading slash', function() {
    it('returns an object with corresponding route', function() {
      var result = match('/test', [{path: '/test2'}, {path: '/test/'}])
      assert.deepEqual(result, {
        route: {path: '/test/'},
        segments: {},
        query: {},
        fragment: ''
      })
    })
  })

  context('when the path has a query', function() {
    context('when the query params are plain strings', function() {
      it('returns an object with the parse query object', function() {
        var result = match('/test?qwe=123&asd=456', [{path: '/test2'}, {path: '/test/'}])
        assert.deepEqual(result, {
          route: {path: '/test/'},
          segments: {},
          query: {qwe: '123', asd: '456'},
          fragment: ''
        })
      })
    })
  })

  context('when path has a fragment', function() {
    it('returns an object with fragment value', function() {
      var result = match('/test#qwe', [{path: '/test2'}, {path: '/test/'}])
      assert.deepEqual(result, {
        route: {path: '/test/'},
        segments: {},
        query: {},
        fragment: 'qwe'
      })
    })
  })

  context('when the matching route is not found', function() {
    it('returns an object where route equals null', function() {
      var result = match('/test', [{path: '/test2'}])
      assert.deepEqual(result, null)
    })
  })

  context('when the matching route has segments', function() {
    context('when the path matches the route path', function() {
      it('returns an object with corresponding route', function() {
        var result = match('/test/123', [{path: '/test2'}, {path: '/test/:id'}])
        assert.deepEqual(result, {
          route: {path: '/test/:id'},
          segments: {id: '123'},
          query: {},
          fragment: ''
        })
      })
    })

    context('when the route path has leading space', function() {
      it('returns an object with corresponding route', function() {
        var result = match('/test/123', [{path: '/test2'}, {path: '/test/:id/'}])
        assert.deepEqual(result, {
          route: {path: '/test/:id/'},
          segments: {id: '123'},
          query: {},
          fragment: ''
        })
      })
    })

    context('when the path has leading space', function() {
      it('returns an object with corresponding route', function() {
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

  context('when the matching route has segments', function() {
    it('returns an object with corresponding route', function() {
      var result = match('/test/123/456', [{path: '/test2'}, {path: '/test/:first/:second'}])
      assert.deepEqual(result, {
        route: {path: '/test/:first/:second'},
        segments: {first: '123', second: '456'},
        query: {},
        fragment: ''
      })
    })
  })
})