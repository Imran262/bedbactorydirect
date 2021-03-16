<template>
  <div>
    <quick-checkout-model :products-in-cart="productsInCart" v-if="hasEmptySubTotal && !isCheckoutPage && !isCart && !isSuccess" />
    <template v-if="cutSampleShow">
      <cut-sample
        v-if="hasEmptySubTotal && !isCheckoutPage && !isCart && !isSuccess"
      />
    </template>
  </div>
</template>

<script>
import QuickCheckoutModel from 'theme/components/core/blocks/QuickCheckout/QuickCheckoutModel'
import CutSample from 'theme/components/core/blocks/cutsample/CutSample'
import CurrentPage from 'theme/mixins/currentPage'
import { mapGetters } from 'vuex';
export default {
  name: 'CutSampleModelHome',
  mixins: [CurrentPage],
  components: {
    QuickCheckoutModel,
    CutSample
  },
  data () {
    return {
      cutSampleShow: true
    }
  },
  beforeMount () {
    this.$bus.$on('dontShowValue', () => {
      this.cutSampleShow = true
    })
  },
  computed: {
    ...mapGetters({
      productsInCart: 'cart/getCartItems',
      totals: 'cart/getTotals'
    }),
    hasEmptySubTotal () {
      return (
        this.totals.filter((item, index) => {
          return (
            (item.code === 'subtotal' || item.code === 'subtotal_incl_tax') &&
            item.value === 0
          )
        }).length > 0
      )
    }
  },
  watch: {
    hasEmptySubTotal (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.cutSampleShow = newVal === true
      }
    }
  }
};
</script>
