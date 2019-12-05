import { get } from 'lodash'
import { set } from 'lodash/fp'

export const getIn = (object: any, path: any): any => get(object, path)
export const setIn = (object: any, path: any, value: any): any => set(path, value, object)

export default {
  getIn,
  setIn,
}
