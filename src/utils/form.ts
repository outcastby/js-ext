import { Field } from '../components/Form/interfaces'
import { Dictionary } from '../index'

const isAvailable = ({ availableIf }: Field, value: Dictionary<any>, actionType: 'edit' | 'new'): boolean => {
  if (!availableIf) return true
  return availableIf(value || {}, actionType)
}

export default {
  isAvailable,
}
