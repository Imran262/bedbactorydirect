import RootState from 'core/types/RootState';
import {Store} from 'vuex';

export const getProductBySku = async (sku: string, store: Store<RootState>) => {
  const product = await store.dispatch('product/single', {
    options: { sku: sku },
    setCurrentProduct: false,
    setCurrentCategoryPath: false,
    selectDefaultVariant: false
  })
  return product
}

export const mapTransactionProductsToGtag = async (products, store: Store<RootState>) => {
  console.log('mapTransactionProductsToGtag Products', products);
  return Promise.all(products.map(async item => {
    const product = await getProductBySku(item.sku, store);
    return {
      'id': product.sku,
      'name': product.name,
      // 'list_name': 'Search Results',
      // 'brand': 'Google',
      // 'category': 'Apparel/T-Shirts',
      // 'variant': 'Black',
      // 'list_position': 1,
      'quantity': item.qty,
      'price': (item.extension_attributes && item.extension_attributes.final_price_incl_tax)? item.extension_attributes.final_price_incl_tax : (item.price ? item.price * 1.2 : product.price_incl_tax)
    }
  }))
}

export const mapViewListToGtag = (products) => {
  return products.map(product => {
    return {
      'id': product.sku,
      'name': product.name,
      // 'list_name': 'Search Results',
      // 'brand': 'Google',
      // 'category': 'Apparel/T-Shirts',
      // 'variant': 'Black',
      // 'list_position': 1,
      'quantity': product.qty,
      'price': product.price_incl_tax
    }
  })
}

export const mapProductToGtag = (product) => {
  return {
    'id': product.sku,
    'name': product.name,
    // 'list_name': 'Search Results',
    // 'brand': 'Google',
    // 'category': 'Apparel/T-Shirts',
    // 'variant': 'Black',
    // 'list_position': 1,
    // 'quantity': product.qty,
    'price': product.price_incl_tax
  }
}
