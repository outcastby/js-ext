import Dictionary from '../../interfaces/Dictionary'
import queryString from 'query-string'
import _ from 'lodash'
import Form from '../../components/Form'

export default {
  run: (vars: Dictionary<any>, context: Form): Dictionary<any> => {
    const { entity, association } = context.props
    const getParams = queryString.parse(window.location.search)

    const normalizedEntity = _.reduce(
      vars,
      (sum, value, key) => ({ ...sum, [key]: context.shouldBeStringified(key) ? JSON.stringify(value) : value }),
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
