import _ from 'lodash'
import { setIn } from '../../utils/fp'
import { Field, Event, Context } from './interfaces'
import Dictionary from 'interfaces/Dictionary'

export const baseHandler = (context: Context, field: Field, { target }: Event): void => {
  context.setState((state: Dictionary<any>) => setIn(state, field.path || [field.name], target.value))
}

export const integerHandler = (context: Context, field: Field, { target }: Event): void => {
  context.setState((state: Dictionary<any>) =>
    setIn(state, field.path || [field.name], /(^-$)|(-\D+)/.test(target.value) ? '-' : parseInt(target.value))
  )
}

export const floatHandler = (context: Context, field: Field, { target }: Event): void => {
  let { value } = target
  // If the value is "-" or the last character of the value is "0", then do nothing, because parsing will remove these characters
  if (/(^-$)|(0$)/.test(value)) {
    // If the last character of the value is ".", then check if there are any more ".". If they are, then cut the last ".". If there are no more points, then we do not change the value.
  } else if (/\d+\.$/.test(value)) {
    value = /\./.test(value.slice(0, value.length - 1)) ? value.slice(0, value.length - 1) : value

    // If after the first "-" or after "0" not a number is entered, then we cut the last character (without parsing)
  } else if (/(-\D$)|(0\D$)/.test(value)) {
    value = value.slice(0, value.length - 1)
  } else {
    value = parseFloat(value)
  }

  context.setState((state: Dictionary<any>) => setIn(state, field.path || [field.name], value))
}

export const checkboxHandler = (context: Context, field: Field, { target }: Event): void => {
  context.setState((state: Dictionary<any>) => setIn(state, field.path || [field.name], target.checked))
}

export const fileHandler = (context: Context, field: Field, { target }: Event): void => {
  context.setState((state: Dictionary<any>) => setIn(state, field.path || [field.name], _.first(target.files)))
}

const handlers: Dictionary<any> = {
  checkbox: checkboxHandler,
  text: baseHandler,
  select: baseHandler,
  datePicker: baseHandler,
  integer: integerHandler,
  float: floatHandler,
  json: baseHandler,
  file: fileHandler,
  password: baseHandler,
}

export default handlers
