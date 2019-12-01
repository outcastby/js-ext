import React from 'react'

// const STRINGIFIED_TYPES = ['smartJSON', 'json']

interface Props {
  a: string
}

const Form: React.FC<Props> = ({ a }) => {
  return <>{a}</>
}

export default Form
