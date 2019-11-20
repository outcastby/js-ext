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

| Name                | Type          | Example                   | Description                                                                                                                                                       |
| :------------------ | :------------ | :------------------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| path                | string        | `/cdn_servers/:id/edit`   | Any valid URL path (the same like in react-router)                                                                                                                |
| exact               | boolean       | `true`                    | When true, will only match if the path matches the location.pathname exactly. (the same like in react-router)                                                     |
| pathTo              | string        | `/build_info`             | A string representation of the Link location, created by concatenating the location’s pathname, search, and hash properties. (the same like `to` in react-router) |
| component           | React.FC<any> | `() => <div />`           | A React component to render only when the location matches. (the same like in react-router)                                                                       |
| isAuthorized        | boolean       | `true`                    | When true, the route appears only when the user is authorized                                                                                                     |
| routes              | Route[]       |                           | The list of inner routes                                                                                                                                          |
| requiredPermissions | string[]      | `['cdn_servers', 'edit']` | The list can be used inside `isPermittedRoute` function in order to filter not permitted routes                                                                   |
| redirect            | boolean       | `true`                    | When true, `<Redirect />` will be rendered. Works together with `pathTo`                                                                                          |

## Config

Allows to create common config object

```javascript
import { Config } from '@outcast.by/js-ext'
```

### Initialization

1. Create config file

   ```javascript
   // config/config.js

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

   export default function() {
     Config.set(config)
   }
   ```

### `Config.get(path, defaultValue)`

Get value from config

`path` can be string or list of strings

```javascript
Config.get(['jsExt', 'secretKey'], '')
Config.get('secretKey')
```

### `Config.setIn(path, value)`

Add new value to config after initialization

`path` can be string or list of strings

```javascript
Config.setIn(['jsExt', 'cookiesExpires'], 10)
Config.setIn('cookiesExpires', 10)
```

## Utils

### Cookies

Encrypting cookies

#### Setup
Add `secretKey` and `cookiesExpires` to `jsExt` config

Example:
```javascript
// config/common/jsExt.js

export default {
  ...
  secretKey: 'secretKey',
  cookiesExpires: 14, // days
}
```

#### Functions:
1. `Cookies.set(key, value)`
    Sets encrypted value to cookies
    ```javascript
    Cookies.set('key', 'value')
    ```
2. `Cookies.get(key)`
    Get not decrypted value from cookies
    ```javascript
    Cookies.get('key')
    ```
3. `Cookies.getDecrypted(key)`
    Get decrypted value from cookies
    ```javascript
    Cookies.getDecrypted('key')
    ```
4. `Cookies.remove(key)`
    Remove cookie by key
    ```javascript
    Cookies.remove('key')
    ```

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

We have to add `axios` in we wanna use global headers, interceptors, etc inside the main app.
`options` used as third argument for `axios.post` function

Usage example:

```javascript
import { graphql } from '@outcast.by/js-ext'

graphql.fetch(query, variables)
```

## Redux

### Api middleware

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

#### Request for api middleware

Example of action creator:

```javascript
list = (variables) => ({
  type: 'LIST',
  request: {
    query: gqlRequest,
    variables,
    multi: true,
  },
})
```

`query` - Graphql request created by `graphql-tag` lib

`variables` - variables for Graphql request

`multi` - if `true` allows to handle multi Graphql response

### `combineHandlers(handlers, defaultState)`

Creates reducer based on handlers.

Handlers is the object where key is action type (or list of action types) and value is function which return updated
state.

Example:

```javascript
const defaultState = {}

const UPDATE = 'user/UPDATE'
const SIGN_UP = 'user/SIGN_UP'
const SIGN_IN = 'user/SIGN_IN'

const HANDLERS = {
  [UPDATE]: (state, { data }) => ({ ...state, ...data }),
  [[SIGN_UP, SIGN_IN]]: (state, { data: { user } }) => ({ ...state, ...user }),
}

export default Redux.combineHandlers(HANDLERS, defaultState)
```

## Modal component

This component controls modal windows

Example:

```javascript
import React from 'react'
import { Modal } from '@outcast.by/js-ext'
import modals from '../index'

export default function BaseModal({ current }) {
  return <Modal current={current} modals={modals} />
}
```

`current` - list of names of current modals

`modals` - object where key is modal name, value is modal component

```javascript
// modals/index.js

import AlertModal from './AlertModal'
import ConfirmModal from './ConfirmModal'
import ProfileModal from './ProfileModal'

export default {
  Alert: AlertModal,
  Confirm: ConfirmModal,
  Profile: ProfileModal,
}
```
