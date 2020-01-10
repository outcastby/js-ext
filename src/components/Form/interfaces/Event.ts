import Dictionary from '../../../interfaces/Dictionary'

export default interface Event {
  target: Target
}

interface Target {
  name: string | string[]
  value: any
  checked?: boolean
  files?: Dictionary<any>[]
}
