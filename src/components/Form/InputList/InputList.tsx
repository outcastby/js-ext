import React, { useEffect } from 'react'
import v4 from 'uuid/v4'
import Dictionary from 'interfaces/Dictionary'
import { Field, Event, Config } from '../interfaces'
import _ from 'lodash'

interface Props {
  config: Config
  values: Value[]
  layout: 'horizontal' | 'vertical'
  name?: string | string[]
  onChange: (event: Event) => void
  field: Field
}

interface Value {
  [key: string]: any
  __uuid: string
}

const InputList: React.FC<Props> = ({ layout, values, name, onChange, field, config }) => {
  useEffect(() => {
    // TODO (atanych): draw up the way ho to avoid the timer. The timer reason: we can not change state during setup components
    setTimeout(() => {
      handleChange(values ? values.map((v) => ({ ...v, __uuid: v4() })) : [])
    }, 200)
  }, [])

  const add = (): void => handleChange([{ __uuid: v4() }, ...values])

  const remove = ({ __uuid }: Value): void => handleChange(values.filter((v) => v.__uuid !== __uuid))

  const handleChange = (value: Value[]): void => {
    onChange({ target: { name: getFullName().join(','), value } })
  }

  const getFullName = (): string[] => {
    const fullName = name ? [...name, field.name] : [field.name]
    return _.flatten(fullName)
  }

  return (
    <config.InputList
      layout={layout}
      field={{ ...field, type: _.trim(field.type, '[]') }}
      hasLabel={!!field.label}
      values={values || []}
      name={getFullName()}
      onChange={onChange}
      onAdd={add}
      onRemove={remove}
    />
  )
}

export default InputList
