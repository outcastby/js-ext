## Router

### `Router.resources(views, name, routes)`

Generates the list of routers based on routes and expands by CRUD routes.
Later the list would be used as props for the `SwitchRoutes` component

```javascript
import { Router } from '@outcast.by/js-ext'

// more info about settings format see https://github.com/outcastby/awesome-crud
const settings = { cdnServers: { list: {}, gql: { create: 'some query', update: 'some query', show: 'some query' } } }
const components = { New, Edit, Show, List } // the map of universal CRUD components

const views = {
  custom: { cdnServers: { CustomAction } },
  crud: { components, settings },
}
Router.resources(views, 'cdnServers', [{ routeAction: 'customAction' }])
```

### `<SwitchRoutes />`

This is the extension for react-dom-router `<Switch />`, which flexible resolves role based control, inner routing and redirects

```jsx harmony
// You have to implement the function `isPermittedRoute`
const isPermittedRoute = (route) => {
  if (route.skipPermissions) return true
  ...
}
// For CRUD should be `Router.resources` used
const routes = [
  { requiredPermissions: ['cdn_servers', 'edit'], path: '/cdn_servers/new', component: SomeComponent },
  { requiredPermissions: ['cdn_servers', 'edit'], path: '/cdn_servers/:id/edit', component: SomeComponent },
  { redirect: true, path: '/', pathTo: '/build_info' },
]

<SwitchRoutes isPermittedRoute={isPermittedRoute} routes={routes} />
```

### Interface `Route`
Name                    | Type           | Example                   | Description
:---------------------- | :--------------| :-------------------------| :-----------------------------
path                    | string         | `/cdn_servers/:id/edit`   | Any valid URL path (the same like in react-router)
exact                   | boolean        | `true`                    | When true, will only match if the path matches the location.pathname exactly. (the same like in react-router) 
pathTo                  | string         | `/build_info`             | A string representation of the Link location, created by concatenating the location’s pathname, search, and hash properties. (the same like `to` in react-router)
component               | React.FC<any>  | `() => <div />`           | A React component to render only when the location matches. (the same like in react-router)
isAuthorized            | boolean        | `true`                    | When true, the route appears only when the user is authorized
routes                  | Route[]        |                           | The list of inner routes
requiredPermissions     | string[]       | `['cdn_servers', 'edit']` | The list can be used inside `isPermittedRoute` function in order to filter not permitted routes
redirect                | boolean        | `true`                    | When true, `<Redirect />` will be rendered. Works together with `pathTo`
