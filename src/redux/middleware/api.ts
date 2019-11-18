import _ from 'lodash'
import { GraphQLError } from 'graphql'
import graphql from '../../utils/graphql'
import { Action } from '../interfaces'

export interface CallbackObj {
  condition: Function
  callback: Function
}

const apiMiddleware = (invalidTokenCallback: Function, callbackList?: CallbackObj[]) => () => (next: any) => (
  action: Action
): object => {
  if (!action.request) {
    return next(action)
  }

  const REQUEST = `${action.type}_REQUEST`
  const SUCCESS = action.type
  const FAILURE = `${action.type}_FAILURE`

  next({ type: REQUEST, ..._.omit(action, ['type']) })

  return graphql
    .fetch(action.request.query, action.request.variables)
    .catch((errors) => {
      next({ type: FAILURE, errors, requestAction: action })
      if (errors.response?.data === 'invalid_access_token') { // eslint-disable-line
        invalidTokenCallback(action, errors)
      }
      return errors
    })
    .then((resp) => {
      if (resp?.data) {
        const callbackObj = callbackList?.find(({ condition }): CallbackObj | null => condition(resp))
        if (callbackObj) {
          next(callbackObj.callback(resp))
        } else if (resp.data.errors) {
          next({ type: FAILURE, errors: resp.data.errors, requestAction: action })
          throw new GraphQLError(resp.data.errors)
        } else {
          const response = action.request.multi ? resp.data.data : resp.data.data[Object.keys(resp.data.data)[0]]
          next({ type: SUCCESS, data: response, requestAction: action })
          return response
        }
      }
    })
}

export default apiMiddleware
