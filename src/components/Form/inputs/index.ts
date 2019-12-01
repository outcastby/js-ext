import Text from './Text'
import Checkbox from './Checkbox'
// import SmartJSON from './SmartJSON'
import Select from './Select'
import JSON from './JSON'
// import DatePicker from './DatePicker'
// import File from './File'
import Dictionary from 'interfaces/Dictionary'

const inputs: Dictionary<any> = {
  text: Text,
  integer: Text,
  float: Text,
  checkbox: Checkbox,
  // datePicker: DatePicker,
  json: JSON,
  // smartJSON: SmartJSON,
  select: Select,
  // file: File,
  password: Text,
}

export default inputs
