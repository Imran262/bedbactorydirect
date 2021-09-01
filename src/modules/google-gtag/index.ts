import VueGtag from 'vue-gtag'
import { Logger } from '@vue-storefront/core/lib/logger'
import { once, isServer, getProductPrimaryCategory, getCategoryById } from '@vue-storefront/core/helpers'
import { StorefrontModule } from '@vue-storefront/core/lib/modules'
import Vue from 'vue'
import { mapTransactionProductsToGtag, getProductBySku, mapViewListToGtag, mapProductToGtag } from './utils'
import { googleGTAGModule } from './store'
import debounce from 'lodash-es/debounce'
import { htmlDecode } from '@vue-storefront/core/filters'

export const KEY = 'google-gtag'

export const GoogleGtagModule: StorefrontModule = function ({ store, router, appConfig }) {
  if (appConfig.globalSiteTag.id && !isServer) {
    once('__VUE_EXTEND_GTAG__', () => {
      Vue.use(VueGtag, {
        config: {
          id: appConfig.globalSiteTag.id
        },
        includes: [{
          id: appConfig.globalSiteTag.GA4_id || 'G-MQ0RMQSH9J'
        }],
        pageTrackerTemplate (to, from) {
          // Need to identify if its a category route.
          let pageTitle = to.name
          if (
            to.matched && to.matched[0] &&
            to.matched[0].instances &&
            to.matched[0].instances.default &&
            to.matched[0].instances.default.$metaInfo &&
            to.matched[0].instances.default.$metaInfo.title
          ) {
            pageTitle = to.matched[0].instances.default.$metaInfo.title
          }
          return {
            page_title: pageTitle,
            page_path: to.path
          }
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
        GTAG.set({
          'currency': 'GBP'
        })
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
    Vue.prototype.$bus.$on('checkout-after-personalDetails', debounce(async (payload) => {
      // store.commit('google-gtag/SET_CHECKOUT_OPTION', {
      //   step: '1',
      //   option: store.state.user.current ? 'LoggedIn Checkout' : 'Guest Checkout'
      // })
      let checkOutStepValue = {
        products: store.getters['cart/getCartItems'],
        option: 'Personal Details Updated',
        step: '2'
      }
      let { firstName, lastName, emailAddress } = payload
      if (emailAddress) {
        checkOutStepValue['value'] = { firstName, lastName, email: emailAddress }
      }
      store.commit('google-gtag/SET_CHECKOUT_STEP', checkOutStepValue)
      store.commit('google-gtag/SET_CHECKOUT_OPTION', checkOutStepValue)
    }, 1000))

    Vue.prototype.$bus.$on('checkout-after-shippingMethodChanged', debounce((payload) => {
      if (payload.sourceCaller && payload.sourceCaller === 'handleOnClick') {
        return false
      }
      const shippingMethod: any = payload ? getShippingMethodTitle(payload.method_code) : ''
      store.commit('google-gtag/SET_CHECKOUT_OPTION', {
        step: '2',
        option: 'Shipping: ' + (payload ? getShippingMethodTitle(payload.method_code).method_title : ''),
        value: shippingMethod.amount ? shippingMethod.amount : ''
      })
    }, 1000))

    // Checkout step 3
    Vue.prototype.$bus.$on('checkout-after-shippingDetails', async (payload) => {
      // store.commit('google-gtag/SET_CHECKOUT_STEP', {
      //   products: store.getters['cart/getCartItems'],
      //   step: '3'
      // })
    })

    // Checkout step 4
    Vue.prototype.$bus.$on('checkout-after-paymentDetails', ({ paymentMethod }) => {
      store.commit('google-gtag/SET_CHECKOUT_OPTION', {
        step: '3',
        option: 'Payment: ' + (paymentMethod || '')
      })
    })

    // Checkout step 4
    Vue.prototype.$bus.$on('checkout-payment-method-changed', debounce((paymentMethod) => {
      store.commit('google-gtag/SET_CHECKOUT_OPTION', {
        step: '3',
        option: 'Payment: ' + (paymentMethod || '')
      })
    }, 1200))

    // This is for measuring purchases using checkout_com. This event is fired in Success.vue page and caught here.
    Vue.prototype.$bus.$on('checkout_com-order-placed', async (payload) => {
      console.log('payloadShouldBe', payload);
      // TODO: Make this into separate actions and mutations if possible.
      const orderId = payload.confirmation.orderNumber
      const platformTotals = payload.platformTotals
      const orderHistory = payload.orderHistory
      const order = orderHistory ? orderHistory?.items?.find((order) => order['entity_id'].toString() === orderId) : null
      let productsForCheckout: any = Object.values(payload.order.products)
      // console.log('paylaod order products', productsForCheckout);
      productsForCheckout = await mapTransactionProductsToGtag(productsForCheckout, store)
      const totalValue = payload.order.grandtotal ? payload.order.grandtotal : 0.00
      const shippingValue = payload.order.shipping_incl_tax ? payload.order.shipping_incl_tax : 0.00
      // console.log('totalValueIs', totalValue)
      // console.log('shippingValue', shippingValue)
      // 'affiliation': (payload.order && payload.order.store_code) ? payload.order.store_code : '',
      GTAG.purchase({
        'transaction_id': orderId,
        'affiliation': 'Bed Factory Direct',
        'value': ((payload.order && payload.order.grandtotal) ? +(parseFloat(payload.order.grandtotal).toFixed(2)) : 0.00),
        'currency': 'GBP',
        'tax': order ? order.total_due : platformTotals && platformTotals.base_tax_amount ? platformTotals.base_tax_amount : '',
        'shipping': (payload.order && payload.order.shipping_incl_tax) ? +(parseFloat(payload.order.shipping_incl_tax).toFixed(2)) : 0.00,
        'items': productsForCheckout
      })
    })
    store.subscribe(async ({ type, payload }, state) => {
      // Measuring Purchase through success Page [New]
      // SET_SUCCESS_PURCHASE
      if (type === 'google-gtag/SET_SUCCESS_PURCHASE') {
        console.log("afer mutation detect", payload)
        console.log('state1', state)
        const orderId = payload.order?.confirmation?.orderNumber
        console.log('state2', state)
        const orderHistory = state.user.orders_history
        console.log('state3', state, orderHistory)
        const order = orderHistory ? orderHistory.items.find((order) => order['entity_id'].toString() === orderId) : null
        console.log('stat4', state)
        const platformTotals = state.cart.platformTotals
        console.log('stat5', state)
        const products = await mapTransactionProductsToGtag(payload.order.order.products, store)
        console.log('state6', state, payload)
        console.log('product', products)
        let productsAllPurchaseId = Object.keys(products).map(key => products[key].id)
        const productsAllNames = Object.keys(products).map(k => products[k].name)
        const productsAllVal = Object.keys(products).map(k => +(parseFloat(products[k].price).toFixed(2)))
        console.log("afer var init")
        let purchaseEventObj = {
          'ecomm_pagetype': 'purchase',
          'ecomm_prodid': productsAllPurchaseId,
          'ecomm_totalvalue': +((payload.order && payload.order.grandtotal) ? parseFloat(payload.order.grandtotal).toFixed(2) : 0.00),
          'ecomm_pname': productsAllNames,
          'ecomm_pvalue': productsAllVal,
          'transaction_id': orderId,
          'affiliation': 'Bed Factory Direct',
          'value': ((payload.order && payload.order.grandtotal) ? +(parseFloat(payload.order.grandtotal).toFixed(2)) : 0.00),
          // 'value': order ? order.total_due : platformTotals && platformTotals.base_grand_total ? platformTotals.base_grand_total : '',
          'currency': 'GBP',
          'tax': order ? order.total_due : platformTotals && platformTotals.base_tax_amount ? platformTotals.base_tax_amount : '',
          'shipping': (payload.order && payload.order.shipping_incl_tax) ? parseFloat(payload.order.shipping_incl_tax).toFixed(2) : 0.00,
          'items': products
        }
        console.log("afer obj init")
        GTAG.purchase(purchaseEventObj)
        console.log("afer event fire ")
      }

      if (type === 'google-gtag/SET_CHECKOUT_PAGE') {
        let productIds = []
        if (appConfig.googleTagManager && appConfig.googleTagManager.product_id_to_use && payload.cartItem) {
          productIds = payload.cartItems.map(i => (i[appConfig.googleTagManager.product_id_to_use] || i.sku))
        } else {
          productIds = payload.cartItems.map(i => i.sku)
        }
        const productsAllVal = payload.cartItems.map(i => parseFloat(i.price_incl_tax).toFixed(2))
        const productsAllNames = payload.cartItems.map(i => i.name)

        GTAG.event('dynCheckout', {
          'ecomm_pagetype': 'checkout',
          'ecomm_prodid': productIds,
          'ecomm_pvalue': productsAllVal,
          'ecomm_pname': productsAllNames,
          'ecomm_totalvalue': payload.totals?.find(t => t.code === 'grand_total')?.value
        })
      }
      // Measuring Views of Product Lists
      if (type === 'google-gtag/SET_PRODUCT_LIST') {
        if (payload.products && payload.isListingProducts) {
          let viewItemListData = {
            items: [mapViewListToGtag(payload.products)]
          }
          GTAG.event('view_item_list', viewItemListData)
        }

        if (payload.catName && payload.isListingProducts === false) {
          GTAG.event('dynCategory', {
            'ecomm_pagetype': 'category',
            'ecomm_category': payload.catName
          })
        }
      }

      // Measuring Views of Product Clicks
      if (type === 'google-gtag/SET_PRODUCT_CLICK') {
        let productAttribute = (appConfig.googleTagManager && appConfig.googleTagManager.product_id_to_use) ? appConfig.googleTagManager.product_id_to_use : 'sku'
        GTAG.event('select_content', {
          'content_type': 'product',
          'items': [
            {
              'id': payload.product[productAttribute],
              'name': payload.product.name,
              'price': parseFloat(payload.product.price).toFixed(2),
              'type': payload.product?.type_id,
              'list_position': 1
              // "list_name": "Search Results",
              // "brand": "Google",
              // "category": "Apparel/T-Shirts",
              // "variant": "Black",
              // "list_position": 1,
              // "quantity": 2,
            }
          ]
        })
      }

      if (type === 'google-gtag/SET_PRODUCT_CURRENT') {
        let productAttribute = (appConfig.googleTagManager && appConfig.googleTagManager.product_id_to_use) ? appConfig.googleTagManager.product_id_to_use : 'sku'
        // console.log('fetchedPayloadIs', payload);
        GTAG.event('dynProd', {
          'ecomm_pagetype': 'product',
          'ecomm_prodid': payload.product[productAttribute],
          'ecomm_pname': payload.product.name,
          'ecomm_category': payload.category,
          'ecomm_pvalue': parseFloat(payload.product.price).toFixed(2),
          'ecomm_totalvalue': parseFloat(payload.product.price).toFixed(2)
        })

        GTAG.event('view_item', {
          'items': [
            {
              'id': payload.product[productAttribute],
              'name': payload.product.name,
              'price': parseFloat(payload.product.price).toFixed(2),
              'sqm_price': payload.product?.calculated_sqm_price,
              'type': payload.product?.type_id,
              'category': payload.category,
              'list_position': 1
            }
          ]
        })
      }

      // Measuring Views of Other Clicks
      if (type === 'google-gtag/SET_HOME_CLICK') {
        let { metaInfo, path, fullPath } = payload
        if (metaInfo) {
          // console.log('metaInfo', metaInfo);
          GTAG.pageview({
            /* The page's title. */
            page_title: metaInfo?.title || metaInfo?.titleTemplate,
            /* The page's URL. */
            page_path: path,
            /* The path portion of location. This value must start with a slash (/) character. */
            page_location: fullPath
          })
        }
        GTAG.event('dynHome', {
          'ecomm_pagetype': 'home'
        })
      }

      // Measuring Views of Cart Page
      if (type === 'google-gtag/SET_OTHER') {
        GTAG.event('dynOther', {
          'content_type': 'other',
          'ecomm_pagetype': 'other'
        })
      }

      // Add to cart
      if (type === 'google-gtag/SET_ADD_PRODUCT') {
        console.log('i am add to cart mutation');
        // console.log('payLoadIs', payload, payload.category?.[0].name);
        let product = state && state.cart && state.cart.cartItems ? state.cart.cartItems[state.cart.cartItems.length - 1] : []

        if (!product && payload.product) {
          product = payload.product
        }

        let productCat = null

        if (payload.category?.[0]?.name || payload.category?.name) {
          productCat = payload.category?.[0]?.name || payload.category?.name
        }

        if (!productCat && payload.product.primary_category && payload.product.primary_category !== 'null') {
          let category = await getCategoryById(payload.product.primary_category)
          if (category && category.length > 0) {
            productCat = category[0]?.name
          }
        }


        if (product) {
          // add_to_cart from documentation: https://developers.google.com/analytics/devguides/collection/gtagjs/enhanced-ecommerce
          let productPrice = product.price_incl_tax

          if (product.totals) {
            productPrice = product.totals?.price_incl_tax
          }
          let add_to_cart_EventData = {
            'event_category': 'ecommerce',
            'event_label': 'Add To Cart',
            'items': [
              {
                'id': product?.front_end_sku || product.sku,
                'name': product.name,
                // "list_name": "Search Results",
                // "brand": "Google",
                'category': productCat,
                // "value": product.price_incl_tax,
                // "variant": "Black",
                'type': payload.type || product.type_id,
                'list_position': 1,
                'quantity': product.totals?.qty || product.qty,
                'price': productPrice,
                'sqm_price': product.calculated_sqm_price
              }
            ]
          }
          GTAG.event('add_to_cart', add_to_cart_EventData)
        }
      }
      // Remove from Cart
      if (type === 'google-gtag/SET_REMOVE_PRODUCT') {
        let removeFromCartProductType = null
        if (payload.type === 'Sample' && payload.sampleType) {
          removeFromCartProductType = payload.sampleType
        }

        // const product = state && state.cart && state.cart.cartItems ? state.cart.cartItems[state.cart.cartItems.length - 1] : [];
        let productCat = null

        if (payload.category?.[0]?.name || payload.category?.name) {
          productCat = payload.category?.[0]?.name || payload.category?.name
        }

        if (!productCat && payload.product.primary_category && payload.product.primary_category !== 'null') {
          let category = await getCategoryById(payload.product.primary_category)
          if (category && category.length > 0) {
            productCat = category[0]?.name
          }
        }

        let product = payload.product
        let remove_from_cart_EventData = {
          'event_category': 'ecommerce',
          'event_label': 'Remove From Cart',
          'items': [
            {
              'id': product?.front_end_sku || product.sku,
              'name': product.name,
              // "list_name": "Search Results",
              // "brand": "Google",
              'category': productCat,
              // "value": product.price_incl_tax,
              // "variant": "Black",
              'list_position': 1,
              'quantity': payload?.qty || product.qty,
              'price': +(product.price_incl_tax.toFixed(2)),
              'sqm_price': product.calculated_sqm_price
            }
          ]
        }
        GTAG.event('remove_from_cart', remove_from_cart_EventData)
      }

      // Measuring Views of Cart
      if (type === 'google-gtag/SET_CART') {
        const productsAll = state && state.cart && state.cart.cartItems ? state.cart.cartItems : []
        if (productsAll) {
          // product cart
          const productsAllId = productsAll.map(item => {
            if (appConfig.googleTagManager && appConfig.googleTagManager.product_id_to_use && item[appConfig.googleTagManager.product_id_to_use]) {
              return item[appConfig.googleTagManager.product_id_to_use]
            }
            return item.sku
          })

          const productsAllVal = productsAll.map(itemVal => parseFloat(itemVal.price_incl_tax).toFixed(2))
          const productsAllName = productsAll.map(itemName => itemName.name)
          const grandTotalNew = state.cart && state.cart.platformTotalSegments ? state.cart.platformTotalSegments : []
          const grandTotalFinal = grandTotalNew && grandTotalNew.length > 0 ? grandTotalNew.filter(segment => segment.code === 'grand_total' && segment.value) : []
          const grandTotalNewS = grandTotalFinal && grandTotalFinal.length > 0 ? grandTotalFinal[0] : {}
          GTAG.event('dynCart', {
            'ecomm_pagetype': 'cart',
            'ecomm_prodid': productsAllId,
            'ecomm_pname': productsAllName,
            'ecomm_pvalue': productsAllVal,
            'ecomm_totalvalue': payload.grandTotal || 0
          })
        }
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
          'checkout_option': payload.option,
          'value': payload?.value
        })
      }
    })
  }
}
