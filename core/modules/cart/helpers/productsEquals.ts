import CartItem from '@vue-storefront/core/modules/cart/types/CartItem'
import productChecksum, { getProductOptions, getAdhesiveGroutOptions, compareAdhesiveGroutProducts } from './productChecksum';

type ProductEqualCheckFn = (product1: CartItem, product2: CartItem) => boolean

// 'id' check
const getServerItemId = (product: CartItem): string | number =>
  product.server_item_id || product.item_id
const isServerIdsEquals = (product1: CartItem, product2: CartItem): boolean => {
  const product1ItemId = getServerItemId(product1)
  const product2ItemId = getServerItemId(product2)

  const areItemIdsDefined = product1ItemId !== undefined && product2ItemId !== undefined

  return areItemIdsDefined && product1ItemId === product2ItemId
}

// 'checksum' check
const getChecksum = (product: CartItem) => {
  if (product.checksum) {
    console.log('checksumForProduct', {id:product.id, name:product.name, checksum:product.checksum})
    return product.checksum
  }
  return productChecksum(product)
}
const isChecksumEquals = (product1: CartItem, product2: CartItem): boolean => {
  console.log('comparingProducts', {id: product1.id, sku:product1.sku, name: product1.name}, {id: product2.id, sku:product2.sku, name: product2.name})
  if(product1.sku === '005120' || product2.sku === '005120'){
    console.log('shouldNotBeEqualIfDiffCheckSum', getChecksum(product1), getChecksum(product2))
  }
  return getChecksum(product1) === getChecksum(product2)
}

// 'sku' check
const isSkuEqual = (product1: CartItem, product2: CartItem): boolean =>
  String(product1.sku) === String(product2.sku)

// 'parentSku' check
/*const isParentMatched = (product1: CartItem, product2: CartItem): boolean => {
  if (product1.extension_attributes) {
    let p1ExtAttributes = getAdhesiveGroutOptions(product1, 'options');
    if (p1ExtAttributes.length > 0 && p1ExtAttributes[0].value && p1ExtAttributes[0].value.parent_product_sku) {
      let result = String(product1.parentSku) === String(p1ExtAttributes[0].value.parent_product_sku);
      if (result) {
        console.log('theyGotMatched', result);
      }
      return result;
    }
  } else if (typeof product2.extension_attributes !== 'undefined' && product2.extension_attributes) {
    let p2ExtAttributes = getAdhesiveGroutOptions(product2, 'options');
    if (p2ExtAttributes.length > 0 && p2ExtAttributes[0].value && p2ExtAttributes[0].value.parent_product_sku) {
      let result = String(product1.parentSku) === String(p2ExtAttributes[0].value.parent_product_sku);
      if (result) {
        console.log('theyGotMatched', result);
      }
      return result;
    }
  }
  return false;
}*/


/**
 * Returns product equality check function
 * @param checkName - determines what type of check we want to do
 */
const getCheckFn = (checkName: string): ProductEqualCheckFn => {
  switch (checkName) {
    case 'id': {
      return isServerIdsEquals
    }
    case 'checksum': {
      return isChecksumEquals
    }
    case 'sku': {
      return isSkuEqual
    }
    default: {
      return isSkuEqual
    }
  }
}

/**
 * It passes all types of checks and returns the first passed. The order of checks matters!
 */
const makeCheck = (product1: CartItem, product2: CartItem, checks: string[]): boolean => {
  for (let checkName of checks) {
    const fn = getCheckFn(checkName)
    if (fn(product1, product2)) {
      return true
    }
  }
  return false
}

const productsEquals = (product1: CartItem, product2: CartItem): boolean => {
  if (!product1 || !product2) {
    return false
  }
  const check = makeCheck.bind(null, product1, product2)

  if (getProductOptions(product1, 'bundle_options').length || getProductOptions(product2, 'bundle_options').length) {
    // bundle options skus are merged into one sku so we can't rely on 'sku'
    // by default we want to check server_item_id ('id'), we can also use 'checksum'
    console.log('gotProductOptions', getProductOptions(product2, 'bundle_options'));
    return check(['id', 'checksum'])
  }

  if (getProductOptions(product1, 'custom_options').length || getProductOptions(product2, 'custom_options').length) {
    // in admin panel we can add different sku for specific custom option so we can't rely on 'sku'
    // by default we want to check server_item_id ('id'), we can also use 'checksum'
    return check(['id', 'checksum'])
  }

  let check1 = getAdhesiveGroutOptions(product1, 'options').length > 0 || getAdhesiveGroutOptions(product2, 'options').length > 0;

  if (getAdhesiveGroutOptions(product1, 'options').length > 0 || getAdhesiveGroutOptions(product2, 'options').length > 0 || compareAdhesiveGroutProducts(product1, product2)) {
    // in admin panel we can add different sku for specific custom option so we can't rely on 'sku'
    // by default we want to check server_item_id ('id'), we can also use 'checksum'
    if (product1.sku && product2.sku && product1.sku === product2.sku) {
      //Seems like they are same products, so just check if their options are similar as well.
      // let adhesiveGroutOptions2 = getAdhesiveGroutOptions(product2, 'options');
      // let adhesiveGroutOptions1 = getAdhesiveGroutOptions(product1, 'options');
      // console.log('JustTheAdhesiveGroutOptions', adhesiveGroutOptions1, adhesiveGroutOptions2);
      if (product1.item_id || product2.item_id) {
        if (product1.item_id) {
          // && product2.totals.options && product2.totals.options.length > 0
          if (product2.totals) {
            return product1.item_id === product2.totals.item_id
          } else if (product2.server_item_id) {
            return product1.item_id === product2.server_item_id
          }
        } else {
          if (product1.totals) {
            // && product1.totals.options && product1.totals.options.length > 0
            if (product2.item_id && product1.totals.item_id) {
              return product2.item_id === product1.totals.item_id
            }
          } else if (product1.server_item_id) {
            return product2.item_id === product1.server_item_id
          }
        }
      } else if(product1.totals && product2.totals && product1.totals.item_id && product2.totals.item_id) {
        return product1.totals.item_id === product2.totals.item_id;
      }
    }
    return false;
  }

  if (getProductOptions(product1, 'configurable_item_options').length || getProductOptions(product2, 'configurable_item_options').length) {
    // 'sku' should be uniq for configurable products
    // we can't check 'id' because it is the same when user edit product in microcart, so it can give wrong result
    return check(['sku'])
  }

  // by default we want to check if server_item_id is equal and check sku as fallback
  // this is for 'simple' and 'group' products
  // if((product1.parentSku || product2.parentSku) && (product1.parentSku !== product1.sku || product2.parentSku !== product2.sku)){
  //   return check(['parentSku'])
  // }
  return check(['id', 'sku'])
}

export default productsEquals
