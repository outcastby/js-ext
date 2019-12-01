import React from 'react'
import _ from 'lodash'
import Config from 'config'
import { InputComponentProps } from '../interfaces'

const JSON: React.FC<InputComponentProps> = (props) => {
  const { onChange, value, field: { name, defaultValue, type } } = props

  const handleChange = (v: any): void => {
    // eslint-disable-next-line prettier/prettier
    onChange({ target: { value: isArray() ? v : { ...v, __uuid: value?.__uuid }, name } })
  }

  const isArray = (): boolean => _.isArray(defaultValue)

  const getValue = (): any => {
    if (isArray()) return value || defaultValue
    return _.omit(value || defaultValue, ['__uuid'])
  }

  const Component = Config.get(['jsExt', 'form', 'inputs', type])

  return <Component {...props} value={getValue()} onChange={handleChange} />
}

export default JSON
