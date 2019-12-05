import { Event, Field, Config } from './index'

export default interface InputComponentProps {
  config: Config
  value: any
  layout: 'horizontal' | 'vertical'
  sm?: number
  name?: string | string[]
  onChange: (event: Event) => void
  field: Field
  success: boolean
  error: boolean
  helpText: string
  actionType: 'edit' | 'new'
}
