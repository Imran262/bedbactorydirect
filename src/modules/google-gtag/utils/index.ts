import RootState from 'core/types/RootState';
import {Store} from 'vuex';
import config from 'config';

export const getProductBySku = async (sku: string, store: Store<RootState>) => await store.dispatch('product/single', {
  options: { sku: sku },
  setCurrentProduct: false,
  setCurrentCategoryPath: false,
  selectDefaultVariant: false
});

export const mapTransactionProductsToGtag = async (products, store: Store<RootState>) => {
  if (typeof products === 'object') {
    return Promise.all(Object.keys(products).map(async key => {
      let productID = null;
      // const product = await getProductBySku(products[key].sku, store);
      if (config && config.googleTagManager && config.googleTagManager.product_id_to_use && products[key][config.googleTagManager.product_id_to_use]) {
        productID = products[key][config.googleTagManager.product_id_to_use]
      } else {
        productID = products[key].sku || products[key].item_id
      }
      return {
        'id': productID,
        'name': products[key].name,
        'quantity': products[key].qty,
        'price': products[key].price,
        'sku': products[key].sku
      }
    }));
  }
  return Promise.all(products.map(async (item, index) => {
    const product = await getProductBySku(item.sku, store);
    return {
      'id': product.sku,
      'name': product.name,
      // 'list_name': 'Search Results',
      // 'brand': 'Google',
      // 'category': 'Apparel/T-Shirts',
      // 'variant': 'Black',
      'list_position': index + 1,
      'quantity': item.qty,
      'price': (item.extension_attributes && item.extension_attributes.final_price_incl_tax) ? item.extension_attributes.final_price_incl_tax : (item.price ? item.price * 1.2 : product.price_incl_tax)
    }
  }))
}

export const mapViewListToGtag = (products) => {
  return products.map((product, index) => {
    // console.log('mapViewListToGtag', product);
    return {
      'id': product.sku || product.pid,
      'name': product.name || product.title,
      // 'list_name': 'Category Products Listing',
      // 'brand': 'Google',
      // 'category': 'Apparel/T-Shirts',
      // 'variant': 'Black',
      'type': product?.type_id || '',
      'list_position': index + 1,
      'quantity': product?.qty || 1,
      'price': +(parseFloat(product.price_incl_tax || product.price).toFixed(2)),
      'sqm_price': product.calculated_sqm_price || product.price
    }
  });
}

export const mapProductToGtag = (product, store: Store<RootState>) => {
  const productCat = document.getElementsByClassName('LastElement')[0] ? document.getElementsByClassName('LastElement')[0].innerHTML : '';
  return {
    'ecomm_prodid': product.sku,
    'ecomm_prodname': product.name,
    'ecomm_pagetype': 'product',
    // 'list_name': 'Search Results',
    // 'brand': 'Google',
    // 'category': 'Apparel/T-Shirts',
    // 'variant': 'Black',
    // 'list_position': 1,
    // 'quantity': product.qty,
    'ecomm_pvalue': product.price_incl_tax,
    'ecomm_totalvalue': product.price_incl_tax
  }
}
