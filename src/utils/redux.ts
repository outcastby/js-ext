import _ from 'lodash'

interface HandlerMap<T> {
  [key: string]: T
}
export interface Action {
  type: string
  payload: object
}

interface Reducer {
  (state: object, action: Action): object
}

export const buildHandler = (handlers: HandlerMap<Reducer>): HandlerMap<Reducer> => {
  return _.reduce(
    handlers,
    (result: HandlerMap<Reducer>, value: Reducer, keyString: string): HandlerMap<Reducer> => {
      keyString.split(',').map((key) => (result[key] = value))
      return result
    },
    {}
  )
}

const combineHandlers = (handlers: HandlerMap<Reducer>, defaultState: object): object => {
  return function reducer(state: object = defaultState, action: Action) {
    const handler = handlers[action.type]
    return handler ? handler(state, action) : state
  }
}

export default {
  combineHandlers: (handlers: HandlerMap<Reducer>, defaultState: object) => combineHandlers(handlers, defaultState),
}
