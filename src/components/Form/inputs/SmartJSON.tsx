import React, { useState } from 'react'
import _ from 'lodash'
import { InputComponentProps, Field } from '../interfaces'
import FakeInput from './FakeInput'
import Form from 'utils/form'

const SmartJSON: React.FC<InputComponentProps> = (props) => {
  const {
    value,
    actionType,
    field: { fields = [], name, type },
    field,
    config,
  } = props

  const fieldName: string[] = _.isArray(name) ? name : [name]

  const [activeField, setActiveField] = useState(0)

  const getFields = (): Field[] => {
    return fields.reduce((result: Field[], f: Field) => {
      if (Form.isAvailable(f, value, actionType)) {
        return [...result, { ...f, name: _.flatten([...fieldName, f.name]) }]
      }
      return result
    }, [])
  }

  const Component = config.inputs[props.field.type] || FakeInput

  return (
    <Component
      {...props}
      field={{ ...field, fields: getFields() }}
      activeField={activeField}
      setActiveField={setActiveField}
    />
  )
}

export default SmartJSON
