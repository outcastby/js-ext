import { Event, Field } from './index'

export default interface InputComponentProps {
  value: any
  layout: 'horizontal' | 'vertical'
  sm?: number
  name?: string | string[]
  onChange: (event: Event) => void
  field: Field
  actionType: 'edit' | 'new'
}
