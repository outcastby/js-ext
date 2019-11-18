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

## Config

Allow to create common config object
```javascript
import { Config } from '@outcast.by/js-ext'
```

### Initialization
1. Create config file
    ```javascript
    // config.js
    
    import jsExt from './common/jsExt'
    
    export default {
      jsExt,
      cookiesExpires: 14, // days
      secretKey: process.env.REACT_APP_SECRET_KEY,
    }
    ```
2. Create initializer for config and start it with application
    ```javascript
    import { Config } from '@outcast.by/js-ext'
    import config from '../config'
    
    export default function () {
      Config.set(config)
    }
    ```
### Get value from config
Config.get(path, defaultValue)

Example:
```javascript
Config.get(['jsExt', 'secretKey'], '')
```

### Add new value to config after initialization
Config.setIn(path, value)
Example:
```javascript
Config.setIn(['jsExt', 'cookiesExpires'], 10)
```

## Utils

### graphql
Create config file for jsExt:
```javascript
import axios from 'axios'

export default {
  axios,
  url: `${process.env.REACT_APP_SERVER_URL}/public`,
  options: { withCredentials: true },
}
```
It is necessary to add `axios` to config for using initialized in app `axios`.
`options` used as third argument for `axios.post` function 

Usage example:
```javascript
import { graphql } from '@outcast.by/js-ext'

graphql.fetch(query, variables)
```

## Api middleware
### 
Provide gql middleware for redux store
```javascript
import { Redux } from '@outcast.by/js-ext'

const callbackList = [
  {
    condition: (resp) => resp.data.errors && false,
    callback: () => alert('This callback will not called'),
  },
  {
    condition: (resp) => resp.data.errors && true,
    callback: () => alert('This callback will be called'),
  },
]
const invalidTokenCallback = (action, errors) => {
  console.log('action', action)
  console.log('errors', errors)
}

const api = Redux.apiMiddleware(invalidTokenCallback, callbackList)
```

`invalidTokenCallback` will called if `errors.response?.data === 'invalid_access_token'`

When response has no errors will be called first callback from `callbackList` where `condition` is `true`  
