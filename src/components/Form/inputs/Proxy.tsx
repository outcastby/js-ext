import React from 'react'
import { InputComponentProps } from '../interfaces'
import Config from 'config'
import FakeInput from './FakeInput'

const Proxy: React.FC<InputComponentProps> = (props) => {
  const Component = Config.get(['jsExt', 'form', 'inputs', props.field.type || 'text'], FakeInput)

  return <Component {...props} />
}

export default Proxy
