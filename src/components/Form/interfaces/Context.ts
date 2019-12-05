import Dictionary from 'interfaces/Dictionary'

export default interface Context {
  state: Dictionary<any>
  setState: (state: Dictionary<any>) => void
}
