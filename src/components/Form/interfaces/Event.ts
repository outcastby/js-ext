export default interface Event {
  target: Target
}

interface Target {
  name: string | string[]
  value: any
}
