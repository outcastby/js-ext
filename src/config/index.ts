import _ from 'lodash'
import Dictionary from '../interfaces/Dictionary'

let config = {} as Dictionary<any>

const set = (newConfig: Dictionary<any>): Dictionary<any> => (config = newConfig)

const setIn = (path: string | string[], value: any): Dictionary<any> => _.set(config, path, value)

const get = (path: string | string[], defaultValue?: any): any => _.get(config, path, defaultValue)

export default {
  set,
  setIn,
  get,
}
