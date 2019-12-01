import React from 'react'

export interface Option {
  value: string
  label: string
}

export default interface Field {
  label?: string
  name: string
  type: string
  values: (Option | string)[] | (() => Promise<any>)
  multiple?: boolean
  allowEmpty?: boolean
  defaultValue?: any
  component: React.FC<any>
  requiredPermissions?: string[]
}
