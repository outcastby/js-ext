import _ from 'lodash'
import { Field, Event } from '../components/Form/interfaces'
import { Dictionary } from '../index'
import handlers from '../components/Form/handlers'
import { setIn } from './fp'
import Form from '../components/Form'

const isAvailable = ({ availableIf }: Field, value: Dictionary<any>, actionType: 'edit' | 'new'): boolean => {
  if (!availableIf) return true
  return availableIf(value || {}, actionType)
}

const getFieldByName = ([name, ...rest]: string[], fields: Field[]): Field => {
  if (_.toNumber(name) || _.toNumber(name) === 0) {
    return getFieldByName(rest, fields)
  }
  const field = fields.find((field) => field.name === name)

  if (!field) {
    throw new Error(`The field is not found for name ${name}. Check settings`)
  }

  if (rest.length) {
    return field.fields ? getFieldByName(rest, field.fields) : field
  }
  return field
}

const changeHandler = ({ target }: Event, fields: Field[], context: Form): void => {
  const name: string[] = _.isArray(target.name) ? target.name : target.name.split(',')
  const field = getFieldByName(name, fields)
  const handler = handlers[field.type] || handlers.text
  context.setState((state: Dictionary<any>) => {
    const newState = setIn(state, ['entity', ...(field.path || name)], handler(target))
    return setIn(newState, ['errors', field.name.toString()], null)
  })
}

export default {
  isAvailable,
  changeHandler,
}
