import React from 'react'
import { Event, Field, Config } from '../interfaces'
import InputList from '../InputList'
import Dictionary from '../../../interfaces/Dictionary'
import inputs from '../inputs'
import FakeInput from '../inputs/FakeInput'

interface Props {
  actionType: 'edit' | 'new'
  value: any
  layout: 'horizontal' | 'vertical'
  grid?: Dictionary<any>
  onChange: (event: Event) => void
  success: boolean
  error: boolean
  helpText: string
  field: Field
  config: Config
  id?: number
}

const InputRow: React.FC<Props> = (props) => {
  const {
    field: { type = 'text', component, label, requiredPermissions },
    field,
    layout,
    onChange,
    value,
    config,
  } = props

  if (type.includes('[]')) {
    return <InputList layout={layout} onChange={onChange} values={value} field={field} config={config} />
  }

  const hasLabel = (): boolean => {
    if (!label) return false
    if (type === 'checkbox') return false

    return true
  }

  if (
    requiredPermissions &&
    requiredPermissions.length &&
    config.hasPermission &&
    !config.hasPermission(requiredPermissions[0])
  )
    return null

  const Input = component || inputs[type] || FakeInput

  return <config.InputRow {...props} Input={Input} hasLabel={hasLabel()} />
}

export default InputRow
