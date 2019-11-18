import _ from 'lodash'
import fp from './fp'

const NAMESPACE = 'dashCache'

class LocalStorage {
  private values: {}
  constructor() {
    this.values = {}
  }

  getIn(path: string | string[]): object {
    if (!Array.isArray(path)) {
      path = path.split('.')
    }
    this.values = JSON.parse(localStorage.getItem(NAMESPACE) || '')
    return fp.getIn(this.values, path)
  }

  setIn(path: string | string[], value: any): void {
    if (!Array.isArray(path)) {
      path = path.split('.')
    }
    this.values = fp.setIn(this.values, path, value)
    this.values = _.mergeWith(
      JSON.parse(localStorage.getItem(NAMESPACE) || '') || {},
      this.values,
      (oldVal, newVal) => {
        return newVal
      }
    )
    localStorage.setItem(NAMESPACE, JSON.stringify(this.values))
  }
}

export default new LocalStorage()
