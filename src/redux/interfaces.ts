export interface HandlerMap<T> {
  [key: string]: T
}
export interface Action {
  type: string
  payload: object
}

export interface Reducer {
  (state: object, action: Action): object
}
