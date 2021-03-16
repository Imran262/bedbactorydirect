import Vue from 'vue'
import VueGtm from 'vue-gtm'
import { Store } from 'vuex'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'
import { getProductPrimaryCategory, isServer } from '@vue-storefront/core/helpers'

export const isEnabled = (gtmId: string | null) => {
  return typeof gtmId === 'string' && gtmId.length > 0 && !isServer
}

export function afterRegistration (config, store: Store<any>) {
  if (isEnabled(config.googleTagManager.id)) {
    const GTM: VueGtm = (Vue as any).gtm
    const eventModel = config.googleTagManager.eventModelName || 'eventModel';
    const storeView = currentStoreView()
    const currencyCode = storeView.i18n.currencyCode

    const getProduct = (item, priceFromTotals = false) => {
      let product = {}

      const attributeMap: string[] | Record<string, any>[] = config.googleTagManager.product_attributes
      attributeMap.forEach(attribute => {
        const isObject = typeof attribute === 'object'
        let attributeField = isObject ? Object.keys(attribute)[0] : attribute
        let attributeName = isObject ? Object.values(attribute)[0] : attribute

        if (item.hasOwnProperty(attributeField) || product.hasOwnProperty(attributeName)) {
          const value = item[attributeField] || product[attributeName]
          if (value) {
            if (priceFromTotals && item.totals && typeof item.totals.price !== 'undefined' && ['priceInclTax', 'price'].includes(attributeField)) {
              product[attributeName] = +(parseFloat(item.totals.price).toFixed(2))
            } else {
              product[attributeName] = value
            }
          }
        }
      })
      return product
    }

    Vue.prototype.$bus.$on('new-item-added-to-cart', async ({ product, diffLog }) => {
      if (!diffLog) { // Its a Cut Sample
        GTM.trackEvent({
          event: 'addToCart',
          ecommerce: {
            currencyCode: currencyCode,
            add: {
              products: [getProduct(product, true)]
            }
          }
        });
      } else {
        GTM.trackEvent({
          event: 'addToCart',
          ecommerce: {
            currencyCode: currencyCode,
            add: {
              products: [getProduct(product, false)]
            }
          }
        });
      }

      // store.commit('google-gtag/SET_CHECKOUT_OPTION', {
      //   step: '1',
      //   option: store.state.user.current ? 'LoggedIn Checkout' : 'Guest Checkout'
      // })
      // store.commit('google-gtag/SET_CHECKOUT_STEP', {
      //   products: store.getters['cart/getCartItems'],
      //   step: '2'
      // })
    })

    store.subscribe(({ type, payload }, state) => {
      switch (type) {
        // Adding a Product from a Shopping Cart
        case 'cart/cart/ADD':
          // GTM.trackEvent({
          //   event: 'addToCart',
          //   ecommerce: {
          //     currencyCode: currencyCode,
          //     add: {
          //       products: [getProduct(payload.product)]
          //     }
          //   }
          // });
          break;
        // Removing a Product from a Shopping Cart
        case 'cart/cart/DEL': // (Not Using it anymore, Using SET_REMOVE_PRODUCT now)
          // console.log('productToRemoveFromCart', payload)
          // GTM.trackEvent({
          //   event: 'removeFromCart',
          //   ecommerce: {
          //     remove: {
          //       products: [getProduct(payload.product)]
          //     }
          //   }
          // });
          break;
        // Measuring Views of Product Details
        case 'product/product/SET_PRODUCT_CURRENT':
          GTM.trackEvent({
            ecommerce: {
              detail: {
                'actionField': { 'list': '' }, // 'detail' actions have an optional list property.
                'products': [getProduct(payload)]
              }
            }
          });
          break;
        // Measuring Purchases
        case 'order/orders/LAST_ORDER_CONFIRMATION':
          const orderId = payload.confirmation.backendOrderId
          const products = payload.order.products.map(product => getProduct(product))
          store.dispatch(
            'user/getOrdersHistory',
            { refresh: true, useCache: false }
          ).then(() => {
            const orderHistory = state.user.orders_history
            const order = state.user.orders_history ? orderHistory.items.find((order) => order['entity_id'].toString() === orderId) : null
            GTM.trackEvent({
              'ecommerce': {
                'purchase': {
                  'actionField': {
                    'id': orderId,
                    'affiliation': order ? order.store_name : '',
                    'revenue': order ? order.total_due : state.cart.platformTotals && state.cart.platformTotals.base_grand_total ? state.cart.platformTotals.base_grand_total : '',
                    'tax': order ? order.total_due : state.cart.platformTotals && state.cart.platformTotals.base_tax_amount ? state.cart.platformTotals.base_tax_amount : '',
                    'shipping': order ? order.total_due : state.cart.platformTotals && state.cart.platformTotals.base_shipping_amount ? state.cart.platformTotals.base_shipping_amount : '',
                    'coupon': ''
                  },
                  'products': products
                }
              }
            })
          })
          break;
        // Removing a Product from Shopping Cart
        case 'google-tag-manager/SET_REMOVE_PRODUCT':
          let eventData = {
            event: 'removeFromCart',
            ecommerce: {
              remove: {
                products: [getProduct(payload.product)]
              }
            }
          }

          if (payload.page) {
            console.log('pageNameIs', payload.page);
            if (payload.page.includes('urldispatcher-')) {
              // It is a Product Page
              if (payload.page.includes('/p/')) {
                // eventData['eventModel'] = { 'ecomm_pagetype': 'product' };
              } else { // Else its a category page
                eventData['eventModel'] = { 'ecomm_pagetype': 'category' };
              }
            }
          }
          GTM.trackEvent(eventData);
          break;
        case 'google-gtag/SET_CHECKOUT_PAGE':
          // let productIds = []
          // if (config.googleTagManager && config.googleTagManager.product_id_to_use && payload.cartItem) {
          //   productIds = payload.cartItems.map(i => (i[config.googleTagManager.product_id_to_use] || i.sku))
          // } else {
          //   productIds = payload.cartItems.map(i => i.sku)
          // }
          //
          // let checkoutModelData = {
          //   event: 'checkout',
          //   ecommerce: {
          //     checkout: {
          //       actionField: {step}
          //     }
          //   },
          //   [eventModel]: {
          //     'ecomm_pagetype': 'product',
          //     'ecomm_prodid': product.sku,
          //     'ecomm_pname': product.name,
          //     'ecomm_pvalue': +(parseFloat(payload.product?.price_incl_tax || product.price_incl_tax).toFixed(2)),
          //     // 'ecomm_totalvalue': state && state.cart && state.cart.platformTotals && state.cart.platformTotals.grand_total ? state.cart.platformTotals.grand_total : 0
          //     'ecomm_totalvalue': +(parseFloat(product.totals?.price_incl_tax || payload.product?.price_incl_tax || product.price_incl_tax).toFixed(2))
          //   }
          // };
          //
          // GTAG.event('dynCheckout', {
          //   'ecomm_pagetype': 'checkout',
          //   'ecomm_prodid': productIds,
          //   'ecomm_totalvalue': payload.totals?.find(t => t.code === 'grand_total')?.value
          // })
          break;
        // case 'google-gtag/SET_ADD_PRODUCT':
        //   break;
      }
    })
  }
}
