import * as React from 'react'
import { Redirect, Route } from 'react-router-dom'
import Cookies from 'js-cookie'

interface PrivateRouteProps {
  title?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: React.FunctionComponent<any>
  isAuthorized: boolean
  pathTo?: string
}

const PrivateRoute: React.FunctionComponent<PrivateRouteProps> = ({
  component: Component,
  isAuthorized,
  pathTo,
  ...rest
}) => {
  const cookie = Cookies.get('token')
  return (
    <Route
      {...rest}
      render={(props): React.ReactNode =>
        (isAuthorized && cookie) || (!isAuthorized && !cookie) ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: pathTo || '/auth', state: { from: props.location } }} />
        )
      }
    />
  )
}

export default PrivateRoute
