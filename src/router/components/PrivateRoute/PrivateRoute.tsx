import React from 'react'
import { Redirect, Route } from 'react-router-dom'
import Cookies from 'js-cookie'

interface Props {
  title?: string
  component: React.FC<any>
  isAuthorized: boolean
  pathTo?: string
  [propName: string]: any
}

const PrivateRoute: React.FC<Props> = ({ component: Component, isAuthorized, pathTo, ...rest }) => {
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
