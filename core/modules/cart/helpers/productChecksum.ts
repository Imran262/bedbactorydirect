import CartItem from '@vue-storefront/core/modules/cart/types/CartItem'
import { sha3_224 } from 'js-sha3'
import get from 'lodash-es/get'
import flow from 'lodash-es/flow'
import cloneDeep from 'lodash-es/cloneDeep';

const replaceNumberToString = obj => {
  // if(obj.length && obj.length > 0){
  //   console.log('TheSelectedObjectShouldBe', obj);
  // }
  Object.keys(obj).forEach(key => {
    if (obj[key] !== null && typeof obj[key] === 'object') {
      return replaceNumberToString(obj[key]);
    } else if (typeof obj[key] === 'number') {
      obj[key] = String(obj[key]);
    }
  });
  return obj;
}

const customWork = value => {
  let customValues = value.map((val) => typeof val === 'string' ? JSON.parse(val) : val)
  if(value && value.length && value.length > 0){
  }
  return customValues;
}
const transformToArray = value => {
  if(value.length > 0){
  }
  return Array.isArray(value) ? value : Object.values(value)
}

export const getProductOptions = (product, optionsName) => {
  return flow([
    get,
    cloneDeep,
    transformToArray,
    replaceNumberToString
  ])(product, `product_option.extension_attributes.${optionsName}`, [])
}

export const getAdhesiveGroutOptions = (product, optionsName) => {
  return flow([
    get,
    cloneDeep,
    customWork,
    transformToArray
    // replaceNumberToString
  ])(product, `extension_attributes.${optionsName}`, [])
}

export const compareAdhesiveGroutProducts = (product1, product2) => {
  return (
    !!(product1.totals && product1.totals.options && product1.totals.options.length > 0 && product1.totals.options[0].label && product1.totals.options[0].label === 'recommendations') ||
    !!(product2.totals && product2.totals.options && product2.totals.options.length > 0 && product2.totals.options[0].label && product2.totals.options[0].label === 'recommendations')
  )
  // (product1.totals && product1.totals.options && product1.totals.options.length > 0 && product1.totals.options[0].label && product1.totals.options[0].label === 'recommendations') ||
  // (product2.totals && product2.totals.options && product2.totals.options.length > 0 && product2.totals.options[0].label && product2.totals.options[0].label === 'recommendations')
  //
}

const getDataToHash = (product: CartItem): any => {
  if (!product.product_option) {
    return null
  }


  if (typeof product.extension_attributes !== 'undefined') {
    return getAdhesiveGroutOptions(product.extension_attributes, 'options');
  }

  const supportedProductOptions = ['bundle_options', 'custom_options', 'configurable_item_options']

  // returns first options that has array with options
  for (let optionName of supportedProductOptions) {
    const options = getProductOptions(product, optionName)
    if (options.length) {
      return options
    }
  }

  // if there are options that are not supported then just return all options
  return product.product_option
}

const productChecksum = (product: CartItem): string => {
  let someCheckSum = sha3_224(JSON.stringify(getDataToHash(product)))
  console.log('checksumForProductFromProductChecksum', { id: product.id, name: product.name, checksum: someCheckSum })
  return someCheckSum;
}

export default productChecksum
