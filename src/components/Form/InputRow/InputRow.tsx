import React from 'react'
import { Event, Field } from '../interfaces'
import Config from 'config'
import InputList from '../InputList'
import Dictionary from '../../../interfaces/Dictionary'
import inputs from '../inputs'
import FakeInput from '../inputs/FakeInput'

interface Props {
  value: any
  layout: 'horizontal' | 'vertical'
  grid: Dictionary<any>
  onChange: (event: Event) => void
  success: boolean
  error: boolean
  helpText: string
  field: Field
  id?: number
  history: Location
}

const InputRow: React.FC<Props> = (props) => {
  const {
    field: { type = 'text', component, label, requiredPermissions },
    field,
    layout,
    onChange,
    value,
  } = props

  if (type.includes('[]')) {
    return <InputList layout={layout} onChange={onChange} values={value} field={field} />
  }

  const hasLabel = (): boolean => {
    if (!label) return false
    if (type === 'checkbox') return false

    return true
  }

  const hasPermission = Config.get(['jsExt', 'form', 'hasPermissions'])

  if (requiredPermissions && requiredPermissions.length && hasPermission && !hasPermission(requiredPermissions[0]))
    return null

  const Component = Config.get(['jsExt', 'form', 'InputRow'])
  const Input = component || inputs[type] || FakeInput

  return <Component {...props} Input={Input} hasLabel={hasLabel()} />
}

export default InputRow
