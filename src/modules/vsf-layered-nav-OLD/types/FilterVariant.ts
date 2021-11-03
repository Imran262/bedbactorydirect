export default interface FilterVariant {
  id: string,
  label: string,
  type: string,
  from?: string,
  to?: string,
  count: string,
  single?: boolean,
  remove?: boolean
}
