import VueGtag from 'vue-gtag'
import { Logger } from '@vue-storefront/core/lib/logger'
import { once, isServer } from '@vue-storefront/core/helpers'
import { StorefrontModule } from '@vue-storefront/core/lib/modules';
import Vue from 'vue';
import {mapTransactionProductsToGtag, getProductBySku, mapViewListToGtag, mapProductToGtag} from './utils'
import {googleGTAGModule} from './store'
import { htmlDecode } from '@vue-storefront/core/filters'
export const KEY = 'google-gtag'

export const GoogleGtagModule: StorefrontModule = function ({store, router, appConfig}) {
  if (appConfig.globalSiteTag.id && !isServer) {
    once('__VUE_EXTEND_GTAG__', () => {
      Vue.use(VueGtag, {
        config: {
          id: appConfig.globalSiteTag.id
        }
      }, router)
    })
  } else {
    Logger.warn(
      'Google Gtag extension is not working. Ensure Google Gtag account ID is defined in config',
      'GA'
    )()
  }

  store.registerModule('google-gtag', googleGTAGModule)

  const getShippingMethodTitle = (shippingMethod) => {
    const shippingMethods = store.getters['checkout/getShippingMethods']
    for (let i = 0; i < shippingMethods.length; i++) {
      if (
        shippingMethods[i].method_code === shippingMethod
      ) {
        return {
          method_title: shippingMethods[i].method_title,
          amount: shippingMethods[i].amount
        }
      }
    }
    return {
      method_title: '',
      amount: ''
    }
  }
  const GTAG: any = (Vue as any).$gtag
  if (appConfig.globalSiteTag.id && !isServer) {
    router.beforeEach(async (to, from, next) => {
      if ('parentSku' in from.params) {
        // Means its a product page
        const productSku = from.params.parentSku
        const product = await getProductBySku(productSku, store)
        GTAG.event('view_item', {
          'items': [
            {
              'id': product.sku,
              'name': product.name,
              // 'brand': 'Google',
              'category': product.category,
              'price': product.price_incl_tax
            }
          ]
        })
      }
      next()
    })
    // Begin Checkout (Step 1)
    Vue.prototype.$bus.$on('checkout-after-created', async (payload) => {
      store.commit('google-gtag/SET_BEGIN_CHECKOUT', {
        products: store.getters['cart/getCartItems'],
        option: store.state.user.current ? 'LoggedIn Checkout' : 'Guest Checkout'
      })
    })
    // Checkout step 2
    Vue.prototype.$bus.$on('checkout-after-personalDetails', async (payload) => {
      store.commit('google-gtag/SET_CHECKOUT_OPTION', {
        step: '1',
        option: store.state.user.current ? 'LoggedIn Checkout' : 'Guest Checkout'
      })
      store.commit('google-gtag/SET_CHECKOUT_STEP', {
        products: store.getters['cart/getCartItems'],
        step: '2'
      })
    })

    Vue.prototype.$bus.$on('checkout-after-shippingMethodChanged', (payload) => {
      if(payload.sourceCaller && payload.sourceCaller === 'handleOnClick'){
        console.log('payload.sourceCallerShipping', payload.sourceCaller);
        return false
      }
      const shippingMethod: any = payload ? getShippingMethodTitle(payload.method_code) : ''
      store.commit('google-gtag/SET_CHECKOUT_OPTION', {
        step: '2',
        option: 'Shipping: ' + (payload ? getShippingMethodTitle(payload.method_code).method_title : ''),
        value: shippingMethod.amount ? shippingMethod.amount : ''
      })
    })

    // Checkout step 3
    Vue.prototype.$bus.$on('checkout-after-shippingDetails', async (payload) => {
      store.commit('google-gtag/SET_CHECKOUT_STEP', {
        products: store.getters['cart/getCartItems'],
        step: '3'
      })
    })

    // Checkout step 4
    Vue.prototype.$bus.$on('checkout-after-paymentDetails', ({paymentMethod}) => {
      store.commit('google-gtag/SET_CHECKOUT_OPTION', {
        step: '3',
        option: 'Payment: ' + (paymentMethod ? paymentMethod : '')
      })
    })

    // This is for measuring purchases using checkout_com. This event is fired in Success.vue page and caught here.
    Vue.prototype.$bus.$on('checkout_com-order-placed', async (payload) => {
      // TODO: Make this into separate actions and mutations if possible.
      const orderId = payload.confirmation.orderNumber
      const platformTotals = payload.platformTotals
      const orderHistory = payload.orderHistory
      const order = orderHistory ? orderHistory.items.find((order) => order['entity_id'].toString() === orderId) : null
      let productsForCheckout: any = Object.values(payload.order.products)
      console.log('paylaod order products', productsForCheckout);
      productsForCheckout = await mapTransactionProductsToGtag(productsForCheckout, store)
      GTAG.purchase({
        'transaction_id': orderId,
        'affiliation': order ? order.store_name : '',
        'value': order ? order.total_due : platformTotals && platformTotals.base_grand_total ? platformTotals.base_grand_total : '',
        'currency': 'GBP',
        'tax': order ? order.total_due : platformTotals && platformTotals.base_tax_amount ? platformTotals.base_tax_amount : '',
        'shipping': order ? order.total_due : platformTotals && platformTotals.shipping_incl_tax ? platformTotals.shipping_incl_tax : 0,
        'items': productsForCheckout
      })
    });
    store.subscribe(async ({ type, payload }, state) => {
      // Measuring Purchase
      if (type === 'order/orders/LAST_ORDER_CONFIRMATION') {
        const orderId = payload.confirmation.orderNumber
        const orderHistory = state.user.orders_history
        const order = orderHistory ? orderHistory.items.find((order) => order['entity_id'].toString() === orderId) : null
        const platformTotals = state.cart.platformTotals
        const products = await mapTransactionProductsToGtag(payload.order.products, store);
        console.log('iGotCalledFromCheckout');

        let purchaseEventObj = {
          'transaction_id': orderId,
          'affiliation': order ? order.store_name : '',
          'value': order ? order.total_due : platformTotals && platformTotals.base_grand_total ? platformTotals.base_grand_total : '',
          'currency': 'GBP',
          'tax': order ? order.total_due : platformTotals && platformTotals.base_tax_amount ? platformTotals.base_tax_amount : '',
          'shipping': order ? order.total_due : platformTotals && platformTotals.shipping_incl_tax ? platformTotals.shipping_incl_tax : 0,
          'items': products
        };
        GTAG.purchase(purchaseEventObj);
        GTAG.event('purchase', purchaseEventObj);
      }

      // Measuring Views of Product Lists

      if (type === 'google-gtag/SET_PRODUCT_LIST') {
        GTAG.event('view_item_list', {
          'items': mapViewListToGtag(payload.products)
        })
      }

      // Measuring Views of Product Clicks
      if (type === 'google-gtag/SET_PRODUCT_CLICK') {
        GTAG.event('select_content', {
          'content_type': 'product',
          'items': [mapProductToGtag(payload.product)]
        })
      }
      // Add to cart
      if (type === 'cart/cart/ADD') {
        const product = payload.product
        GTAG.event('add_to_cart', {
          'items': [
            {
              'id': product.sku,
              'name': product.name,
              'quantity': product.qty,
              'price': product.price_incl_tax
            }
          ]
        })
      }
      // Remove from Cart
      if (type === 'cart/cart/DEL') {
        const product = payload.product
        GTAG.event('remove_from_cart', {
          'items': [
            {
              'id': product.sku,
              'name': product.name,
              'quantity': product.qty,
              'price': product.price_incl_tax
            }
          ]
        })
      }

      // Measuring Views of Checkout
      if (type === 'google-gtag/SET_BEGIN_CHECKOUT') {
        GTAG.event('begin_checkout', {
          'items': mapViewListToGtag(payload.products),
          'coupon': ''
        })
      }

      // Measuring Views of Checkout
      if (type === 'google-gtag/SET_CHECKOUT_STEP') {
        GTAG.event('checkout_progress', {
          'checkout_step': payload.step,
          'items': mapViewListToGtag(payload.products),
          'coupon': payload.coupon ? payload.coupon : ''
        })
      }

      // Measuring Views of Checkout Option
      if (type === 'google-gtag/SET_CHECKOUT_OPTION') {
        GTAG.event('set_checkout_option', {
          'checkout_step': payload.step,
          'checkout_option': payload.option
        })
      }
    })
  }
}
