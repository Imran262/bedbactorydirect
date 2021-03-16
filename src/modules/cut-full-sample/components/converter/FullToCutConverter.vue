<template>
  <div class="full-to-cut-converter" v-if="showFullToCutConverter">
    <p>Would you like free cut sample instead? Click to change your order...</p>
    <button
      type="button"
      class="new_button update-to-free-sample"
      @click="convertFullToSample"
    >
      <span>
        <span>
          UPDATE TO FREE SAMPLES
        </span>
      </span>
    </button>
  </div>
</template>

<script>
import FullToCutConverter from '../../helpers/FullToCutConverter';
import config from 'config';
import axios from 'axios';
import { notifications } from '@vue-storefront/core/modules/cart/helpers';
import { pullCartSync, updateLocalStorageCurrentCartItem } from '../../helpers/index';
import i18n from '@vue-storefront/i18n';
import { mapGetters } from 'vuex';

const covertUrl = config.api.url + config.sampleQuote.convert_full_to_cut;

export default {
  name: 'FullToCutConverter',
  mixins: [FullToCutConverter],
  computed: {
    ...mapGetters({
      getShippingMethods: 'shipping/getShippingMethods',
      getShippingDetails: 'checkout/getShippingDetails'
    })
  },
  methods: {
    async convertFullToSample () {
      if (!this.cartId) {
        await this.getCartId();
      }

      this.$bus.$emit(
        'notification-progress-start',
        this.$t('Converting Full Samples to Cut Samples...')
      );

      // Order again the Full Size Samples for the Cut Size
      // await this.cartItems.forEach(async cartItem => {
      //   await this.orderCutSizeSample(cartItem)
      // })

      await this.convertFullSamplesToCut();
      await pullCartSync(this);

      // Now after this pull Cart sync, we will execute the totals
      let addressInformation = '{"shippingAddress":{"countryId":"GB","firstname":"","lastname":"","city":"","postcode":"","street":[""]},"billingAddress":{"firstname":"","lastname":"","city":"","postcode":"","street":[""],"countryId":""},"shippingCarrierCode":"flatrate","shippingMethodCode":"flatrate"}'
      await this.$store.dispatch('cart/getTotals', { addressInformation: JSON.parse(addressInformation), hasShippingInformation: this.getShippingMethods.carrier_code || false })
        .then(async ({ result }) => {
          let items = result.items || ((result.totals && result.totals.items) ? result.totals.items : false);
          if (items && items.length > 0) {
            for (let i = 0; i < items.length; i++) {
              this.$store.state.cart.cartItems[i].totals.price = items[i].price;
              this.$store.state.cart.cartItems[i].totals.base_price = items[i].base_price;
              this.$store.state.cart.cartItems[i].totals.base_price_incl_tax = items[i].base_price_incl_tax;
              this.$store.state.cart.cartItems[i].totals.base_row_total = items[i].base_row_total;
              this.$store.state.cart.cartItems[i].totals.base_row_total_incl_tax = items[i].base_row_total_incl_tax;
              this.$store.state.cart.cartItems[i].totals.discount_amount = items[i].discount_amount;
              this.$store.state.cart.cartItems[i].totals.discount_percent = items[i].discount_percent;
              this.$store.state.cart.cartItems[i].totals.row_total = items[i].row_total;
              this.$store.state.cart.cartItems[i].totals.row_total_incl_tax = items[i].row_total_incl_tax;
              this.$store.state.cart.cartItems[i].totals.row_total_with_discount = items[i].row_total_with_discount;
              this.$store.state.cart.cartItems[i].totals.tax_amount = items[i].tax_amount;
              this.$store.state.cart.cartItems[i].totals.base_tax_amount = items[i].base_tax_amount;
              this.$store.state.cart.cartItems[i].totals.options = JSON.parse(items[i].options);
            }
          }
          await pullCartSync(this);

          this.$bus.$emit('notification-progress-stop');

          if (!this.hasOnlyFullSampleInCart) {
            this.$store.dispatch('notification/spawnNotification', {
              type: 'success',
              message: i18n.t(
                'Converted full samples to cut samples successfully'
              ),
              action1: { label: i18n.t('OK') }
            });
          }
        })
        .catch(err => {
          console.log('err', err);
          this.$bus.$emit('notification-progress-stop');
        });

      this.$bus.$emit('notification-progress-stop');
    },
    async convertFullSamplesToCut (cartId = null) {
      await this.$store
        .dispatch('sample-quote/convertFullToCutFunction', {
          cartId: cartId || this.cartId
        })
        .then((res) => {
          if (res && res.code && res.code !== 200) {
            this.notifyUser(
              notifications.createNotification({
                type: 'error',
                message: 'Failed To Convert Samples'
              })
            );
            return false;
          }
        })
        .catch((err) => {
          this.$bus.$emit('notification-progress-stop');
          console.log('we got an error', err);
        });
    }
  }
}
</script>

<style lang="scss" scoped>
.full-to-cut-converter {
  p {
    text-align: center;
    font-size: 12px;
    font-family: Arial, serif;
    font-weight: 700;
    margin: 20px 0px;
  }

  .update-to-free-sample {
    background-color: #EB008B;
    display: block;
    font-size: 14px;
    padding: 9px 30px;
    text-align: center;
    border-radius: 3px;
    cursor: pointer;
    font-family: Arial, serif;
    height: 100%;
    min-height: 48px;
    border: 2px solid #EB008B;
    font-weight: 700;
    margin: 0 auto;
    margin-bottom: 20px;
    position: relative;
    overflow: hidden;
    -webkit-transition-duration: 0.4s;
    transition-duration: 0.4s;

    span {
      background: none !important;
      color: #fff;
    }

    &:after {
      content: "";
      background: #ff20a4;
      display: block;
      position: absolute;
      padding-top: 100px;
      padding-left: 100%;
      margin-left: -32px !important;
      margin-top: -40px;
      opacity: 0;
      transition: all 0.8s
    }

    &:active:after {
      padding: 0;
      margin: 0;
      opacity: 1;
      transition: 0s
    }
  }
}
</style>
