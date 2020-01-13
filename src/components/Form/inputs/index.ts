import Proxy from './Proxy'
import SmartJSON from './SmartJSON'
import Select from './Select'
import JSON from './JSON'
import Dictionary from '../../../interfaces/Dictionary'

const inputs: Dictionary<any> = {
  text: Proxy,
  integer: Proxy,
  float: Proxy,
  checkbox: Proxy,
  datePicker: Proxy,
  json: JSON,
  smartJSON: SmartJSON,
  select: Select,
  file: Proxy,
  password: Proxy,
}

export default inputs
