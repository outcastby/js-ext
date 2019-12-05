import React from 'react'
import v4 from 'uuid/v4'
import { Field, Event, Config } from '../interfaces'
import _ from 'lodash'
import InputRow from '../InputRow'

interface Props {
  actionType: 'edit' | 'new'
  success: boolean
  error: boolean
  config: Config
  values: Value[]
  helpText: string
  layout: 'horizontal' | 'vertical'
  name?: string | string[]
  onChange: (event: Event) => void
  field: Field
}

interface Value {
  [key: string]: any
  __uuid: string
}

class InputList extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props)
    this.handleChange(props.values ? props.values.map((v) => ({ ...v, __uuid: v4() })) : [])
  }

  add = (): void => this.handleChange([{ __uuid: v4() }, ...this.props.values])

  remove = ({ __uuid }: Value): void => this.handleChange(this.props.values.filter((v) => v.__uuid !== __uuid))

  handleChange = (value: Value[]): void => {
    this.props.onChange({ target: { name: this.getFullName().join(','), value } })
  }

  getFullName = (): string[] => {
    const fullName = this.props.name ? [...this.props.name, this.props.field.name] : [this.props.field.name]
    return _.flatten(fullName)
  }

  hasLabel = (): boolean => !!this.props.field.label

  renderRow = (field: Field, index: number, extra = {}): any => {
    return (
      <InputRow
        key={index}
        {...this.props}
        field={{
          ...field,
          name: [...this.getFullName(), index.toString()],
          label: this.hasLabel() ? undefined : field.label,
        }}
        grid={{ input: 9, right: 0, label: 3 }}
        value={this.props.values[index]}
        {...extra}
      />
    )
  }

  render() {
    const { layout, values, onChange, field, config } = this.props

    return (
      <config.InputList
        layout={layout}
        renderRow={this.renderRow}
        field={{ ...field, type: _.trim(field.type, '[]') }}
        hasLabel={this.hasLabel()}
        values={values || []}
        name={this.getFullName()}
        onChange={onChange}
        onAdd={this.add}
        onRemove={this.remove}
      />
    )
  }
}

export default InputList
