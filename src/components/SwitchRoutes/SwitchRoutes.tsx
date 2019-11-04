import React from 'react'
import { Switch, Route as RouteComponent, Redirect } from 'react-router-dom'
import _ from 'lodash'
import PrivateRoute from '../PrivateRoute'
import Route from '../../router/interfaces/Route'
interface Props {
  routes: Route[]
  filterByPermissions: (routes: Route[]) => Route[]
  routeProps: object
}

const SwitchRoutes: React.FC<Props> = ({ routes, routeProps, filterByPermissions }) => {
  return (
    <Switch>
      {filterByPermissions(routes).map((route, index) => {
        if (typeof route.isAuthorized !== 'undefined' && _.has(route, 'isAuthorized') && route.component)
          return (
            <PrivateRoute
              component={route.component}
              isAuthorized={route.isAuthorized}
              key={index}
              path={route.path}
              pathTo={route.pathTo}
            />
          )
        if (route.redirect && route.pathTo) return <Redirect from={route.path} key={index} to={route.pathTo} />
        // if (route.collapse)
        //   return route.views.map((prop, i) => {
        //     return <Route component={prop.component} exact={prop.exact} key={i} path={prop.path} strict />
        //   })
        if (routeProps && route.component) {
          const Component = route.component
          return (
            <RouteComponent
              exact={route.exact}
              key={index}
              path={route.path}
              render={(props): React.ReactNode => <Component {...props} {...routeProps} />}
              strict
            />
          )
        }
        return <RouteComponent component={route.component} exact={route.exact} key={index} path={route.path} strict />
      })}
    </Switch>
  )
}

export default SwitchRoutes
