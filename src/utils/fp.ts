import { get } from 'lodash'
import { set } from 'lodash/fp'

const getIn = get
const setIn = (object: any, path: any, value: any): any => set(path, value, object)

export default {
  getIn,
  setIn,
}
