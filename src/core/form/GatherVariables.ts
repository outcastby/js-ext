import Dictionary from '../../interfaces/Dictionary'
import queryString from 'query-string'
import _ from 'lodash'
import Form from '../../components/Form'

const normalizeValue = (value: any, shouldBeStringified: boolean): any => {
  if (shouldBeStringified) return JSON.stringify(value)

  if (_.isArray(value) && _.every(value, (v) => _.has(v, 'value'))) return value.map((v) => v.value)

  return value
}

export default {
  run: (vars: Dictionary<any>, context: Form): Dictionary<any> => {
    const { entity, association } = context.props
    const getParams = queryString.parse(window.location.search)

    const normalizedEntity = _.reduce(
      vars,
      (sum, value, key) => ({ ...sum, [key]: normalizeValue(value, context.shouldBeStringified(key)) }),
      {}
    )

    const variables = {
      id: entity.id,
      entity: normalizedEntity,
    }

    const parentId = parseInt(getParams[`${association}_id`] as string)

    return parentId ? { ...variables, parentId } : variables
  },
}
