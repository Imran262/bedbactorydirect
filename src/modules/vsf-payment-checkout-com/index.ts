import { StorefrontModule } from '@vue-storefront/core/lib/modules';
import { coreHooks } from '@vue-storefront/core/hooks';
import EventBus from '@vue-storefront/core/compatibility/plugins/event-bus'
import config from 'config'
import { TaskQueue } from '@vue-storefront/core/lib/sync'
import getApiEndpointUrl from '@vue-storefront/core/helpers/getApiEndpointUrl';
import { processLocalizedURLAddress } from '@vue-storefront/core/helpers'
import { createOrderData } from './helpers/orderObject'
import i18n from '@vue-storefront/i18n'
import checkoutSuccess from './pages/checkoutSuccess.vue'
import checkoutFailure from './pages/checkoutFailure.vue'

const METHOD_CODE = 'checkoutcom_card_payment'

declare global {
  interface Window {
    Frames: any
  }
}

const routing = [
  { name: 'checkoutComSuccess', path: '/checkoutcom/success', component: checkoutSuccess },
  { name: 'checkoutComFailure', path: '/checkoutcom/failure', component: checkoutFailure }
];

export const CheckoutcomPayments: StorefrontModule = function ({ app, store, router, moduleConfig, appConfig }) {
  router.addRoutes(routing)

  coreHooks.afterAppInit(() => {
    store.dispatch('checkout/addPaymentMethod', {
      'title': 'Debit or Credit Card',
      'code': METHOD_CODE,
      'cost': 0,
      'costInclTax': 0,
      'default': false,
      'offline': false
    })

    if (!app.$isServer) {
      let isCurrentPaymentMethod = false

      const invokePlaceOrder = () => {
        if (isCurrentPaymentMethod && window.Frames.isCardValid()) {
          store.commit('ui/setLoader', true)
          const addressInfo = createOrderData(store)
          const shippingAddress = store.getters['checkout/getShippingDetails']

          window.Frames.addEventHandler(
            window.Frames.Events.CARD_TOKENIZED,
            (event) => {
              TaskQueue.execute({
                url: processLocalizedURLAddress(getApiEndpointUrl(config.checkoutcom, 'endpoint')),
                payload: {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  mode: 'cors',
                  body: JSON.stringify({
                    'delivery_note': (shippingAddress.narrowRoad) ? shippingAddress.deliveryNoteHidden + '<br/>' + shippingAddress.deliveryNote : shippingAddress.deliveryNote + '<br/>' + shippingAddress.noOneField,
                    'payment_token': event.token,
                    'quote_id': store.state.cart.cartServerToken,
                    'card_bin': event.bin,
                    'addressInformation': addressInfo,
                    'success_url': config.checkoutcom.successUrl,
                    'failure_url': config.checkoutcom.failureUrl
                  })
                }
              })
                .then(data => {
                  console.log('data obj', data)
                  if (data.result.success && data.result.redirect_url) {
                    localStorage.setItem('checkout_3dSecure_orderId', data.result.order_id)
                    window.location.replace(data.result.redirect_url);
                  } else if (data.result.success) {
                    // store.dispatch('checkout/setThankYouPage', true)
                    // store.dispatch('cart/clear', { sync: false }, { root: true })
                    this.$router.push({ name: 'Success', params: { orderId: data.result.order_id } });
                  } else {
                    store.dispatch('notification/spawnNotification', {
                      type: 'error',
                      message: data.result.error_message,
                      action1: { label: i18n.t('OK') }
                    })
                  }
                  store.commit('ui/setLoader', false)
                  window.Frames.removeAllEventHandlers(window.Frames.Events.CARD_TOKENIZED)
                })
            }
          )
          window.Frames.submitCard()
        } else if (isCurrentPaymentMethod && !window.Frames.isCardValid()) {
          EventBus.$emit('checkout-com-validation-error')
        }
      }

      EventBus.$on('checkout-before-placeOrder', invokePlaceOrder)

      EventBus.$on('checkout-payment-method-changed', (paymentMethodCode) => {
        isCurrentPaymentMethod = paymentMethodCode === METHOD_CODE
      })
    }
  })
}
