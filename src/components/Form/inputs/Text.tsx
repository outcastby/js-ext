import React from 'react'
import Config from 'config'
import { InputComponentProps } from '../interfaces'

const Text: React.FC<InputComponentProps> = (props) => {
  const Component = Config.get(['jsExt', 'form', 'inputs', props.field.type || 'text'])

  return <Component {...props} />
}

export default Text
