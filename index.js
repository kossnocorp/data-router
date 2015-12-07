module.exports = function(fullPathStr, routes) {
  var fullPath = parseFullPath(fullPathStr)
  var matchResult = matchRoute(fullPath.path, routes)

  if (matchResult) {
    var route = matchResult.route
    var segmentValues = matchResult.segmentValues

    return {
      route: route,
      segments: parseSegments(route.path, segmentValues),
      query: parseQuery(fullPath.queryStr),
      fragment: fullPath.fragment
    }
  } else {
    return null
  }
}

function parseFullPath(fullPathStr) {
  var pathAndQueryWithFragment = fullPathStr.split(/([^\?#$]+)(.*)/).slice(1, 3)
  var path = normalize(pathAndQueryWithFragment[0] || '')
  var searchAndFragment = (pathAndQueryWithFragment[1] || '').split('#')
  var queryStr = searchAndFragment[0].slice(1)
  var fragment = searchAndFragment[1] || ''

  return {
    path: path,
    queryStr: queryStr,
    fragment: fragment
  }
}

function parseQuery(queryStr) {
  if (queryStr != '') {
    return queryStr.split('&').reduce(function(queryAcc, queryPair) {
      var keyAndValue = queryPair.split('=')
      var key = keyAndValue[0]
      var value = keyAndValue[1]

      queryAcc[key] = parseQueryValue(value)

      return queryAcc
    }, {})
  } else {
    return {}
  }
}

function parseQueryValue(value) {
  switch(value) {
    case 'true':
    // When query key has no value (no = sign)
    case undefined:
      return true
    case 'false':
      return false
    default:
      return value
  }
}

function matchRoute(path, routes) {
  for (i in routes) {
    var route = routes[i]
    var captures = path.match(toRegExp(normalize(route.path)))

    if (captures) {
      return {
        route: route,
        segmentValues: captures.slice(1)
      }
    }
  }
}

function parseSegments(routePath, segmentValues) {
  if (segmentValues) {
    var regExp = toRegExp(normalize(routePath))
    var segmentKeys = normalize(routePath).match(regExp).slice(1)

    return segmentKeys.reduce(function(segmentsAcc, segmentKey, index) {
      segmentsAcc[segmentKey.replace(/^:/, '')] = segmentValues[index]
      return segmentsAcc
    }, {})
  } else {
    return {}
  }
}

function toRegExp(path) {
  return new RegExp(path.replace(/(:\w+(?=\/|$))/g, '(.+(?=\/|$))'))
}

function normalize(path) {
  return path.replace(/\/$/, '')
}
