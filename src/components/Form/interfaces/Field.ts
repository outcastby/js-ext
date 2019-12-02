import React from 'react'
import Dictionary from 'interfaces/Dictionary'

export interface Option {
  value: string
  label: string
}

export default interface Field {
  label?: string
  name: string | string[]
  path?: string[]
  type: string
  values?: (Option | string)[] | (() => Promise<any>)
  multiple?: boolean
  allowEmpty?: boolean
  collapsed?: boolean
  defaultValue?: any
  component?: React.FC<any>
  requiredPermissions?: string[]
  availableIf?: (value: Dictionary<any>, actionType: 'new' | 'edit') => boolean
  fields?: Field[]
}
