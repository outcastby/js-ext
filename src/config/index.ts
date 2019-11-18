import _ from 'lodash'
import Dictionary from '../interfaces/Dictionary'

let config = {} as Dictionary<any>

const set = (newConfig: Dictionary<any>): Dictionary<any> => {
  config = newConfig
  return config
}

const setIn = (path: string | string[], value: Dictionary<any>): Dictionary<any> => {
  _.set(config, path, value)
  return config
}

const get = (path: string | string[], defaultValue?: any): any => {
  return _.get(config, path, defaultValue)
}

export default {
  set,
  setIn,
  get,
}
