import { mapGetters } from 'vuex';
import { isServer } from '@vue-storefront/core/helpers';
import config from 'config';
import { currentStoreView } from '@vue-storefront/core/lib/multistore';

export const PaypalButton = {
  name: 'PaypalButton',
  props: {
    styling: {
      type: Object,
      required: false,
      default: () => ({
        layout: 'vertical',
        color: 'blue',
        shape: 'rect',
        label: 'paypal'
      })
    }
  },
  computed: {
    ...mapGetters({
      token: 'payment-paypal-magento2/getToken',
      message: 'payment-paypal-magento2/getMessage'
    })
  },
  methods: {
    loadPaypalBlock () {
      console.log('432432423423423 !isServer', !isServer);
      console.log('432432423423423 config.hasOwnProperty(paypal)', config.hasOwnProperty('paypal'));
      console.log('432432423423423 document.documentElement.innerHTML.search(paypalLibTM951357)', (document.documentElement.innerHTML.search('paypalLibTM951357') === -1));
      if (!isServer && config.hasOwnProperty('paypal') && ((document.documentElement.innerHTML.search('paypalLibTM951357') === -1))) {
        const storeView = currentStoreView();
        const { currencyCode } = storeView.i18n;
        const clientId = config.paypal.hasOwnProperty('clientId') ? config.paypal.clientId : '';
        const sdkUrl = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${currencyCode}&disable-funding=card,credit`;
        let paypalScript = document.createElement('script');
        paypalScript.setAttribute('src', sdkUrl);
        paypalScript.setAttribute('data-info', 'paypalLibTM951357');
        document.head.appendChild(paypalScript);
        console.log('shouldHaveBeenLoaded');
      }
    },
    renderButton () {
      console.log('ThePayPalButtonWasDefined', window.paypal);
      if (window.paypal) {
        console.log('ThePayPalButtonWasDefined', window.paypal);
        window.paypal.Buttons({
          createOrder: this.onCreateOrder,
          onApprove: this.onApprove,
          style: this.styling
        }).render('.paypal-button');
      }
    },
    async onCreateOrder (data, actions) {
      return this.$store.dispatch('payment-paypal-magento2/createOrder')
    },
    async onApprove (data, actions) {
      let additionalMethod = {
        // magento 2 fields expects
        paypal_express_checkout_token: this.token,
        button: 1,
        paypal_express_checkout_payer_id: data.payerID,
        paypal_express_checkout_redirect_required: false
      };
      this.$bus.$emit('checkout-do-placeOrder', additionalMethod)
    }
  },
  mounted () {
    // this.loadPaypalBlock();
    // this.renderButton();
  }
};
