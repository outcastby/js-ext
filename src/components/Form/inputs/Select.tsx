import React, { useEffect, useState } from 'react'
import _ from 'lodash'
import { InputComponentProps } from '../interfaces'
import Config from 'config'
import { Option } from '../interfaces/Field'
import FakeInput from "./FakeInput"

const Select: React.FC<InputComponentProps> = (props) => {
  const {
    onChange,
    value,
    field: { name, multiple, allowEmpty },
    field,
  } = props

  useEffect(() => {
    if (typeof field.values == 'function') {
      field.values().then((opts: (Option | string)[]) => {
        const options = normalizeOptions(opts)
        setOptions(options)
        forceChange(options[0])
      })
    } else {
      forceChange(options[0])
    }
  }, [])

  const normalizeOptions = (options: (Option | string)[] | (() => Promise<any>)): Option[] => {
    if (typeof options === 'function') return []
    if (!options) return []

    return options.map(
      (option: string | Option): Option => {
        if (typeof option === 'string') {
          return { value: option, label: option }
        }
        return option
      }
    )
  }

  const [options, setOptions] = useState(normalizeOptions(field.values))

  const forceChange = (firstValue: undefined | Option): void => {
    if (allowEmpty) return
    if (multiple && !value) return onChange({ target: { name, value: [] } })
    if (multiple && value && value.every((v: any) => _.isObject(v))) {
      return onChange({ target: { name, value: value.map((v: { id: string | number }) => v.id) } })
    }

    // eslint-disable-next-line prettier/prettier
    onChange({ target: { name, value: multiple ? [] : firstValue?.value } })
  }

  const getValue = (): any => {
    if (_.isArray(value) && value.every((v) => _.isObject(v))) {
      return value.map((v) => v.id)
    }

    // TODO (atanych): remove the line below if select will work properly
    // if (_.isObject(value) && value.value) return value.value

    return value
  }

  const Component = Config.get(['jsExt', 'form', 'inputs', props.field.type], FakeInput)

  return <Component {...props} value={getValue()} options={options} />
}

export default Select
