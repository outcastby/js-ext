import _ from 'lodash'
import { Field } from '../components/Form/interfaces'
import Dictionary from '../interfaces/Dictionary'

// eslint-disable-next-line prettier/prettier
export const isGraphQLError = (error: any): boolean => error?.constructor?.name === 'GraphQLError'

export const normalize = (serverErrors: any[], fields: Field[]): any => {
  if (_.first(serverErrors).details) {
    return _.first(serverErrors).details
  }

  const messages: string[] =
    serverErrors.length > 1 ? serverErrors.map((error) => error.message) : _.first(serverErrors).message.split('\n')

  return fields.reduce((errors: Dictionary<any>, field: Field) => {
    const error = messages.find((message) => {
      const pattern = new RegExp('(.)*"' + field.name + '": (.)*$')
      return pattern.test(message)
    })
    if (error) {
      const lastMessage = _.last(error.split(':')) as string
      errors[field.name.toString()] = [lastMessage.trim()]
    }
    return errors
  }, {})
}

export default {
  isGraphQLError,
  normalize,
}
