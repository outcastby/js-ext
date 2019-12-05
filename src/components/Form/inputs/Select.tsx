import React from 'react'
import _ from 'lodash'
import { InputComponentProps } from '../interfaces'
import { Option } from '../interfaces/Field'
import FakeInput from './FakeInput'

class Select extends React.Component<InputComponentProps, { options: Option[] }> {
  constructor(props: InputComponentProps) {
    super(props)
    this.state = {
      options: this.normalizeOptions(props.field.values || []),
    }
    if (typeof props.field.values == 'function') {
      props.field.values().then((opts: (Option | string)[]) => {
        const options = this.normalizeOptions(opts)
        this.setState({ options })
        this.forceChange(options[0])
      })
    } else {
      this.forceChange(this.state.options[0])
    }
  }
  normalizeOptions = (options: (Option | string)[] | (() => Promise<any>)): Option[] => {
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

  forceChange = (firstValue: undefined | Option): void => {
    const {
      onChange,
      value,
      field: { name, multiple, allowEmpty },
    } = this.props
    if (allowEmpty) return
    if (multiple && !value) return onChange({ target: { name, value: [] } })
    if (multiple && value && value.every((v: any) => _.isObject(v))) {
      return onChange({ target: { name, value: value.map((v: { id: string | number }) => v.id) } })
    }

    if (!value) {
      // eslint-disable-next-line prettier/prettier
      onChange({ target: { name, value: multiple ? [] : firstValue?.value } })
    }
  }

  getValue = (): any => {
    const { value } = this.props
    if (_.isArray(value) && value.every((v) => _.isObject(v))) {
      return value.map((v) => v.id)
    }

    // TODO (atanych): remove the line below if select will work properly
    // if (_.isObject(value) && value.value) return value.value

    return value
  }

  render(): any {
    const Component = this.props.config.inputs[this.props.field.type] || FakeInput

    return <Component {...this.props} value={this.getValue()} options={this.state.options} />
  }
}

export default Select
