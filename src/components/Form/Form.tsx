import React from 'react'
import queryString from 'query-string'
import _ from 'lodash'
import { getIn, setIn } from 'utils/fp'
import { normalize, isGraphQLError } from 'utils/errors'
import FormUtils from 'utils/form'
import { Event, Settings, Config as IConfig } from './interfaces'
import Dictionary from '../../interfaces/Dictionary'
import Config from '../../config'
import InputRow from './InputRow'

const STRINGIFIED_TYPES = ['smartJSON', 'json']

interface Props {
  config?: IConfig
  settings: Settings
  entity: Dictionary<any>
  customButtons: (context: { onSubmit: () => void }) => React.FC<any>
  type: 'new' | 'edit'
  association: string
  gatherVariables?: (vars: Dictionary<any>) => Dictionary<any>
  onSuccess?: () => Promise<any>
  onSubmit: (vars: Dictionary<any>) => Promise<any>
}

// TODO (atanych): use FP component after reducing multiple updates of state
class Form extends React.Component<Props, { errors?: Dictionary<any> }> {
  constructor(props: Props) {
    super(props)
    this.state = props.settings.fields.reduce((result, { name, path }) => {
      const value = getIn(props.entity, path || [name])
      return setIn(result, path || [name], value)
    }, {})
  }

  onChange = (event: Event): void => FormUtils.changeHandler(event, this.props.settings.fields, this)

  // TODO (atanych): sort out and simplify
  gatherVariables(vars: Dictionary<any>): Dictionary<any> {
    const { entity, association } = this.props
    const getParams = queryString.parse(window.location.search)
    let normalizedEntity = _.omit(vars, 'errors')

    normalizedEntity = _.reduce(
      normalizedEntity,
      (sum, value, key) => {
        const formatValue = this.shouldBeStringified(key) ? JSON.stringify(value) : value
        return { ...sum, [key]: formatValue }
      },
      {}
    )

    let variables: Dictionary<any> = {
      id: entity.id,
      entity: normalizedEntity,
    }

    const parentId = parseInt(getParams[`${association}_id`] as string)
    if (parentId) {
      variables = { ...variables, parentId }
    }
    return variables
  }

  shouldBeStringified = (name: string): boolean => {
    const field = this.props.settings.fields.find((field) => field.name === name)
    // eslint-disable-next-line prettier/prettier
    if (!field?.type) return false
    if (field.type.includes('[]')) return true
    return STRINGIFIED_TYPES.includes(field.type)
  }

  removeUUID = (variables: any): Dictionary<any> => {
    if (_.isArray(variables)) {
      return variables.map((b) => {
        return _.isObject(b) ? _.omit(b, ['__uuid']) : b
      })
    }
    if (variables instanceof File) {
      return variables
    }
    if (_.isObject(variables)) {
      return _.reduce(variables, (res, branch, key) => ({ ...res, [key]: this.removeUUID(branch) }), {})
    }
    return variables
  }

  onSubmit = (): void => {
    const { onSubmit, gatherVariables, onSuccess } = this.props
    let variables = _.reduce(this.state, (res, branch, key) => ({ ...res, [key]: this.removeUUID(branch) }), {})
    variables = gatherVariables ? gatherVariables(variables) : this.gatherVariables(variables)
    onSubmit({ variables })
      .catch((error: any) => {
        if (isGraphQLError(error) && error.message.length > 0) {
          this.setState({ errors: normalize(error.message, this.props.settings.fields) })
        }
      })
      .then((res: any) => {
        if (res) {
          onSuccess ? onSuccess() : window.history.back()
        }
      })
  }

  render(): any {
    const Component = this.props.config?.Form || Config.get(['jsExt', 'form', 'Form']) // eslint-disable-line
    const errors = this.state.errors || {}
    const settings = { ...this.props.settings, layout: this.props.settings.layout || 'horizontal' }
    return (
      <Component
        {...this.props}
        errors={errors}
        onSubmit={this.onSubmit}
        state={this.state}
        settings={settings}
        onChange={this.onChange}
      >
        {this.props.settings.fields.map((field) => {
          const value = getIn(this.state, field.path || [field.name])
          return (
            <InputRow
              actionType={this.props.type}
              config={this.props.config || Config.get(['jsExt', 'form'])}
              error={!!errors[field.name as string]}
              field={field}
              helpText={errors[field.name as string] ? errors[field.name as string][0] : ''}
              id={this.props.entity.id}
              key={field.name.toString()}
              layout={settings.layout}
              onChange={this.onChange}
              success={false}
              value={value === 0 ? 0 : value || ''}
            />
          )
        })}
      </Component>
    )
  }
}

export default Form
