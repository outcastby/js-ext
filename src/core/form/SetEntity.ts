import { Field } from '../../components/Form/interfaces'
import Dictionary from '../../interfaces/Dictionary'
import { getIn, setIn } from '../../utils/fp'
import v4 from 'uuid/v4'
import _ from 'lodash'

const setEntity = (fields: Field[], entity: Dictionary<any> = {}, parentPath: any = []): Dictionary<any> => {
  return fields.reduce((result, field) => {
    const { name, path } = field
    let value = getIn(entity, [...parentPath, ...(path || [name])])

    value =
      field.fields && !field.type?.includes('[]')
        ? setEntity(field.fields, entity, [...parentPath, ...(path || [name])])
        : getValue(field, value)

    return setIn(result, path || [name], value)
  }, {} as Dictionary<any>)
}

const getValue = (field: Field, value: any): any => (value ? normalizeValue(field, value) : getDefaultValue(field))

const getDefaultValue = ({ allowEmpty, multiple, options, type }: Field): any => {
  if (type?.includes('[]')) return []
  if (allowEmpty) return

  if (_.isArray(options) && _.isObject(options[0])) {
    // eslint-disable-next-line prettier/prettier
    return multiple ? [] : options[0]?.value
  }
}

const normalizeValue = ({ fields, type, multiple }: Field, value: any): any => {
  if (type?.includes('[]')) return normalizedJSONList(fields, value)

  if (multiple && value?.every((v: any) => _.isObject(v))) {
    return value.map((v: { id: string | number }) => v.id)
  }

  return value
}

const normalizedJSONList = (fields: Field[] | undefined, values: any[]): any[] => {
  if (fields) {
    return values.map((v: {}) => ({ ...setEntity(fields, v), __uuid: v4() }))
  } else {
    return values.map((v: {}) => ({ ...v, __uuid: v4() }))
  }
}

export default { run: setEntity }
