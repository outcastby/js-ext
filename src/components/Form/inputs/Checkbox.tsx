import React from 'react'
import { InputComponentProps } from '../interfaces'
import Config from 'config'

const Checkbox: React.FC<InputComponentProps> = (props) => {
  const Component = Config.get(['jsExt', 'form', 'inputs', props.field.type])

  return <Component {...props} />
}

export default Checkbox
