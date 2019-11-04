import React from 'react'

export default interface Route {
  path: string
  id?: string
  name?: string
  skipPermissions?: boolean
  exact?: boolean
  pathTo?: string
  component?: React.FC<any>
  isAuthorized?: boolean
  routes?: Route[]
  requiredPermissions?: string[]
  redirect?: boolean
}
