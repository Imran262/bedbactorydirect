export default interface FilterVariant {
  id: string,
  label: string,
  type: string,
  count: string,
  from?: string,
  to?: string,
  single?: boolean
}
