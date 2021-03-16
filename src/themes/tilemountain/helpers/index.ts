import config from 'config'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'

export function getPathForStaticPage(path: string) {
  const { storeCode } = currentStoreView()
  const isStoreCodeEquals = storeCode === config.defaultStoreCode

  return isStoreCodeEquals ? `/i${path}` : path
}

export const findAncestor = (el, sel) => {
  while ((el = el.parentElement) && !((el.matches || el.matchesSelector).call(el, sel))) ;
  return el;
}
