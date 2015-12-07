# data-router

Minimalistic routes matching library that plays nicely with
unidirection data flow. data-router is universal and works both in a browser
and Node.js.

Unlike most of alternative solutions data-router inverses the data flow.
Instead of calling an associated action (e.g. render specific component),
it gives you a data:

- Route object (name, path pattern, any custom data),
- parsed segments (e.g. `/users/:userId`),
- the query object (`?qwe&asd=zxc`),
- the fragment (hash).

## Usage

Match function is the only function of data-router:

```js
var matchRoute = require('data-router')

var routeData = matchRoute(
  // First argument is a full path string (pathname + query + fragment)
  // /users/12/projects/34?qwe&asd=zxc#testtest
  location.pathname + location.search + location.hash,
  // Second argument is an array of route objects:
  [
    {
      // path is the only required property,
      path: '/users/:userId/projects/:projectId',
      // But you could be useful to add extra data:
      name: 'projectPath',
      layout: 'app'
    },
    {
      path: '/about',
      name: 'publicPage'
      layout: 'public',
      pageId: '/about'
    }
  ]
)
```

The result:

```js
{
  route: {
    path: '/users/:userId/projects/:projectId',
    name: 'projectPath',
    layout: 'app'
  },
  segments: {
    userId: '12',
    projectId: '34'
  },
  query: {
    qwe: true,
    asd: 'zxc'
  },
  fragment: 'testtest'
}
```

## License

MIT
